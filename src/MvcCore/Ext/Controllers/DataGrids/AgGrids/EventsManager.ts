namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class EventsManager {
		public Static: typeof EventsManager;
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			this.grid = grid;
		}
		public HandleColumnResized (event: agGrid.ColumnResizedEvent<any>): void {
			//console.log(event);
		}
		public HandleColumnMoved (event: agGrid.ColumnMovedEvent<any>): void {
			//console.log(event);
		}
		public HandleFilterChanged (event: agGrid.FilterChangedEvent<any>): void {
			this.grid.SetTotalCount(null);
			//console.log(event);
		}
		public HandleSortChanged (event: agGrid.SortChangedEvent<any>): void {
			
			console.log(event, event.source);
			//event.columnApi.
		}
		public HandleGridSizeChanged (event: agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>): void {
			// get the current grids width
			var gridElm = this.grid.GetOptions().GetElements().agGridElement,
				gridElmParent = gridElm.parentNode as HTMLElement;
			var gridWidth = gridElmParent.offsetWidth;
			// keep track of which columns to hide/show
			var columnsToShow: string[] = [],
				columnsToHide: string[] = [];
			// iterate over all columns (visible or not) and work out
			// now many columns can fit (based on their minWidth)
			var totalColsWidth = 0;
			var allColumns = event.columnApi.getColumns();
			if (allColumns && allColumns.length > 0) {
				for (var i = 0; i < allColumns.length; i++) {
					var column = allColumns[i];
					totalColsWidth += column.getMinWidth() || 0;
					if (totalColsWidth > gridWidth) {
						columnsToHide.push(column.getColId());
					} else {
						columnsToShow.push(column.getColId());
					}
				}
			}
			// show/hide columns based on current grid width
			event.columnApi.setColumnsVisible(columnsToShow, true);
			event.columnApi.setColumnsVisible(columnsToHide, false);
			// fill out any available space to ensure there are no gaps
			event.api.sizeColumnsToFit();
		}
	}
}