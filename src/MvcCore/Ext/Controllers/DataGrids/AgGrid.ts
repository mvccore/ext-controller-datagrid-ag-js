namespace MvcCore.Ext.Controllers.DataGrids {
	export class AgGrid {
		public static Classes: AgGrids.Interfaces.IClasses = {
			Columns: {
				FilterMenus: {
					Date: AgGrids.Columns.FilterMenus.Date,
					DateTime: AgGrids.Columns.FilterMenus.DateTime,
					Time: AgGrids.Columns.FilterMenus.Time,
					Int: AgGrids.Columns.FilterMenus.Int,
					Float: AgGrids.Columns.FilterMenus.Float,
					Money: AgGrids.Columns.FilterMenus.Money,
				},
				FilterHeader: AgGrids.Columns.FilterHeader,
				FilterMenu: AgGrids.Columns.FilterMenu,
				Manager: AgGrids.Columns.Manager,
				SortHeader: AgGrids.Columns.SortHeader,
				ViewHelper: AgGrids.Columns.ViewHelper,
				VisibilityMenu: AgGrids.Columns.VisibilityMenu,
			},
			DataSources: {
				MultiplePagesMode: AgGrids.DataSources.MultiplePagesMode,
				SinglePageMode: AgGrids.DataSources.SinglePageMode,
				Cache:  AgGrids.DataSources.Cache,
			},
			EventsManager: {
				MultiplePagesMode: AgGrids.EventsManagers.MultiplePagesMode,
				SinglePageMode: AgGrids.EventsManagers.SinglePageMode,
			},
			Options: {
				AgBases: AgGrids.Options.AgBases,
				Manager: AgGrids.Options.Manager,
			},
			Tools: {
				Helpers: AgGrids.Tools.Helpers,
				Translator: AgGrids.Tools.Translator,
			},
		};
		public Static: typeof AgGrid;

		protected serverConfig: AgGrids.Interfaces.IServerConfig;
		protected initialData: AgGrids.Interfaces.Ajax.IResponse;
		protected viewHelpers: Map<string, AgGrids.Types.ViewHelper>;
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
		protected limit: number = 0;
		protected gridPath: string = '';
		protected selectedRowNodes: agGrid.RowNode<any>[] = [];
		protected pageMode: AgGrids.Enums.ClientPageMode;
		protected columnsVisibilityMenu: AgGrids.Columns.VisibilityMenu;
		protected internalSelectionChange: boolean = false;
		
		public constructor (
			serverConfig: AgGrids.Interfaces.IServerConfig, 
			initialData: AgGrids.Interfaces.Ajax.IResponse,
			viewHelpers: AgGrids.Interfaces.IViewHelpers
		) {
			//console.log("AgGrid.ctor - serverConfig", serverConfig);
			//console.log("AgGrid.ctor - initialData", initialData);
			console.log("AgGrid.ctor - viewHelpers", viewHelpers);
			this.Static = new.target;
			this
				.initSubClasses()
				.initServerConfig(serverConfig)
				.SetViewHelpers(viewHelpers)
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
		public SetViewHelpers (viewHelpers: AgGrids.Interfaces.IViewHelpers): this {
			this.viewHelpers = new Map<string, AgGrids.Types.ViewHelper>();
			for (var columnUrlName in viewHelpers)
				this.viewHelpers.set(columnUrlName, viewHelpers[columnUrlName]);
			return this;
		}
		public GetViewHelpers (): Map<string, AgGrids.Types.ViewHelper> {
			return this.viewHelpers;
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
		public SetLimit (limit: number): this {
			this.limit = limit;
			return this;
		}
		public GetLimit (): number {
			return this.limit;
		}
		public SetGridPath (gridPath: string): this {
			this.gridPath = gridPath;
			return this;
		}
		public GetGridPath (): string {
			return this.gridPath;
		}
		public SetSelectedRowNodes (selectedRowNodes: agGrid.RowNode<any>[], fireChangeEvent: boolean = true): this {
			this.selectedRowNodes = selectedRowNodes;
			if (fireChangeEvent === false) {
				this.internalSelectionChange = true;
				this.agGridApi.deselectAll();
				selectedRowNodes.forEach(row => row.setSelected(true));
				setTimeout(() => {
					this.internalSelectionChange = false;
				}, 10);
			} else if (fireChangeEvent === true) {
				this.agGridApi.deselectAll();
				selectedRowNodes.forEach(row => row.setSelected(true));
			}
			return this;
		}
		public GetSelectedRowNodes (): agGrid.RowNode<any>[] {
			return this.selectedRowNodes;
		}
		public GetInternalSelectionChange (): boolean {
			return this.internalSelectionChange;
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
		public AddEventListener <TEventName extends keyof AgGrids.Interfaces.IHandlersMap>(eventName: TEventName, handler: (a: AgGrids.Interfaces.IHandlersMap[TEventName]) => void, useTryCatch: boolean = false): this {
			this.eventsManager.AddEventListener(eventName, handler, useTryCatch);
			return this;
		}
		public RemoveEventListener <TEventName extends keyof AgGrids.Interfaces.IHandlersMap>(eventName: TEventName, handler: (e: AgGrids.Interfaces.IHandlersMap[TEventName]) => void): this {
			this.eventsManager.RemoveEventListener(eventName, handler);
			return this;
		}
		public ExecChange (offset?: number, sorting?: AgGrids.Types.SortItem[] | false, filtering?: Map<string, Map<AgGrids.Enums.Operator, string[]>> | false): this {
			this.eventsManager.HandleExecChange(offset, sorting, filtering);
			return this;
		}

		protected initSubClasses (): this {
			var extendedClasses = this.Static.Classes,
				origClasses = AgGrid.Classes,
				helpersType = extendedClasses?.Tools?.Helpers ?? origClasses.Tools.Helpers;
			this.helpers = new helpersType(this);
			var classes: AgGrids.Interfaces.IClasses = this.helpers.MergeObjectsRecursively({}, origClasses, extendedClasses);
			this.Static.Classes = classes;
			this.optionsManager = new classes.Options.Manager(this);
			return this;
		}
		protected initServerConfig (serverConfig: AgGrids.Interfaces.IServerConfig): this {
			this.serverConfig = this.helpers.RetypeRawServerConfig(serverConfig);
			this.pageMode = this.serverConfig.clientPageMode;
			return this;
		}
		protected initTranslator (): this {
			this.translator = new this.Static.Classes.Tools.Translator(this);
			return this;
		}
		protected initPageModeSpecifics (): this {
			if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				var emSinglePage = new this.Static.Classes.EventsManager.SinglePageMode(this);
				this.eventsManager = emSinglePage;
				emSinglePage
					.AddUrlChangeEvent();
				this.limit = this.serverConfig.clientRequestBlockSize;
			} else if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				var emMultiplePages = new this.Static.Classes.EventsManager.MultiplePagesMode(this);
				this.eventsManager = emMultiplePages;
				emMultiplePages
					.AddCountScalesEvents()
					.AddPagingEvents()
					.AddUrlChangeEvent();
				this.limit = this.serverConfig.count;
			}
			return this;
		}
		protected initData (initialData: AgGrids.Interfaces.Ajax.IResponse): this {
			this.initialData = this.helpers.RetypeRawServerResponse(initialData);
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
				this.dataSource = new this.Static.Classes.DataSources.SinglePageMode(this);
				var gridOptions = this.optionsManager.GetAgOptions();
				gridOptions.api.setDatasource(this.dataSource as any);
			} else if ((this.pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				this.dataSource = new this.Static.Classes.DataSources.MultiplePagesMode(this);
			}
			return this;
		}
		protected initColumnsMenu (): this {
			this.columnsVisibilityMenu = new this.Static.Classes.Columns.VisibilityMenu(this);
			return this;
		}
	}
}