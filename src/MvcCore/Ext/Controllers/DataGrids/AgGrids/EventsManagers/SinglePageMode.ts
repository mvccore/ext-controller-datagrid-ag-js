namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
		public Static: typeof SinglePageMode;
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			super(grid);
		}
		public AddWindowPopStateChangeEvent (): this {
			window.addEventListener('popstate', (event) => {
				if (this.grid.GetHelpers().IsInstanceOfIServerRequestRaw(event.state)) {
					var dataSource = this.grid.GetDataSource() as AgGrids.DataSources.SinglePageMode;
					dataSource.ExecRequest(event.state);
				}
			});
			return this;
		}
	}
}