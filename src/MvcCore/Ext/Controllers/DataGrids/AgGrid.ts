namespace MvcCore.Ext.Controllers.DataGrids {
	export class AgGrid {
		protected serverConfig: AgGrids.Interfaces.IServerConfig;
		protected initialData: AgGrids.Interfaces.Ajax.IResponse;
		protected grid: agGrid.Grid;
		protected agGridApi: agGrid.GridApi<any>;
		protected agColumnApi: agGrid.ColumnApi;

		protected helpers: AgGrids.Tools.Helpers;
		protected translator: AgGrids.Tools.Translator;
		protected eventsManager: AgGrids.EventsManager;
		protected optionsManager: AgGrids.Options.Manager;
		protected dataSource: AgGrids.DataSource;

		protected sortHeaders: Map<string, AgGrids.Columns.SortHeader>;
		protected filterHeaders: Map<string, AgGrids.Columns.FilterHeader>;
		protected filterMenus: Map<string, AgGrids.Columns.FilterMenu>;

		protected sorting: AgGrids.Types.SortItem[];
		protected filtering: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		protected totalCount: number | null = null;
		protected offset: number = 0;
		protected gridPath: string = '';
		protected pageMode: AgGrids.Enums.ClientPageMode;
		protected columnsVisibilityMenu: AgGrids.Columns.VisibilityMenu;
		
		public constructor (serverConfig: AgGrids.Interfaces.IServerConfig, initialData: AgGrids.Interfaces.Ajax.IResponse) {
			//console.log("AgGrid.ctor - serverConfig", serverConfig);
			//console.log("AgGrid.ctor - initialData", initialData);
			this
				.initSubClasses()
				.initServerConfig(serverConfig)
				.initTranslator();
			this.optionsManager.InitElements()
			this
				.initPageModeSpecifics()
				.initData(initialData);
			document.addEventListener('DOMContentLoaded', () => {
				this
					.initAgOptions()
					.initGrid()
					.initDataSource()
					.initColumnsMenu();
			});
		}

		public SetHelpers (helpers: AgGrids.Tools.Helpers): this {
			this.helpers = helpers;
			return this;
		}
		public GetHelpers (): AgGrids.Tools.Helpers {
			return this.helpers;
		}
		public SetEvents (events: AgGrids.EventsManager): this {
			this.eventsManager = events;
			return this;
		}
		public GetEvents (): AgGrids.EventsManager {
			return this.eventsManager;
		}
		public SetTranslator (translator: AgGrids.Tools.Translator): this {
			this.translator = translator;
			return this;
		}
		public GetTranslator (): AgGrids.Tools.Translator {
			return this.translator;
		}
		public SetOptionsManager (optionsManager: AgGrids.Options.Manager): this {
			this.optionsManager = optionsManager;
			return this;
		}
		public GetOptionsManager (): AgGrids.Options.Manager {
			return this.optionsManager;
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
		public SetInitialData (initialData: AgGrids.Interfaces.Ajax.IResponse): this {
			this.initialData = initialData;
			return this;
		}
		public GetInitialData (): AgGrids.Interfaces.Ajax.IResponse {
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
		public SetSortHeaders (sortHeaders: Map<string, AgGrids.Columns.SortHeader>): this {
			this.sortHeaders = sortHeaders;
			return this;
		}
		public GetSortHeaders (): Map<string, AgGrids.Columns.SortHeader> {
			return this.sortHeaders;
		}
		public SetFilterHeaders (filterHeaders: Map<string, AgGrids.Columns.FilterHeader>): this {
			this.filterHeaders = filterHeaders;
			return this;
		}
		public GetFilterHeaders (): Map<string, AgGrids.Columns.FilterHeader> {
			return this.filterHeaders;
		}
		public SetFilterMenus (filterMenus: Map<string, AgGrids.Columns.FilterMenu>): this {
			this.filterMenus = filterMenus;
			return this;
		}
		public GetFilterMenus (): Map<string, AgGrids.Columns.FilterMenu> {
			return this.filterMenus;
		}
		public SetColumnsVisibilityMenu (columnsVisibilityMenu: AgGrids.Columns.VisibilityMenu): this {
			this.columnsVisibilityMenu = columnsVisibilityMenu;
			return this;
		}
		public GetColumnsVisibilityMenu (): AgGrids.Columns.VisibilityMenu {
			return this.columnsVisibilityMenu;
		}
		public AddEventListener <K extends keyof AgGrids.Interfaces.Events.IHandlersMap>(eventName: K, handler: (a: AgGrids.Interfaces.Events.IHandlersMap[K]) => void): this {
			this.eventsManager.AddEventListener(eventName, handler);
			return this;
		}
		public RemoveEventListener <K extends keyof AgGrids.Interfaces.Events.IHandlersMap>(eventName: K, handler: (e: AgGrids.Interfaces.Events.IHandlersMap[K]) => void): this {
			this.eventsManager.RemoveEventListener(eventName, handler);
			return this;
		}
		public ExecChange (offset?: number, sorting?: AgGrids.Types.SortItem[], filtering?: Map<string, Map<AgGrids.Enums.Operator, string[]>>): this {
			this.eventsManager.HandleExecChange(
				offset ?? 0, 
				sorting ?? [], 
				filtering ?? new Map<string, Map<AgGrids.Enums.Operator, string[]>>()
			);
			return this;
		}

		protected initSubClasses (): this {
			this.helpers = new AgGrids.Tools.Helpers(this);
			this.optionsManager = new AgGrids.Options.Manager(this);
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
			this.translator = new AgGrids.Tools.Translator(this);
			return this;
		}
		protected initData (initialData: AgGrids.Interfaces.Ajax.IResponse): this {
			this.initialData = AgGrids.DataSource.RetypeRawServerResponse(initialData);
			this.sorting = this.initialData.sorting;
			this.filtering = this.initialData.filtering;
			this.totalCount = this.initialData.totalCount;
			this.offset = this.initialData.offset;
			this.gridPath = this.initialData.path;
			return this;
		}
		protected initAgOptions (): this {
			this.optionsManager
				.InitAgBases()
				.InitAgColumns()
				.InitAgPageModeSpecifics();
			return this;
		}
		protected initGrid (): this {
			var gridOptions = this.optionsManager.GetAgOptions();
			this.grid = new agGrid.Grid(
				this.optionsManager.GetElements().agGridElement, gridOptions
			);
			this.optionsManager.GetColumnManager().SetAgColumnsConfigs(null); // frees memory
			this.agGridApi = gridOptions.api;
			this.agColumnApi = gridOptions.columnApi;
			for (var sortHeader of this.sortHeaders.values())
				sortHeader.OnReady();
			return this;
		}
		protected initDataSource (): this {
			if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				this.dataSource = new AgGrids.DataSources.SinglePageMode(this);
				var gridOptions = this.optionsManager.GetAgOptions();
				gridOptions.api.setDatasource(this.dataSource as any);
			} else if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				this.dataSource = new AgGrids.DataSources.MultiplePagesMode(this);
			}
			return this;
		}
		protected initColumnsMenu (): this {
			this.columnsVisibilityMenu = new AgGrids.Columns.VisibilityMenu(this);
			return this;
		}
	}
}

