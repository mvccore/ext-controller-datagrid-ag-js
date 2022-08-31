namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSource {
		public Static: typeof MultiplePagesMode;

		protected eventsManager: AgGrids.EventsManagers.MultiplePagesMode;
		protected cache: MultiplePagesModes.Cache;

		public constructor (grid: AgGrid) {
			super(grid);
			this.eventsManager = grid.GetEvents() as AgGrids.EventsManagers.MultiplePagesMode;

			this.initPageReqDataAndCache();
			history.replaceState(this.pageReqData, document.title, location.href);
			this.pageReqData = null;
			
		}

		protected initPageReqDataAndCache (): void {
			super.initPageReqDataAndCache();
			var elms = this.grid.GetOptions().GetElements();
			if (elms.bottomControlsElement != null) {
				this.initialData.controls = {};
				if (elms.pagingControl != null)
					this.initialData.controls.paging = elms.pagingControl.outerHTML;
				if (elms.statusControl != null)
					this.initialData.controls.status = elms.statusControl.outerHTML;
				if (elms.countScalesControl != null)
					this.initialData.controls.countScales = elms.countScalesControl.outerHTML;
			}
			this.cache.Add(this.cache.Key(this.pageReqData), this.initialData);
		}

		public Load (): this {
			var reqData: Interfaces.IServerRequestRaw = this.helpers.RetypeRequest2RawRequest({
				offset: this.grid.GetOffset(),
				limit: this.grid.GetServerConfig().itemsPerPage,
				sorting: this.grid.GetSorting(),
				filtering: this.grid.GetFiltering(),
			});
			return this.ExecRequest(reqData, true);
		}
		public ExecRequest (reqData: Interfaces.IServerRequestRaw, changeUrl: boolean = true): this {
			var agGridApi: agGrid.GridApi<any> = this.options.GetAgOptions().api;
			agGridApi.showLoadingOverlay();
			var [reqDataUrl, reqMethod, reqType] = this.getReqUrlMethodAndType();
			var cacheKey = this.cache.Key(reqData);
			if (this.cache.Has(cacheKey)) {
				this.handleResponse(
					reqData,
					changeUrl,
					cacheKey,
					true,
					this.cache.Get(cacheKey)
				);
			} else {
				Ajax.load(<Ajax.LoadConfig>{
					url: reqDataUrl,
					method: reqMethod,
					data: reqData,
					type: reqType,
					success: this.handleResponse.bind(this, reqData, changeUrl, cacheKey, false)
				});
			}
			return this;
		}
		protected handleResponse (reqData: Interfaces.IServerRequestRaw, changeUrl: boolean, cacheKey: string, cached: boolean, response: AgGrids.Interfaces.IServerResponse): void {
			if (!cached) {
				response = this.helpers.RetypeRawServerResponse(response);
				this.cache.Add(cacheKey, response);
			}

			var agGridApi: agGrid.GridApi<any> = this.options.GetAgOptions().api;
			agGridApi.setRowData(response.data);
			agGridApi.hideOverlay();

			if (response.controls != null) {
				this.options.InitBottomControls();
				var elms = this.options.GetElements(),
					controls = response.controls;
				if (elms.countScalesControl != null && controls.countScales != null) {
					elms.countScalesControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.countScales),
						elms.countScalesControl
					);
				}
				if (elms.statusControl != null && controls.status != null) {
					elms.statusControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.status),
						elms.statusControl
					);
				}
				if (elms.pagingControl != null && controls.paging != null) {
					this.eventsManager.RemovePagingEvents();
					elms.pagingControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.paging),
						elms.pagingControl
					);
					this.options.InitBottomControls();
					this.eventsManager.AddPagingEvents();
				}
			}
			
			if (changeUrl)
				history.pushState(reqData, document.title, response.url);

			// TODO: set up sorting and filtering from server
			
			// TODO: change url
		}

	}
}