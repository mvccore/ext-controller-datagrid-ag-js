namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSource {
		public Static: typeof MultiplePagesMode;

		protected eventsManager: AgGrids.EventsManagers.MultiplePagesMode;

		public constructor (grid: AgGrid) {
			super(grid);
			this.eventsManager = grid.GetEvents() as AgGrids.EventsManagers.MultiplePagesMode;

			this.initPageReqDataAndCache();
			this.BrowserHistoryReplace(
				this.pageReqData, location.href, 
				this.initialData.page, this.initialData.count
			);
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
			var reqData: Interfaces.Ajax.IReqRawObj = this.helpers.RetypeRequestMaps2Objects({
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
				this.AjaxLoad(
					reqDataUrl, reqMethod, reqData, reqType, (rawResponse: AgGrids.Interfaces.Ajax.IResponse): void => {
						this.handleResponse(reqData, changeUrl, cacheKey, false, rawResponse);
					}
				);
				/*Ajax.load(<Ajax.LoadConfig>{
					url: reqDataUrl,
					method: reqMethod,
					data: reqData,
					type: reqType,
					success: this.handleResponse.bind(this, reqData, changeUrl, cacheKey, false)
				});*/
			}
			return this;
		}
		protected handleResponse (reqData: Interfaces.Ajax.IReqRawObj, changeUrl: boolean, cacheKey: string, cached: boolean, rawResponse: AgGrids.Interfaces.Ajax.IResponse): void {
			var response: AgGrids.Interfaces.Ajax.IResponse;
			if (cached) {
				response = rawResponse;	
			} else {
				response = this.helpers.RetypeRawServerResponse(rawResponse);
				this.cache.Add(cacheKey, response);

				//this.grid.GetEvents().HandleResponseLoaded(response);
			}

			var agGridApi: agGrid.GridApi<any> = this.optionsManager.GetAgOptions().api;
			agGridApi.setRowData(response.data);
			agGridApi.hideOverlay();

			if (cached) {
				if (this.autoSelectFirstRow)
					this.grid.GetEvents().SelectRowByIndex(0);
			} else {
				this.grid.GetEvents().HandleResponseLoaded(response, this.autoSelectFirstRow);
			}
			
			if (response.controls != null) {
				this.optionsManager.InitBottomControls();
				this.handleResponseControls(response);
			}
			
			if (changeUrl) {
				reqData.path = response.path;
				this.BrowserHistoryPush(
					reqData, response.url, 
					response.page, response.count
				);
				this.grid.GetColumnsVisibilityMenu().UpdateFormAction(response.path);
			}
		}
		protected handleResponseControls (response: AgGrids.Interfaces.Ajax.IResponse): void {
			super.handleResponseControls(response);
			var elms = this.optionsManager.GetElements(),
				controls = response.controls;
			if (elms.countScalesControl != null) {
				if (controls.countScales == null) {
					this.eventsManager.RemoveCountScalesEvents();
					elms.countScalesControl.innerHTML = '';
					this.optionsManager.InitBottomControlsCountScales();
				} else {
					this.eventsManager.RemoveCountScalesEvents();
					elms.countScalesControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.countScales),
						elms.countScalesControl
					);
					this.optionsManager.InitBottomControlsCountScales();
					this.eventsManager.AddCountScalesEvents();
				}
			}
			if (elms.pagingControl != null) {
				if (controls.paging == null) {
					this.eventsManager.RemovePagingEvents();
					elms.pagingControl.innerHTML = '';
					this.optionsManager.InitBottomControlsPaging();
				} else {
					this.eventsManager.RemovePagingEvents();
					elms.pagingControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.paging),
						elms.pagingControl
					);
					this.optionsManager.InitBottomControlsPaging();
					this.eventsManager.AddPagingEvents();
				}
			}
		}
	}
}