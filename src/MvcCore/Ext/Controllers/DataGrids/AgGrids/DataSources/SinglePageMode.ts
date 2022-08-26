namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSource implements agGrid.IDatasource {
		public Static: typeof SinglePageMode;
		/** If you know up front how many rows are in the dataset, set it here. Otherwise leave blank. */
		public rowCount?: number = undefined;
		protected pageLoaded: boolean;
		protected initDataCache: boolean;
		public constructor (grid: AgGrid) {
			super(grid);
			this.pageLoaded = false;
			this.initDataCache = grid.GetServerConfig().clientMaxRowsInCache > 0;
		}
		/** Optional destroy method, if your datasource has state it needs to clean up. */
		public destroy (): void {

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
		protected possibleToResolveByInitData (params: agGrid.IGetRowsParams, totalCount: number): boolean {
			return (
				this.initDataCache &&
				totalCount != null && 
				params.startRow >= this.initialData.offset &&
				(params.endRow <= this.initialData.offset + this.initialData.dataCount || totalCount < params.endRow)
			)
		}
		protected resolveByInitData (params: agGrid.IGetRowsParams, totalCount: number): void {
			//console.log("resolving by initial data");
			params.successCallback(
				this.initialData.data.slice(params.startRow - this.initialData.offset, params.endRow - this.initialData.offset), 
				totalCount
			);
			if (this.pageLoaded) return;
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
		protected resolveByAjaxRequest (params: agGrid.IGetRowsParams): void {
			var [reqDataUrl, reqMethod, reqType] = this.getReqUrlMethodAndType();
			Ajax.load(<Ajax.LoadConfig>{
				url: reqDataUrl,
				method: reqMethod,
				data: this.helpers.RetypeRequest2RawRequest({
					offset: params.startRow,
					limit: params.endRow - params.startRow,
					sorting: this.grid.GetSorting(),
					filtering: this.grid.GetFiltering(),
				}),
				type: reqType,
				success(response: AgGrids.Interfaces.IServerResponse) {
					params.successCallback(response.data, response.totalCount);
				}
			});
		}
	}
}