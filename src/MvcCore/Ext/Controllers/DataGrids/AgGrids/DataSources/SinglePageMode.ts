namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSource implements agGrid.IDatasource {
		public Static: typeof SinglePageMode;
		/** If you know up front how many rows are in the dataset, set it here. Otherwise leave blank. */
		public rowCount?: number = undefined;
		protected pageLoaded: boolean;
		protected initDataCache: boolean;
		protected requestCounter: number;
		protected changeUrlSwitches: Map<string, boolean>;
		protected initLocationHref: string;
		public constructor (grid: AgGrid) {
			super(grid);
			this.pageLoaded = false;
			this.initDataCache = this.grid.GetServerConfig().clientMaxRowsInCache > 0;
			this.requestCounter = 0;
			this.initLocationHref = location.href;

			this.initPageReqDataAndCache();
			history.replaceState(this.pageReqData, document.title, location.href);
			//this.pageReqData = null;

			this.changeUrlSwitches = new Map<string, boolean>();
		}

		protected initPageReqDataAndCache (): void {
			super.initPageReqDataAndCache();
			this.cache.SetEnabled(true);
			this.cache.Add(this.cache.Key(this.pageReqData), <Interfaces.IServerResponse>{});
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
		public ExecRequest (reqData: Interfaces.IServerRequestRaw): this {
			var sortChanged = false,
				sortingOld = this.grid.GetSorting(),
				sortHeaders = this.grid.GetSortHeaders(),
				agColumnsState: agGrid.ColumnState[] = [],
				sorting: [string, 1 | 0 | null][] = reqData.sorting as any,
				sortColId: string,
				sortDir: 1 | 0;
			if (JSON.stringify(sortingOld) !== JSON.stringify(sorting)) {
				sortChanged = true;
				for (var sortHeader of sortHeaders.values())
					sortHeader.SetDirection(null);
				for (var i = 0, l = sorting.length; i < l; i++) {
					[sortColId, sortDir] = sorting[i];
					agColumnsState.push(<agGrid.ColumnState>{
						colId: sortColId,
						sort: sortDir === 1 ? 'asc' : 'desc',
						sortIndex: i
					});
					sortHeaders.get(sortColId)
						.SetDirection(sortDir)
						.SetSequence(i);
				}
				this.grid.SetSorting(sorting);
			}

			// 
			if (sortChanged) {
				var cacheKey = this.cache.Key(reqData);
				this.changeUrlSwitches.set(cacheKey, true);

				var gridOptions = this.grid.GetOptions().GetAgOptions();
				gridOptions.columnApi.applyColumnState(<agGrid.ApplyColumnStateParams>{
					state: agColumnsState,
					applyOrder: false,
					defaultState: <agGrid.ColumnStateParams>{
						sort: null
					},
				});
				
				// TODO: využít při změně filru kombinaci volání níže, každé samostatně spustí další AJAX
				//gridOptions.api.onFilterChanged();
				//gridOptions.api.onSortChanged();
			}

			
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
			var reqData: Interfaces.IServerRequestRaw = this.helpers.RetypeRequest2RawRequest({
				offset: this.grid.GetOffset(),
				limit: this.grid.GetServerConfig().itemsPerPage,
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
			if (this.pageLoaded) {

				var reqData: Interfaces.IServerRequestRaw = this.helpers.RetypeRequest2RawRequest({
					offset: this.grid.GetOffset(),
					limit: this.grid.GetServerConfig().itemsPerPage,
					sorting: this.grid.GetSorting(),
					filtering: this.grid.GetFiltering(),
				});
				var cacheKey = this.cache.Key(reqData);
				if (this.changeUrlSwitches.has(cacheKey) && this.changeUrlSwitches.get(cacheKey)) {
					this.changeUrlSwitches.delete(cacheKey);
				} else {
					history.pushState(reqData, document.title, this.initLocationHref);
				}

			} else {
				this.pageLoaded = true;
				var serverCfg = this.grid.GetServerConfig();
				//console.log("page", serverCfg.page);
				if (serverCfg.page > 1) {
					var scrollOffset = (serverCfg.page - 1) * serverCfg.clientRowBuffer;
					//console.log("scrolling top", scrollOffset);
					this.options.GetAgOptions().api.ensureIndexVisible(
						scrollOffset, "top"
					);
				}
			}
		}
		protected resolveByAjaxRequest (params: agGrid.IGetRowsParams): void {
			var agGridApi: agGrid.GridApi<any> = this.options.GetAgOptions().api;
			agGridApi.showLoadingOverlay();
			var [reqDataUrl, reqMethod, reqType] = this.getReqUrlMethodAndType();
			var reqData = this.helpers.RetypeRequest2RawRequest({
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
				success: (response: AgGrids.Interfaces.IServerResponse) => {
					agGridApi.hideOverlay();
					
					var cacheKey = this.cache.Key(reqData);
					if (this.changeUrlSwitches.has(cacheKey) && this.changeUrlSwitches.get(cacheKey)) {
						this.changeUrlSwitches.delete(cacheKey);
					} else {
						history.pushState(reqData, document.title, response.url);
					}

					params.successCallback(response.data, response.totalCount);
				}
			});
		}
	}
}