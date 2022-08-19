namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.SubOptions {
	export class DataSource implements agGrid.IDatasource {
		public Static: typeof DataSource;

		/** If you know up front how many rows are in the dataset, set it here. Otherwise leave blank. */
		public rowCount?: number = undefined;
		
		protected grid: AgGrid;
		protected options: AgGrids.Options;
		protected events: AgGrids.Events;
		protected helpers: AgGrids.Helpers;

		protected initialData: Interfaces.IServerResponse;
		protected pageLoaded: boolean;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.options = grid.GetOptions();
			this.events = grid.GetEvents();
			this.helpers = grid.GetHelpers();
			this.initialData = grid.GetInitialData();
			this.pageLoaded = false;
		}

		/** Callback the grid calls that you implement to fetch rows from the server. */
		public getRows (params: agGrid.IGetRowsParams): void {

			// TODO: refactoring!

			console.log(
				'asking for ' + params.startRow + ' to ' + params.endRow + ' by collection from ' 
				+ this.initialData.offset + ' to ' + (this.initialData.offset + this.initialData.dataCount)
			);
			
			var totalCount = this.grid.GetTotalCount();
			if (
				totalCount != null && 
				params.startRow >= this.initialData.offset &&
				(params.endRow <= this.initialData.offset + this.initialData.dataCount || totalCount < params.endRow)
			) {
				console.log("resolving by initial data");
				params.successCallback(
					this.initialData.data.slice(params.startRow - this.initialData.offset, params.endRow - this.initialData.offset), 
					totalCount
				);
				if (!this.pageLoaded) {
					this.pageLoaded = true;
					var serverCfg = this.grid.GetServerConfig();
					console.log("page", serverCfg.page);
					if (serverCfg.page > 1) {
						var scrollOffset = (serverCfg.page - 1) * serverCfg.clientRowBuffer;
						console.log("scrolling top", scrollOffset);
						this.options.GetAgOptions().api.ensureIndexVisible(
							scrollOffset, "top"
						);
					}
				}
				return;
			}

			console.log("resolving by ajax request");

			var startTime = +new Date;

			Ajax.get(
				this.grid.GetServerConfig().dataUrl, 
				this.helpers.RetypeServerRequestMaps2Objects({
					offset: params.startRow,
					limit: params.endRow - params.startRow,
					sorting: this.grid.GetSorting(),
					filtering: this.grid.GetFiltering(),
				}),
				(response: AgGrids.Interfaces.IServerResponse) => {
					var responseTime = +new Date;
					params.successCallback(response.data, response.totalCount);
					
					/*var renderedTime = +new Date;
					console.log(
						responseTime - startTime,
						renderedTime - responseTime,
						renderedTime - startTime
					);*/
				},
				'jsonp'
			);
		}

		/** Optional destroy method, if your datasource has state it needs to clean up. */
		public destroy (): void {

		}
	}
}