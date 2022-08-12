namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class Events {
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			this.grid = grid;
		}
		public HandleColumnResized (params: agGrid.ColumnResizedEvent): void {
			//console.log(params);
		}
		public HandleColumnMoved (params: agGrid.ColumnMovedEvent): void {
			//console.log(params);
		}
		public HandleFilterChanged (params: agGrid.FilterChangedEvent): void {
			//console.log(params);
		}
		public HandleSortChanged (params: agGrid.SortChangedEvent): void {
			//console.log(params);
		}
		public HandleGridSizeChanged (params: agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>): void {
			// get the current grids width
			
			var gridElm = this.grid.GetGridElement(),
				gridElmParent = gridElm.parentNode as HTMLElement;
			var gridWidth = gridElmParent.offsetWidth;
		
			// keep track of which columns to hide/show
			var columnsToShow = [];
			var columnsToHide = [];
		  
			// iterate over all columns (visible or not) and work out
			// now many columns can fit (based on their minWidth)
			var totalColsWidth = 0;
			var allColumns = params.columnApi.getColumns();
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
			params.columnApi.setColumnsVisible(columnsToShow, true);
			params.columnApi.setColumnsVisible(columnsToHide, false);
		  
			// fill out any available space to ensure there are no gaps
			params.api.sizeColumnsToFit();
		}
	}
}