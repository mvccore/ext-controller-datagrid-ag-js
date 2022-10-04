namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSource implements agGrid.IDatasource {
		public Static: typeof SinglePageMode;
		/** If you know up front how many rows are in the dataset, set it here. Otherwise leave blank. */
		public rowCount?: number = undefined;
		protected pageLoadedState: number;
		protected initDataCache: boolean;
		protected requestCounter: number;
		protected changeUrlSwitches: Map<string, boolean>;
		protected initLocationHref: string;
		
		protected scrolled: boolean;
		protected autoSelectFirstRow: boolean = false;
		specialCase: boolean;
		
		public SetBodyScrolled (scrolled: boolean): this {
			this.scrolled = scrolled;
			return this;
		}

		public constructor (grid: AgGrid) {
			super(grid);
			this.scrolled = false;
			this.pageLoadedState = 0;
			this.initDataCache = this.grid.GetServerConfig().clientMaxRowsInCache > 0;
			this.requestCounter = 0;
			this.initLocationHref = location.href;

			this.initPageReqDataAndCache();
			this.browserHistoryReplace(
				this.pageReqData, location.href, 
				this.initialData.page, this.initialData.count
			);
			//this.pageReqData = null;

			this.changeUrlSwitches = new Map<string, boolean>();
		}

		protected initPageReqDataAndCache (): void {
			super.initPageReqDataAndCache();
			this.cache.SetEnabled(true);
			this.cache.Add(this.cache.Key(this.pageReqData), <Interfaces.Ajax.IResponse>{});
		}
		/** Callback the grid calls that you implement to fetch rows from the server. */
		public getRows (params: agGrid.IGetRowsParams): void {
			/*console.log(
				'asking for ' + params.startRow + ' to ' + params.endRow + ' by collection from ' 
				+ this.initialData.offset + ' to ' + (this.initialData.offset + this.initialData.dataCount)
			);*/
			var totalCount = this.grid.GetTotalCount();
			if (this.possibleToResolveByInitData(params, totalCount)) {
				this.resolveByInitData(params, totalCount);
			} else {
				this.resolveByAjaxRequest(params);
			}
		}
		public ExecRequest (reqData: Interfaces.Ajax.IReqRawObj, changeUrl: boolean): this {
			
			if (!changeUrl) {
				var cacheKey = this.cache.Key(reqData);
				this.changeUrlSwitches.set(cacheKey, true);
			}
			//console.log("set cache", cacheKey, reqData);

			var gridOptionsManager = this.grid.GetOptionsManager().GetAgOptions();
			
			// both triggers current grid model reload and calling `this.getRows()`:
			//gridOptions.api.onFilterChanged();
			gridOptionsManager.api.onFilterChanged();
			
			return this;
		}
		protected possibleToResolveByInitData (params: agGrid.IGetRowsParams, totalCount: number): boolean {
			var result = (
				(this.requestCounter++ === 0 || this.initDataCache) &&
				totalCount != null && 
				params.startRow >= this.initialData.offset &&
				(params.endRow <= this.initialData.offset + this.initialData.dataCount || totalCount < params.endRow)
			);
			if (!result) return false;
			var reqData: Interfaces.Ajax.IReqRawObj = this.helpers.RetypeRequestMaps2Objects({
				offset: this.grid.GetOffset(),
				limit: this.grid.GetLimit(),
				sorting: this.grid.GetSorting(),
				filtering: this.grid.GetFiltering(),
			});
			var cacheKey = this.cache.Key(reqData);
			if (this.cache.Has(cacheKey))
				return true;
			return false;
		}
		protected resolveByInitData (params: agGrid.IGetRowsParams, totalCount: number): void {
			//console.log("resolving by initial data");
			params.successCallback(
				this.initialData.data.slice(params.startRow - this.initialData.offset, params.endRow - this.initialData.offset), 
				totalCount
			);
			if (this.pageLoadedState > 0) {
				var reqData: Interfaces.Ajax.IReqRawObj = this.helpers.RetypeRequestMaps2Objects({
					offset: this.grid.GetOffset(),
					limit: this.grid.GetLimit(),
					sorting: this.grid.GetSorting(),
					filtering: this.grid.GetFiltering(),
				});
				var cacheKey = this.cache.Key(reqData);
				if (this.changeUrlSwitches.has(cacheKey) && this.changeUrlSwitches.get(cacheKey)) {
					this.changeUrlSwitches.delete(cacheKey);
				} else {
					//console.log("pushState init data", reqData);
					this.browserHistoryPush(
						reqData, this.initLocationHref, 
						this.initialData.page,this.initialData.count
					);
				}
				if (this.autoSelectFirstRow)
					this.grid.GetEvents().SelectRowByIndex(0);

			} else {
				this.pageLoadedState++;
				var serverCfg = this.grid.GetServerConfig();
				//console.log("page", serverCfg.page);
				if (serverCfg.page > 1) {
					var scrollOffset = (serverCfg.page - 1) * this.grid.GetLimit();
					//console.log("scrolling top", scrollOffset);
					this.optionsManager.GetAgOptions().api.ensureIndexVisible(
						scrollOffset, "top"
					);
					this.specialCase = true;
					
					this.grid.GetEvents().SelectRowByIndex(scrollOffset, () => {
						setTimeout(() => {
							this.autoSelectFirstRow = true;
						}, 1000);
					});
					
				} else {
					this.grid.GetEvents().SelectRowByIndex(0, () => {
						setTimeout(() => {
							this.autoSelectFirstRow = true;
						}, 1000);
					});
				}
			}
		}
		protected resolveByAjaxRequest (params: agGrid.IGetRowsParams): void {
			//console.log("resolveByAjaxRequest");
			var agGridApi: agGrid.GridApi<any> = this.optionsManager.GetAgOptions().api;
			agGridApi.showLoadingOverlay();
			var [reqDataUrl, reqMethod, reqType] = this.getReqUrlMethodAndType();
			var reqData = this.helpers.RetypeRequestMaps2Objects({
				offset: params.startRow,
				limit: params.endRow - params.startRow,
				sorting: this.grid.GetSorting(),
				filtering: this.grid.GetFiltering(),
			});
			Ajax.load(<Ajax.LoadConfig>{
				url: reqDataUrl,
				method: reqMethod,
				data: Object.assign({}, reqData),
				type: reqType,
				success: (rawResponse: AgGrids.Interfaces.Ajax.IResponse) => {
					agGridApi.hideOverlay();

					var response = this.helpers.RetypeRawServerResponse(rawResponse);
					
					if (response.controls != null) {
						this.optionsManager.InitBottomControls();
						this.handleResponseControls(response);
					}
					
					var serverCfg = this.grid.GetServerConfig();
					if (serverCfg.page > 1) {
						this.pageLoadedState++;
					} else if (serverCfg.page === 1) {
						this.pageLoadedState = 4;
					}

					var cacheKey = this.cache.Key(reqData);
					if (this.changeUrlSwitches.has(cacheKey) && this.changeUrlSwitches.get(cacheKey)) {
						this.changeUrlSwitches.delete(cacheKey);
					} else {
						if (this.pageLoadedState > 3) {
							reqData.path = response.path;
							this.browserHistoryPush(
								reqData, response.url, 
								response.page, response.count
							);
							this.grid.GetColumnsVisibilityMenu().UpdateFormAction(response.path);
						}
					}

					var selectFirstRow = !this.scrolled && this.pageLoadedState > 3;

					params.successCallback(response.data, response.totalCount);
					
					this.grid.GetEvents().HandleResponseLoaded(response, selectFirstRow);
				}
			});
		}
	}
}