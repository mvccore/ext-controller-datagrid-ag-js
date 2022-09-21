namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
		public Static: typeof SinglePageMode;
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			super(grid);
		}
		public HandleBodyScroll (params: agGrid.BodyScrollEvent<any>): void {
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSources.SinglePageMode;
			dataSource.SetBodyScrolled(params.top > 0);
		}
	}
}