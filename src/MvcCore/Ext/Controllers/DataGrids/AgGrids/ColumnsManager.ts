namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class ColumnsManager {
		public Static: typeof ColumnsManager;
		protected static agColumnsTypes: Map<string, string> = new Map<string, string>([
			[Enums.ServerType.INT,			"numericColumn"],
			[Enums.ServerType.FLOAT,		"numericColumn"],
			[Enums.ServerType.DATE,			"dateColumn"],
			[Enums.ServerType.DATE_TIME,	"dateColumn"],
			[Enums.ServerType.TIME,			"dateColumn"],
		]);
		protected grid: AgGrid;
		protected options: AgGrids.Options;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Helpers;

		protected agColumnsConfigs: Map<string, AgGrids.Types.GridColumn>;
		protected defaultColDef: agGrid.ColDef<any>;
		protected serverConfig: Interfaces.IServerConfig;
		protected initData: Interfaces.IServerResponse;
		protected viewHelper: ColumnsManagers.ViewHelper;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.options = grid.GetOptions();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
		}

		public SetAgColumnsConfigs (gridColumns: Map<string, AgGrids.Types.GridColumn>): this {
			this.agColumnsConfigs = gridColumns;
			return this;
		}
		public GetAgColumnsConfigs (): Map<string, AgGrids.Types.GridColumn> {
			return this.agColumnsConfigs;
		}
		
		public SetDefaultColDef (defaultColDef: agGrid.ColDef): this {
			this.defaultColDef = defaultColDef;
			return this;
		}
		public GetDefaultColDef (): agGrid.ColDef {
			return this.defaultColDef;
		}
		
		public Init (): this {
			return this
				.initServerCfgAndViewHelper()
				.initColumns()
				.initDefaultColDef();
		}
		protected initServerCfgAndViewHelper (): this {
			this.serverConfig = this.grid.GetServerConfig();
			this.initData = this.grid.GetInitialData();
			this.viewHelper = new AgGrids.ColumnsManagers.ViewHelper(this.grid);
			return this;
		}
		protected initColumns (): this {
			this.agColumnsConfigs = new Map<string, AgGrids.Types.GridColumn>();
			var agColumn: AgGrids.Types.GridColumn,
				serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn,
				serverColumns = this.serverConfig.columns;
			this.grid.SetSortHeaders(new Map<string, AgGrids.ColumnsManagers.SortHeader>());
			for (var columnUrlName in serverColumns) {
				serverColumnCfg = serverColumns[columnUrlName];
				if (serverColumnCfg.disabled === true) continue;
				agColumn = this.initColumn(serverColumnCfg);
				this.agColumnsConfigs.set(columnUrlName, agColumn);
			}
			var sortIndex = 0;
			for (var sortItem of this.initData.sorting) {
				var [columnUrlName, sortDirection] = sortItem;
				agColumn = this.agColumnsConfigs.get(columnUrlName) as agGrid.ColDef;
				var headerComponentParams = agColumn.headerComponentParams as AgGrids.Interfaces.IHeaderParams;
				headerComponentParams.direction = sortDirection;
				headerComponentParams.sequence = sortIndex;
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
			column.filter = !(serverColumnCfg.filter === false);
			column.sortable = !(serverColumnCfg.sort === false);
			var headerComponentParams = <AgGrids.Interfaces.IHeaderParams>{
				grid: this.grid,
				columnId: serverColumnCfg.urlName,
				sortable: column.sortable
			};

			column.headerComponentParams = headerComponentParams;
			var serverType = serverColumnCfg.types[serverColumnCfg.types.length - 1];
			if (this.Static.agColumnsTypes.has(serverType))
				column.type = this.Static.agColumnsTypes.get(serverType);
			
				

			column.filterParams = {
				suppressAndOrCondition: true,
				/*filterOptions:[
					'equals',
					'notEqual',
					'contains',
					'notContains',
					'startsWith',
					'endsWith',
					'lessThan',
					'lessThanOrEqual',
					'greaterThan',
					'greaterThanOrEqual',
					'inRange',

					'blank',
					'notBlank',
					'empty'
				],*/
				buttons: [
					'apply', 'clear', 'reset', 'cancel'
				]
			};

			// TODO
			if (column.type === 'dateColumn') {
				if (column.filter)
					column.filter = 'agDateColumnFilter';
				
				column.floatingFilterComponent = AgGrids.ColumnsManagers.FilterInput;
				column.floatingFilterComponentParams = {
					suppressFilterButton: false,
					context: this.grid
				};
			}

			if (column.type === 'numericColumn') {
				column.filter = AgGrids.ColumnsManagers.FilterMenu;
				column.filterParams = {
					context: this.grid
				};
				column.floatingFilterComponent = AgGrids.ColumnsManagers.FilterInput;
				column.floatingFilterComponentParams = {
					suppressFilterButton: false,
					context: this.grid
				};
			}
			
			this.viewHelper.SetUpColumnCfg(column, serverColumnCfg);
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
			return column;
		}
		protected initDefaultColDef (): this {
			this.defaultColDef = <agGrid.ColDef>{
				floatingFilter: true,
				suppressMenu: true,
				resizable: true,
				editable: false,
				flex: 1,
				headerComponent: AgGrids.ColumnsManagers.SortHeader,
				tooltipComponent: AgGrids.ToolTip
			}
			return this;
		}
	}
}