namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.AgOptions {
	export class Columns {
		public Static: typeof Columns;
		protected static types: Map<string, string> = new Map<string, string>([
			["string",		"textColumn"],
			["int",			"numericColumn"],
			["float",		"numericColumn"],
			["\\Date",		"dateColumn"],
			["\\DateTime",	"dateColumn"],
		]);
		protected grid: AgGrid;
		protected options: AgGrids.Options;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Helpers;

		protected agColumns: AgGrids.Types.GridColumn[];
		protected defaultColDef: agGrid.ColDef<any>;

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
				.initColumns()
				.initDefaultColDef();
		}
		protected initColumns (): this {
			this.agColumns = [];
			var agColumn: AgGrids.Types.GridColumn,
				serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn,
				serverColumns = this.grid.GetServerConfig().columns;
			for (var columnUrlName in serverColumns) {
				serverColumnCfg = serverColumns[columnUrlName];
				if (serverColumnCfg.disabled === true) continue;
				agColumn = this.initColumn(columnUrlName, serverColumnCfg);
				this.agColumns.push(agColumn);
			}
			return this;
		}
		protected initColumn (columnUrlName: string, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): AgGrids.Types.GridColumn {
			var column = <agGrid.ColDef>{
				colId: columnUrlName,
				field: serverColumnCfg.propName,
				headerName: serverColumnCfg.headingName,
				tooltipField: serverColumnCfg.propName,
				resizable: true,
				editable: false
			};
			var serverType = serverColumnCfg.types[0];
			console.log(serverColumnCfg.types);
			if (this.Static.types.has(serverType))
				column.type = this.Static.types.get(serverType);
			column.filter = !(serverColumnCfg.filter === false);
			column.sortable = !(serverColumnCfg.sort === false);
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
				flex: 1,
				//minWidth: 200,
				filter: true,
				resizable: true,
				sortable: true,
				floatingFilter: true,
				suppressMenu: true,
		
				editable: true,
				
				tooltipComponent: AgGrids.ToolTip
			}
			return this;
		}
	}
}