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
		public HandleSortChange (columnId: string, direction: 1 | 0 | null): void {
			var oldSorting = this.grid.GetSorting(),
				sortHeaders = this.grid.GetSortHeaders(),
				newSorting: [string, 0 | 1 | null][] = [],
				sortRemoving = direction == null;
			if (!sortRemoving)
				newSorting.push([columnId, direction]);
			for (var [sortColId, sortDir] of oldSorting) {
				if (sortColId === columnId) continue;
				newSorting.push([sortColId, sortDir]);
			}
			for (var i = 0, sortColId = '', l = newSorting.length; i < l; i++) {
				var [sortColId] = newSorting[i];
				if (sortColId === columnId) continue;
				sortHeaders.get(sortColId).SetSequence(i);
			}
			this.grid.SetSorting(newSorting);
			var pageMode = this.grid.GetPageMode();
			if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				// for single page - TODO
				var dataSourceSp = this.grid.GetDataSource() as AgGrids.DataSources.SinglePageMode;
				console.log(dataSourceSp);
			} else if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				// for multiple pages - call ajax with new params completed later
				var dataSourceMp = this.grid.GetDataSource() as AgGrids.DataSources.MultiplePagesMode;
				dataSourceMp.Load();
			}

		}
		/*public HandleSortChanged (event: agGrid.SortChangedEvent<any>): void {
			
			console.log(event, event.source);
			//event.columnApi.
		}*/
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