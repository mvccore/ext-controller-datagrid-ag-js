namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
		public Static: typeof SinglePageMode;
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			super(grid);
		}
		public HandleBodyScroll (event: agGrid.BodyScrollEvent<any>): void {
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSources.SinglePageMode;
			if (event.direction === 'vertical')
				dataSource.SetBodyScrolled(event.top > 0);
			super.HandleBodyScroll(event);
		}
	}
}