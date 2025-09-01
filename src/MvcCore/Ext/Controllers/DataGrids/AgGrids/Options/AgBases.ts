namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Options {
	export class AgBases {
		public Static: typeof AgBases;
		
		protected grid: AgGrid;
		protected optionsManager: AgGrids.Options.Manager;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Tools.Helpers;
		protected agOptions: agGrid.GridOptions<any>;
		protected getRowId: ((data: any) => string) | null;
		
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.optionsManager = grid.GetOptionsManager();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
			this.getRowId = null;
		}

		public SetAgOptions (options: agGrid.GridOptions<any>): this {
			this.agOptions = options;
			return this;
		}
		public GetAgOptions (): agGrid.GridOptions<any> {
			return this.agOptions;
		}
		public GetRowsIniquelyIdentified (): boolean {
			return this.getRowId != null;
		}
		public GetRowId (data: any): string {
			if (this.getRowId == null)
				throw new Error(`There is no id column configured. Use primary key or unique key attribute.`);
			return this.getRowId(data);
		}

		public Init (): this {
			this
				.initRowIdComplation()
				.initBases()
				.initRowSelection()
				.initEvents();
			return this;
		}
		protected initBases (): this {
			this.agOptions = <agGrid.GridOptions<any>>{
				//debug: true,
				suppressMenuHide: true,
				tooltipShowDelay: 0,
				tooltipHideDelay: 2000,
				animateRows: false,
				suppressColumnVirtualisation: true,
				debounceVerticalScrollbar: true,
				alwaysShowVerticalScroll: true,
				suppressCellFocus: true
			};
			if (this.getRowId != null) {
				this.agOptions.getRowId = (params: agGrid.GetRowIdParams<any>) : string => {
					///@ts-ignore
					return this.getRowId(params.data);
				};
			}
			if (this.helpers.IsChromeBrowser())
				this.agOptions.suppressAnimationFrame = true;
			this.agOptions.localeText = this.grid.GetTranslator().GetStore();
			return this;
		}
		protected initRowSelection (): this {
			var rowSel = this.grid.GetServerConfig().rowSelection;
			var rowSelectionNone = (rowSel & Enums.RowSelection.ROW_SELECTION_NONE) != 0;
			if (!rowSelectionNone) {
				if ((rowSel & Enums.RowSelection.ROW_SELECTION_SINGLE) != 0) {
					this.agOptions.rowSelection = 'single';
				} else if ((rowSel & Enums.RowSelection.ROW_SELECTION_MULTIPLE) != 0) {
					this.agOptions.rowSelection = 'multiple';
					if (this.helpers.IsTouchDevice())
						this.agOptions.rowMultiSelectWithClick = true;
				}
				if ((rowSel & Enums.RowSelection.ROW_SELECTION_NOT_DESELECT) != 0) {
					this.agOptions.suppressRowDeselection = true;
				}
			}
			return this;
		}
		protected initRowIdComplation (): this {
			var serverConfig = this.grid.GetServerConfig(),
				columns = serverConfig.columns,
				column: AgGrids.Interfaces.IServerConfigs.IColumn,
				columnIdsSeparator = serverConfig.columnIdsSeparator,
				idColsPropNames: string[] = [];
			for (var columnName in columns) {
				column = columns[columnName];
				if (!column.idColumn) continue;
				idColsPropNames.push(column.propName);
			}
			if (idColsPropNames.length === 1) {
				var idColPropName = idColsPropNames[0];
				this.getRowId = (data: any): string => {
					var idColsValue = data[idColPropName];
					return idColsValue == null
						? ''
						: String(idColsValue);
				};
			} else if (idColsPropNames.length > 1) {
				this.getRowId = (data: any): string => {
					var idColPropName: string,
						idColsValue: string | null,
						idColsValues: string[] = [];
					for (var i = 0, l = idColsPropNames.length; i < l; i++) {
						idColPropName = idColsPropNames[i];
						idColsValue = data[idColPropName];
						idColsValue = idColsValue == null
							? ''
							: String(idColsValue);
						idColsValues.push(idColsValue);
					}
					return idColsValues.join(columnIdsSeparator);
				};
			}
			return this;
		}
		protected initEvents (): this {
			this.agOptions.onGridReady = this.eventsManager.HandleGridReady.bind(this.eventsManager);
			this.agOptions.onColumnResized = this.eventsManager.HandleColumnResized.bind(this.eventsManager);
			this.agOptions.onColumnMoved = this.eventsManager.HandleColumnMoved.bind(this.eventsManager);
			this.agOptions.onViewportChanged = this.eventsManager.HandleGridSizeChanged.bind(this.eventsManager, true);
			this.agOptions.onGridSizeChanged = this.eventsManager.HandleGridSizeChanged.bind(this.eventsManager, false);
			this.agOptions.onSelectionChanged = this.eventsManager.HandleSelectionChange.bind(this.eventsManager);
			this.agOptions.onModelUpdated = this.eventsManager.HandleModelUpdated.bind(this.eventsManager);
			this.agOptions.onRowDataUpdated = this.eventsManager.HandleRowDataUpdated.bind(this.eventsManager);
			this.agOptions.onBodyScroll = this.eventsManager.HandleBodyScroll.bind(this.eventsManager);
			/*if ((this.grid.GetPageMode() & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				var eventsManagerSpm = this.eventsManager as AgGrids.EventsManagers.SinglePageMode;
				this.agOptions.onBodyScroll = eventsManagerSpm.HandleBodyScroll.bind(this.eventsManager);
			}*/
			return this;
		}
	}
}