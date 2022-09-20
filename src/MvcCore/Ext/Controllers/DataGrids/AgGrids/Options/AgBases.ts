namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Options {
	export class AgBases {
		public Static: typeof AgBases;
		
		protected grid: AgGrid;
		protected optionsManager: AgGrids.Options.Manager;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Tools.Helpers;

		protected agOptions: agGrid.GridOptions<any>;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.optionsManager = grid.GetOptionsManager();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
		}

		public SetAgOptions (options: agGrid.GridOptions<any>): this {
			this.agOptions = options;
			return this;
		}
		public GetAgOptions (): agGrid.GridOptions<any> {
			return this.agOptions;
		}

		public Init (): this {
			this
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
				suppressCellFocus: true,
			};
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
		protected initEvents (): this {
			this.agOptions.onGridReady = this.eventsManager.HandleGridReady.bind(this.eventsManager);
			this.agOptions.onColumnResized = this.eventsManager.HandleColumnResized.bind(this.eventsManager);
			this.agOptions.onColumnMoved = this.eventsManager.HandleColumnMoved.bind(this.eventsManager);
			this.agOptions.onViewportChanged = this.eventsManager.HandleGridSizeChanged.bind(this.eventsManager, true);
			this.agOptions.onGridSizeChanged = this.eventsManager.HandleGridSizeChanged.bind(this.eventsManager, false);
			this.agOptions.onSelectionChanged = this.eventsManager.HandleSelectionChange.bind(this.eventsManager);
			return this;
		}
	}
}