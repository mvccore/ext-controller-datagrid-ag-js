namespace MvcCore.Ext.Controllers.DataGrids {
	export class AgGrid {
		protected serverConfig: AgGrids.Interfaces.IServerConfig;
		protected initialData: AgGrids.Interfaces.IServerResponse;
		protected events: AgGrids.Events;
		protected initialization: AgGrids.Initializations;
		protected grid: agGrid.Grid;
		protected gridElement: HTMLDivElement;
		protected gridOptions: agGrid.GridOptions<any>;
		protected gridColumns: AgGrids.Types.GridColumn[];
		protected gridDataSource: agGrid.IDatasource;
		protected helpers: AgGrids.Helpers;
		protected sorting: [string, 0 | 1][];
		protected filtering: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		protected totalCount: number | null = null;
		public constructor (serverConfig: AgGrids.Interfaces.IServerConfig, initialData: AgGrids.Interfaces.IServerResponse) {
			this.helpers = new AgGrids.Helpers(this);
			this.serverConfig = this.helpers.RetypeServerConfigObjects2Maps(serverConfig);
			this.initialData = this.helpers.RetypeServerResponseObjects2Maps(initialData);
			this.events = new AgGrids.Events(this);
			this.initialization = new AgGrids.Initializations(this, this.events, this.helpers);
			this.sorting = this.initialData.sorting;
			this.filtering = this.initialData.filtering;
			this.totalCount = this.initialData.totalCount;
		}

		public GetServerConfig (): AgGrids.Interfaces.IServerConfig {
			return this.serverConfig;
		}
		public GetInitialData (): AgGrids.Interfaces.IServerResponse {
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

		public SetSorting (sorting: [string, 0 | 1][]): this {
			this.sorting = sorting;
			return this;
		}
		public GetSorting (): [string, 0 | 1][] {
			return this.sorting;
		}

		public SetFiltering (filtering: Map<string, Map<AgGrids.Enums.Operator, string[]>>): this {
			this.filtering = filtering;
			return this;
		}
		public GetFiltering (): Map<string, Map<AgGrids.Enums.Operator, string[]>> {
			return this.filtering;
		}

		public SetTotalCount (totalCount: number | null): this {
			this.totalCount = totalCount;
			return this;
		}
		public GetTotalCount (): number | null {
			return this.totalCount;
		}
	}
}

