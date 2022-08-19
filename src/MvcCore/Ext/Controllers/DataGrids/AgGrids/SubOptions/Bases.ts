namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.SubOptions {
	export class Bases {
		public Static: typeof Bases;
		
		protected grid: AgGrid;
		protected options: AgGrids.Options;
		protected events: AgGrids.Events;
		protected helpers: AgGrids.Helpers;

		protected agOptions: agGrid.GridOptions<any>;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.options = grid.GetOptions();
			this.events = grid.GetEvents();
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
				//localeText: agGridLocales['cs-CZ']
				tooltipShowDelay: 0,
				tooltipHideDelay: 2000,
				animateRows: false,
				suppressColumnVirtualisation: true,
				debounceVerticalScrollbar: true,
				alwaysShowVerticalScroll: true,
			};
			if (this.helpers.IsChromeBrowser())
				this.agOptions.suppressAnimationFrame = true;
			return this;
		}
		protected initRowSelection (): this {
			var rowSel = this.grid.GetServerConfig().rowSelection;
			var rowSelectionNone = (rowSel & Enums.RowSelection.ROW_SELECTION_NONE) != 0;
			if (
				rowSelectionNone ||
				(rowSel & Enums.RowSelection.ROW_SELECTION_SINGLE) != 0
			) {
				this.agOptions.rowSelection = 'single';
				if (rowSelectionNone)
					this.agOptions.suppressRowClickSelection = true;
			} else if ((rowSel & Enums.RowSelection.ROW_SELECTION_MULTIPLE) != 0) {
				this.agOptions.rowSelection = 'multiple';
				if (this.helpers.IsTouchDevice())
					this.agOptions.rowMultiSelectWithClick = true;
			}
			if ((rowSel & Enums.RowSelection.ROW_SELECTION_NOT_DESELECT) != 0)
				this.agOptions.suppressRowDeselection = true;
			return this;
		}
		protected initEvents (): this {
			this.agOptions.onColumnResized = this.events.HandleColumnResized.bind(this.events);
			this.agOptions.onColumnMoved = this.events.HandleColumnMoved.bind(this.events);
			this.agOptions.onFilterChanged = this.events.HandleFilterChanged.bind(this.events);
			this.agOptions.onSortChanged = this.events.HandleSortChanged.bind(this.events);
			/*this.agOptions.onFirstDataRendered = (params: agGrid.FirstDataRenderedEvent) => {
				params.api.sizeColumnsToFit();
			},*/
			this.agOptions.onViewportChanged = this.events.HandleGridSizeChanged.bind(this.events);
			/*this.agOptions.onGridReady = (params: agGrid.GridReadyEvent): void => {
				params.api.sizeColumnsToFit();
			},*/
			this.agOptions.onGridSizeChanged = this.events.HandleGridSizeChanged.bind(this.events);
			return this;
		}
	}
}