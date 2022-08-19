namespace MvcCore.Ext.Controllers.DataGrids {
	export class AgGrid {
		protected serverConfig: AgGrids.Interfaces.IServerConfig;
		protected initialData: AgGrids.Interfaces.IServerResponse;
		protected grid: agGrid.Grid;

		protected helpers: AgGrids.Helpers;
		protected events: AgGrids.Events;
		protected options: AgGrids.Options;

		protected sorting: [string, 0 | 1][];
		protected filtering: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		protected totalCount: number | null = null;
		
		public constructor (serverConfig: AgGrids.Interfaces.IServerConfig, initialData: AgGrids.Interfaces.IServerResponse) {
			console.log(serverConfig);
			this
				.initSubClasses()
				.initServerConfig(serverConfig)
				.initData(initialData);
			document.addEventListener('DOMContentLoaded', () => {
				this
					.initOptions()
					.initGrid();
			})
		}

		public SetHelpers (helpers: AgGrids.Helpers): this {
			this.helpers = helpers;
			return this;
		}
		public GetHelpers (): AgGrids.Helpers {
			return this.helpers;
		}
		public SetEvents (events: AgGrids.Events): this {
			this.events = events;
			return this;
		}
		public GetEvents (): AgGrids.Events {
			return this.events;
		}
		public SetOptions (options: AgGrids.Options): this {
			this.options = options;
			return this;
		}
		public GetOptions (): AgGrids.Options {
			return this.options;
		}
		public SetServerConfig (serverConfig: AgGrids.Interfaces.IServerConfig): this {
			this.serverConfig = serverConfig;
			return this;
		}
		public GetServerConfig (): AgGrids.Interfaces.IServerConfig {
			return this.serverConfig;
		}
		public SetInitialData (initialData: AgGrids.Interfaces.IServerResponse): this {
			this.initialData = initialData;
			return this;
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

		protected initSubClasses (): this {
			this.helpers = new AgGrids.Helpers(this);
			this.events = new AgGrids.Events(this);
			this.options = new AgGrids.Options(this);
			return this;
		}
		protected initServerConfig (serverConfig: AgGrids.Interfaces.IServerConfig): this {
			this.serverConfig = this.helpers.RetypeServerConfigObjects2Maps(serverConfig);
			return this;
		}
		protected initData (initialData: AgGrids.Interfaces.IServerResponse): this {
			this.initialData = this.helpers.RetypeServerResponseObjects2Maps(initialData);
			this.sorting = this.initialData.sorting;
			this.filtering = this.initialData.filtering;
			this.totalCount = this.initialData.totalCount;
			return this;
		}
		protected initOptions (): this {
			this.options
				.InitElements()
				.InitAgBases()
				.InitAgColumns()
				.InitAgPageModeSpecifics();
			return this;
		}
		protected initGrid(): this {
			var gridOptions = this.options.GetAgOptions();
			this.grid = new agGrid.Grid(
				this.options.GetElements().agGridElement, gridOptions
			);
			if ((this.serverConfig.clientPageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				gridOptions.api.setDatasource(
					this.options.GetAgDataSource()
				);
			}
			return this;
		}

	}
}

