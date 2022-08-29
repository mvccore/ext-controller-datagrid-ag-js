namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class ColumnsManager {
		public Static: typeof ColumnsManager;
		protected static types: Map<string, string> = new Map<string, string>([
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

		protected agColumns: AgGrids.Types.GridColumn[];
		protected defaultColDef: agGrid.ColDef<any>;
		protected serverConfig: Interfaces.IServerConfig;
		protected viewHelper: ColumnsManagers.ViewHelper;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.options = grid.GetOptions();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
		}

		public SetAgColumns (gridColumns: AgGrids.Types.GridColumn[]): this {
			this.agColumns = gridColumns;
			return this;
		}
		public GetAgColumns (): AgGrids.Types.GridColumn[] {
			return this.agColumns;
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
			this.viewHelper = new AgGrids.ColumnsManagers.ViewHelper(this.grid);
			return this;
		}
		protected initColumns (): this {
			this.agColumns = [];
			var agColumn: AgGrids.Types.GridColumn,
				serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn,
				serverColumns = this.serverConfig.columns;
			for (var columnUrlName in serverColumns) {
				serverColumnCfg = serverColumns[columnUrlName];
				if (serverColumnCfg.disabled === true) continue;
				agColumn = this.initColumn(serverColumnCfg);
				this.agColumns.push(agColumn);
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
			var serverType = serverColumnCfg.types[serverColumnCfg.types.length - 1];
			if (this.Static.types.has(serverType))
				column.type = this.Static.types.get(serverType);

			// TODO
			if (column.type === 'dateColumn') {
				if (column.filter)
					column.filter = 'agDateColumnFilter';
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
				tooltipComponent: AgGrids.ToolTip
			}
			return this;
		}
	}
}