namespace MvcCore.Ext.Controllers.DataGrids {
	export class AgGrid {
		protected serverConfig: AgGrids.Interfaces.IServerConfig;
		protected initialData: AgGrids.Interfaces.IServerResponse;
		protected grid: agGrid.Grid;

		protected helpers: AgGrids.Helpers;
		protected eventsManager: AgGrids.EventsManager;
		protected options: AgGrids.Options;
		protected dataSource: AgGrids.DataSource;

		protected sorting: [string, 0 | 1][];
		protected filtering: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		protected totalCount: number | null = null;
		protected offset: number = 0;
		
		public constructor (serverConfig: AgGrids.Interfaces.IServerConfig, initialData: AgGrids.Interfaces.IServerResponse) {
			console.log("AgGrid.ctor - serverConfig", serverConfig);
			console.log("AgGrid.ctor - initialData", initialData);
			this
				.initSubClasses()
				.initServerConfig(serverConfig);
			this.options.InitElements()
			this
				.initPageModeSpecifics()
				.initData(initialData);
			document.addEventListener('DOMContentLoaded', () => {
				this
					.initAgOptions()
					.initGrid()
					.initDataSource();
			});
		}

		public SetHelpers (helpers: AgGrids.Helpers): this {
			this.helpers = helpers;
			return this;
		}
		public GetHelpers (): AgGrids.Helpers {
			return this.helpers;
		}
		public SetEvents (events: AgGrids.EventsManager): this {
			this.eventsManager = events;
			return this;
		}
		public GetEvents (): AgGrids.EventsManager {
			return this.eventsManager;
		}
		public SetOptions (options: AgGrids.Options): this {
			this.options = options;
			return this;
		}
		public GetOptions (): AgGrids.Options {
			return this.options;
		}
		public SetDataSource (dataSource: AgGrids.DataSource): this {
			this.dataSource = dataSource;
			return this;
		}
		public GetDataSource (): AgGrids.DataSource {
			return this.dataSource;
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
		public SetOffset (offset: number): this {
			this.offset = offset;
			return this;
		}
		public GetOffset (): number {
			return this.offset;
		}

		protected initSubClasses (): this {
			this.helpers = new AgGrids.Helpers(this);
			
			this.options = new AgGrids.Options(this);
			return this;
		}
		protected initPageModeSpecifics (): this {
			if ((this.serverConfig.clientPageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				var emSinglePage = new AgGrids.EventsManagers.SinglePageMode(this);
				this.eventsManager = emSinglePage;
			} else if ((this.serverConfig.clientPageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				var emMultiplePages = new AgGrids.EventsManagers.MultiplePagesMode(this);
				this.eventsManager = emMultiplePages;
				emMultiplePages
					.AddPagingEvents()
					.AddWindowPopStateChangeEvent();
			}
			return this;
		}
		protected initServerConfig (serverConfig: AgGrids.Interfaces.IServerConfig): this {
			this.serverConfig = this.helpers.RetypeRawServerConfig(serverConfig);
			return this;
		}
		protected initData (initialData: AgGrids.Interfaces.IServerResponse): this {
			this.initialData = this.helpers.RetypeRawServerResponse(initialData);
			this.sorting = this.initialData.sorting;
			this.filtering = this.initialData.filtering;
			this.totalCount = this.initialData.totalCount;
			this.offset = this.initialData.offset;
			return this;
		}
		protected initAgOptions (): this {
			this.options
				.InitAgBases()
				.InitAgColumns()
				.InitAgPageModeSpecifics();
			return this;
		}
		protected initGrid (): this {
			var gridOptions = this.options.GetAgOptions();
			this.grid = new agGrid.Grid(
				this.options.GetElements().agGridElement, gridOptions
			);
			return this;
		}
		protected initDataSource (): this {
			if ((this.serverConfig.clientPageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				this.dataSource = new AgGrids.DataSources.SinglePageMode(this);
				var gridOptions = this.options.GetAgOptions();
				gridOptions.api.setDatasource(this.dataSource as any);
			} else if ((this.serverConfig.clientPageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				this.dataSource = new AgGrids.DataSources.MultiplePagesMode(this);
			}
			return this;
		}
	}
}

