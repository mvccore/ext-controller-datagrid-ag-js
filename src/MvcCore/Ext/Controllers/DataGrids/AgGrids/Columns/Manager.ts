namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
	export class Manager {
		public Static: typeof Manager;
		
		protected grid: AgGrid;
		protected optionsManager: AgGrids.Options.Manager;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Tools.Helpers;

		protected agColumnsConfigs: Map<string, AgGrids.Types.GridColumn>;
		protected agColumnDefaults: agGrid.ColDef<any> = <agGrid.ColDef>{
			floatingFilter: true,
			suppressMenu: true,
			resizable: true,
			editable: false,
			flex: 1
		};
		protected sortHeaderDefaults: AgGrids.Interfaces.SortHeaders.IParams = <AgGrids.Interfaces.SortHeaders.IParams>{
			renderDirection: true,
			renderRemove: true,
			renderSequence: true,
		};
		protected filterHeaderDefaults: AgGrids.Interfaces.FilterHeaders.IParams = <AgGrids.Interfaces.FilterHeaders.IParams>{
			suppressFilterButton: false,
			submitDelayMs: 300
		};
		protected filterMenuDefaults: AgGrids.Interfaces.FilterMenus.IParams = <AgGrids.Interfaces.FilterMenus.IParams>{
			suppressAndOrCondition: true,
			buttons: Enums.FilterButton.APPLY | Enums.FilterButton.CLEAR | Enums.FilterButton.CANCEL
		};
		protected serverConfig: Interfaces.IServerConfig;
		protected initData: Interfaces.Ajax.IResponse;
		protected viewHelper: Columns.ViewHelper;
		protected serverColumnsMapAll: Map<string, Interfaces.IServerConfigs.IColumn>;
		protected serverColumnsSortedAll: Interfaces.IServerConfigs.IColumn[];
		protected serverColumnsUserSortedAll: Interfaces.IServerConfigs.IColumn[];
		protected serverColumnsSortedActive: Interfaces.IServerConfigs.IColumn[];
		protected filteringEnabled: boolean;
		protected sortingEnabled: boolean;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.optionsManager = grid.GetOptionsManager();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
			var isTouchDevice = this.helpers.IsTouchDevice();
			this.sortHeaderDefaults.renderRemove = !isTouchDevice;
			if (!isTouchDevice) {
				this.filterHeaderDefaults.submitDelayMs = 0;
			}
			this.filterMenuDefaults.isTouchDevice = isTouchDevice;
			this.serverColumnsMapAll = new Map<string, Interfaces.IServerConfigs.IColumn>();
			this.serverColumnsSortedAll = [];
			this.serverColumnsUserSortedAll = [];
			this.serverColumnsSortedActive = [];
		}

		public SetServerColumnsMapAll (serverColumnsMapAll: Map<string, Interfaces.IServerConfigs.IColumn>): this {
			this.serverColumnsMapAll = serverColumnsMapAll;
			return this;
		}
		public GetServerColumnsMapAll (): Map<string, Interfaces.IServerConfigs.IColumn> {
			return this.serverColumnsMapAll;
		}

		public SetServerColumnsSortedAll (serverColumnsSortedAll: Interfaces.IServerConfigs.IColumn[]): this {
			this.serverColumnsSortedAll = serverColumnsSortedAll;
			return this;
		}
		public GetServerColumnsSortedAll (): Interfaces.IServerConfigs.IColumn[] {
			return this.serverColumnsSortedAll;
		}


		public SetServerColumnsUserSortedAll (serverColumnsUserSortedAll: Interfaces.IServerConfigs.IColumn[]): this {
			this.serverColumnsUserSortedAll = serverColumnsUserSortedAll;
			return this;
		}
		public GetServerColumnsUserSortedAll (): Interfaces.IServerConfigs.IColumn[] {
			return this.serverColumnsUserSortedAll;
		}

		public SetServerColumnsSortedActive (serverColumnsSortedActive: Interfaces.IServerConfigs.IColumn[]): this {
			this.serverColumnsSortedActive = serverColumnsSortedActive;
			return this;
		}
		public GetServerColumnsSortedActive (): Interfaces.IServerConfigs.IColumn[] {
			return this.serverColumnsSortedActive;
		}
		
		public SetAgColumnsConfigs (gridColumns: Map<string, AgGrids.Types.GridColumn>): this {
			this.agColumnsConfigs = gridColumns;
			return this;
		}
		public GetAgColumnsConfigs (): Map<string, AgGrids.Types.GridColumn> {
			return this.agColumnsConfigs;
		}
		
		public SetAgColumnDefaults (defaultColDef: agGrid.ColDef): this {
			this.agColumnDefaults = defaultColDef;
			return this;
		}
		public GetAgColumnDefaults (): agGrid.ColDef {
			return this.agColumnDefaults;
		}
		
		public Init (): this {
			return this
				.initServerCfgAndViewHelper()
				.initColumns();
		}
		protected initServerCfgAndViewHelper (): this {
			this.serverConfig = this.grid.GetServerConfig();
			this.initData = this.grid.GetInitialData();
			this.viewHelper = new this.grid.Static.Classes.Columns.ViewHelper(this.grid);
			this.sortHeaderDefaults.renderSequence = (
				(this.serverConfig.sortingMode & Enums.SortingMode.SORT_MULTIPLE_COLUMNS) != 0
			);
			var renderConfig = this.serverConfig.renderConfig;
			this.sortingEnabled = renderConfig.renderTableHead && renderConfig.renderTableHeadSorting;
			this.filteringEnabled = renderConfig.renderTableHead && renderConfig.renderTableHeadFiltering;
			if (!this.filteringEnabled) {
				this.agColumnDefaults.floatingFilter = false;
			}
			return this;
		}
		protected initColumns (): this {
			this.agColumnsConfigs = new Map<string, AgGrids.Types.GridColumn>();
			var agColumn: AgGrids.Types.GridColumn,
				serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn,
				serverColumnsArr: AgGrids.Interfaces.IServerConfigs.IColumn[] = [],
				columnUrlName: string;
			Object.keys(this.serverConfig.columns).forEach(
				columnUrlName => serverColumnsArr.push(this.serverConfig.columns[columnUrlName])
			);
			this.serverColumnsSortedAll = this.helpers.SortConfigColumns(
				serverColumnsArr, 'columnIndex'
			);
			this.serverColumnsUserSortedAll = this.helpers.SortConfigColumns(
				this.serverColumnsSortedAll, 'columnIndexUser'
			);
			this.grid.SetSortHeaders(new Map<string, AgGrids.Columns.SortHeader>());
			this.grid.SetFilterHeaders(new Map<string, AgGrids.Columns.FilterHeader>());
			this.grid.SetFilterMenus(new Map<string, AgGrids.Columns.FilterMenu>());
			for (var serverColumnCfg of this.serverColumnsUserSortedAll) {
				columnUrlName = serverColumnCfg.urlName;
				this.serverColumnsMapAll.set(serverColumnCfg.propName, serverColumnCfg);
				if (serverColumnCfg.disabled === true) continue;
				serverColumnCfg.columnIndexActive = this.serverColumnsSortedActive.length;
				this.serverColumnsSortedActive.push(serverColumnCfg);
				agColumn = this.initColumn(serverColumnCfg);
				this.agColumnsConfigs.set(columnUrlName, agColumn);
			}
			var sortIndex = 0;
			for (var sortItem of this.initData.sorting) {
				var [columnUrlName, sortDirection] = sortItem;
				agColumn = this.agColumnsConfigs.get(columnUrlName) as agGrid.ColDef;
				var headerComponentParams = agColumn.headerComponentParams as AgGrids.Interfaces.SortHeaders.IParams;
				if (headerComponentParams != null) {
					headerComponentParams.direction = sortDirection;
					headerComponentParams.sequence = sortIndex;
				}
				sortIndex++;
			}
			return this;
		}
		protected initColumn (serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): AgGrids.Types.GridColumn {
			var column = <agGrid.ColDef>{
				colId: serverColumnCfg.urlName,
				field: serverColumnCfg.propName,
				headerName: serverColumnCfg.headingName,
				tooltipField: serverColumnCfg.propName
			};
			if (serverColumnCfg.cssClasses != null && serverColumnCfg.cssClasses.length > 0)
				column.headerClass = column.cellClass = serverColumnCfg.cssClasses.join(' ');
			this.initColumnSorting(column, serverColumnCfg);
			this.initColumnFiltering(column, serverColumnCfg);
			this.viewHelper.SetUpColumnCfg(column, serverColumnCfg);
			this.initColumnStyles(column, serverColumnCfg);
			return column;
		}
		protected initColumnSorting (column: agGrid.ColDef, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): this {
			column.sortable = this.sortingEnabled && !(serverColumnCfg.sort === false);
			if (!column.sortable) return this;
			var headerComponentParams = {
				...this.sortHeaderDefaults,
				...<AgGrids.Interfaces.SortHeaders.IParams>{
					grid: this.grid,
					columnId: serverColumnCfg.urlName,
					sortable: column.sortable
				}
			};
			column.headerComponent = this.grid.Static.Classes.Columns.SortHeader;
			column.headerComponentParams = headerComponentParams;
			return this;
		}
		protected initColumnFiltering (column: agGrid.ColDef, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): this {
			column.filter = (
				this.filteringEnabled &&
				serverColumnCfg.filter !== Enums.FilteringMode.DISABLED &&
				serverColumnCfg.filter !== false
			);
			if (!column.filter) return this;
			var filtering = this.grid.GetFiltering(),
				filteringItem = filtering.has(serverColumnCfg.urlName)
				? filtering.get(serverColumnCfg.urlName)
				: null;

			column.floatingFilterComponent = this.grid.Static.Classes.Columns.FilterHeader;
			var floatingFilterComponentParams = {
				...this.filterHeaderDefaults,
				...<AgGrids.Interfaces.FilterHeaders.IParams>{
					grid: this.grid,
					columnId: serverColumnCfg.urlName,
					
					filteringItem: filteringItem
				}
			};
			column.floatingFilterComponentParams = floatingFilterComponentParams;
			var serverType: Enums.ServerType = serverColumnCfg.types[serverColumnCfg.types.length - 1] as any;
			column.filter = Columns.FilterOperatorsCfg.GetServerTypesExtendedFilterMenu(this.grid, serverType);
			var allControlTypes = AgGrids.Columns.FilterOperatorsCfg.FILTERING_CONTROL_TYPES,
				columnControlTypes: Enums.FilterControlType = Enums.FilterControlType.UNKNOWN,
				columnFiltering = Number(serverColumnCfg.filter);
			for (var [filteringMode, controlTypes] of allControlTypes.entries()) {
				if ((columnFiltering & filteringMode) != 0) {
					for (var controlType of controlTypes) {
						columnControlTypes |= controlType;
					}
				}
			}
			var filterMenuParams = {
				...this.filterMenuDefaults,
				...<AgGrids.Interfaces.FilterMenus.IParams>{
					grid: this.grid,
					columnId: serverColumnCfg.urlName,
					serverColumnCfg: serverColumnCfg,
					serverType: serverType,
					filteringItem: filteringItem,
					controlTypes: columnControlTypes
				}
			};
			column.filterParams = filterMenuParams;
			return this;
		}
		protected initColumnStyles (column: agGrid.ColDef, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): this {
			if (serverColumnCfg.width != null && typeof(serverColumnCfg.width) == 'number')
				column.width = serverColumnCfg.width;
			if (serverColumnCfg.minWidth != null && typeof(serverColumnCfg.minWidth) == 'number')
				column.minWidth = serverColumnCfg.minWidth;
			if (serverColumnCfg.maxWidth != null && typeof(serverColumnCfg.maxWidth) == 'number')
				column.maxWidth = serverColumnCfg.maxWidth;
			if (serverColumnCfg.flex != null && typeof(serverColumnCfg.flex) == 'number')
				column.flex = serverColumnCfg.flex;
			if (serverColumnCfg.editable != null && typeof(serverColumnCfg.editable) == 'boolean')
				column.editable = serverColumnCfg.editable;
			return this;
		}
	}
}