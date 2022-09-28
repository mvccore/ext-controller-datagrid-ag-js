namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSource {
		public Static: typeof MultiplePagesMode;

		protected eventsManager: AgGrids.EventsManagers.MultiplePagesMode;

		public constructor (grid: AgGrid) {
			super(grid);
			this.eventsManager = grid.GetEvents() as AgGrids.EventsManagers.MultiplePagesMode;

			this.initPageReqDataAndCache();
			history.replaceState(this.pageReqData, document.title, location.href);
			this.pageReqData = null;
		}

		protected initPageReqDataAndCache (): void {
			super.initPageReqDataAndCache();
			var elms = this.grid.GetOptionsManager().GetElements();
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
			var reqData: Interfaces.Ajax.IReqRawObj = this.Static.RetypeRequestMaps2Objects({
				offset: this.grid.GetOffset(),
				limit: this.grid.GetLimit(),
				sorting: this.grid.GetSorting(),
				filtering: this.grid.GetFiltering(),
			});
			return this.ExecRequest(reqData, true);
		}
		public ExecRequest (reqData: Interfaces.Ajax.IReqRawObj, changeUrl: boolean = true): this {
			var agGridApi: agGrid.GridApi<any> = this.optionsManager.GetAgOptions().api;
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
		protected handleResponse (reqData: Interfaces.Ajax.IReqRawObj, changeUrl: boolean, cacheKey: string, cached: boolean, rawResponse: AgGrids.Interfaces.Ajax.IResponse): void {
			var response: AgGrids.Interfaces.Ajax.IResponse;
			if (cached) {
				response = rawResponse;	
			} else {
				response = this.Static.RetypeRawServerResponse(rawResponse);
				this.cache.Add(cacheKey, response);

				//this.grid.GetEvents().HandleResponseLoaded(response);
			}

			var agGridApi: agGrid.GridApi<any> = this.optionsManager.GetAgOptions().api;
			agGridApi.setRowData(response.data);
			agGridApi.hideOverlay();

			if (cached) {
				this.grid.GetEvents().SelectRowByIndex(0);
			} else {
				this.grid.GetEvents().HandleResponseLoaded(response, true);
			}
			
			if (response.controls != null) {
				this.optionsManager.InitBottomControls();
				this.handleResponseControls(response);
			}
			
			if (changeUrl) {
				reqData.path = response.path;
				history.pushState(reqData, document.title, response.url);
				this.grid.GetColumnsVisibilityMenu().UpdateFormAction();
			}
		}
		protected handleResponseControls (response: AgGrids.Interfaces.Ajax.IResponse): void {
			super.handleResponseControls(response);
			var elms = this.optionsManager.GetElements(),
				controls = response.controls;
			if (elms.countScalesControl != null) {
				if (controls.countScales == null) {
					elms.countScalesControl.innerHTML = '';
				} else {
					elms.countScalesControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.countScales),
						elms.countScalesControl
					);
				}
			}
			if (elms.pagingControl != null) {
				if (controls.paging == null) {
					this.eventsManager.RemovePagingEvents();
					elms.pagingControl.innerHTML = '';
					this.optionsManager.InitBottomControls();
				} else {
					this.eventsManager.RemovePagingEvents();
					elms.pagingControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.paging),
						elms.pagingControl
					);
					this.optionsManager.InitBottomControls();
					this.eventsManager.AddPagingEvents();
				}
			}
		}

	}
}