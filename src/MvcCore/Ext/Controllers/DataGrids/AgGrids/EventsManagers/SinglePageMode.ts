namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
		public Static: typeof SinglePageMode;
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			super(grid);
		}
	}
}