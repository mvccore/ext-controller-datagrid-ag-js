namespace MvcCore.Ext.Controllers.DataGrids {
	export class AgGrid {
		protected serverConfig: AgGrids.IServerConfig;
		protected initialData: AgGrids.IServerResponse;
		protected events: AgGrids.Events;
		protected initialization: AgGrids.Initializations;
		protected grid: agGrid.Grid;
		protected gridElement: HTMLDivElement;
		protected gridOptions: agGrid.GridOptions<any>;
		protected gridColumns: AgGrids.Types.GridColumn[];
		protected gridDataSource: agGrid.IDatasource;
		public constructor (serverConfig: AgGrids.IServerConfig, initialData: AgGrids.IServerResponse) {
			this.serverConfig = serverConfig;
			this.initialData = initialData;
			this.events = new AgGrids.Events(this);
			this.initialization = new AgGrids.Initializations(this, this.events);
		}

		public GetServerConfig (): AgGrids.IServerConfig {
			return this.serverConfig;
		}
		public GetInitialData (): AgGrids.IServerResponse {
			return this.initialData;
		}
		
		public SetGrid (grid: agGrid.Grid): this {
			this.grid = grid;
			return this;
		}
		public GetGrid (): agGrid.Grid {
			return this.grid;
		}

		public SetGridElement (gridElement: HTMLDivElement): this {
			this.gridElement = gridElement;
			return this;
		}
		public GetGridElement (): HTMLDivElement {
			return this.gridElement;
		}
		
		public SetGridOptions (gridOptions: agGrid.GridOptions<any>): this {
			this.gridOptions = gridOptions;
			return this;
		}
		public GetGridOptions (): agGrid.GridOptions<any> {
			return this.gridOptions;
		}
		
		public SetGridColumns (gridColumns: AgGrids.Types.GridColumn[]): this {
			this.gridColumns = gridColumns;
			return this;
		}
		public GetGridColumns (): AgGrids.Types.GridColumn[] {
			return this.gridColumns;
		}
		
		public SetGridDataSource (gridDataSource: agGrid.IDatasource): this {
			this.gridDataSource = gridDataSource;
			return this;
		}
		public GetGridDataSource (): agGrid.IDatasource {
			return this.gridDataSource;
		}
	}
}

