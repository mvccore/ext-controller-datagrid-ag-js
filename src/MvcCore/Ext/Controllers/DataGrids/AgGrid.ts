namespace MvcCore.Ext.Controllers.DataGrids {
	export class AgGrid {
		protected serverConfig: AgGrids.Interfaces.IServerConfig;
		protected initialData: AgGrids.Interfaces.IServerResponse;
		protected grid: agGrid.Grid;
		protected agGridApi: agGrid.GridApi<any>;
		protected agColumnApi: agGrid.ColumnApi;

		protected helpers: AgGrids.Helpers;
		protected translator: AgGrids.Translator;
		protected eventsManager: AgGrids.EventsManager;
		protected options: AgGrids.Options;
		protected dataSource: AgGrids.DataSource;

		protected sortHeaders: Map<string, AgGrids.ColumnsManagers.SortHeader>;
		protected filterHeaders: Map<string, AgGrids.ColumnsManagers.FilterHeader>;

		protected sorting: AgGrids.Types.SortItem[];
		protected filtering: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		protected totalCount: number | null = null;
		protected offset: number = 0;
		protected gridPath: string = '';
		protected pageMode: AgGrids.Enums.ClientPageMode;
		
		public constructor (serverConfig: AgGrids.Interfaces.IServerConfig, initialData: AgGrids.Interfaces.IServerResponse) {
			console.log("AgGrid.ctor - serverConfig", serverConfig);
			console.log("AgGrid.ctor - initialData", initialData);
			this
				.initSubClasses()
				.initServerConfig(serverConfig)
				.initTranslator();
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
		public SetTranslator (translator: AgGrids.Translator): this {
			this.translator = translator;
			return this;
		}
		public GetTranslator (): AgGrids.Translator {
			return this.translator;
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
		public SetGridApi (agGridApi: agGrid.GridApi<any>): this {
			this.agGridApi = agGridApi;
			return this;
		}
		public GetGridApi (): agGrid.GridApi<any> {
			return this.agGridApi;
		}
		public SetGridColumnApi (agColumnApi: agGrid.ColumnApi): this {
			this.agColumnApi = agColumnApi;
			return this;
		}
		public GetGridColumnApi (): agGrid.ColumnApi {
			return this.agColumnApi;
		}
		public SetSorting (sorting: AgGrids.Types.SortItem[]): this {
			this.sorting = sorting;
			return this;
		}
		public GetSorting (): AgGrids.Types.SortItem[] {
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
		public SetPageMode (pageMode: AgGrids.Enums.ClientPageMode): this {
			this.pageMode = pageMode;
			return this;
		}
		public GetPageMode (): AgGrids.Enums.ClientPageMode {
			return this.pageMode;
		}
		public SetOffset (offset: number): this {
			this.offset = offset;
			return this;
		}
		public GetOffset (): number {
			return this.offset;
		}
		public SetGridPath (gridPath: string): this {
			this.gridPath = gridPath;
			return this;
		}
		public GetGridPath (): string {
			return this.gridPath;
		}
		public SetSortHeaders (sortHeaders: Map<string, AgGrids.ColumnsManagers.SortHeader>): this {
			this.sortHeaders = sortHeaders;
			return this;
		}
		public GetSortHeaders (): Map<string, AgGrids.ColumnsManagers.SortHeader> {
			return this.sortHeaders;
		}
		public SetFilterHeaders (filterHeaders: Map<string, AgGrids.ColumnsManagers.FilterHeader>): this {
			this.filterHeaders = filterHeaders;
			return this;
		}
		public GetFilterHeaders (): Map<string, AgGrids.ColumnsManagers.FilterHeader> {
			return this.filterHeaders;
		}

		protected initSubClasses (): this {
			this.helpers = new AgGrids.Helpers(this);
			this.options = new AgGrids.Options(this);
			return this;
		}
		protected initPageModeSpecifics (): this {
			if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				var emSinglePage = new AgGrids.EventsManagers.SinglePageMode(this);
				this.eventsManager = emSinglePage;
				emSinglePage
					.AddUrlChangeEvent();
			} else if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				var emMultiplePages = new AgGrids.EventsManagers.MultiplePagesMode(this);
				this.eventsManager = emMultiplePages;
				emMultiplePages
					.AddPagingEvents()
					.AddUrlChangeEvent();
			}
			return this;
		}
		protected initServerConfig (serverConfig: AgGrids.Interfaces.IServerConfig): this {
			this.serverConfig = this.helpers.RetypeRawServerConfig(serverConfig);
			this.pageMode = this.serverConfig.clientPageMode;
			return this;
		}
		protected initTranslator (): this {
			this.translator = new AgGrids.Translator(this);
			return this;
		}
		protected initData (initialData: AgGrids.Interfaces.IServerResponse): this {
			this.initialData = AgGrids.DataSource.RetypeRawServerResponse(initialData);
			this.sorting = this.initialData.sorting;
			this.filtering = this.initialData.filtering;
			this.totalCount = this.initialData.totalCount;
			this.offset = this.initialData.offset;
			this.gridPath = this.initialData.path;
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
			this.options.GetColumnManager().SetAgColumnsConfigs(null); // frees memory
			this.agGridApi = gridOptions.api;
			this.agColumnApi = gridOptions.columnApi;
			return this;
		}
		protected initDataSource (): this {
			if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				this.dataSource = new AgGrids.DataSources.SinglePageMode(this);
				var gridOptions = this.options.GetAgOptions();
				gridOptions.api.setDatasource(this.dataSource as any);
			} else if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				this.dataSource = new AgGrids.DataSources.MultiplePagesMode(this);
			}
			return this;
		}
	}
}

