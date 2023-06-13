namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class GridSizeChange extends Base {
		protected agEvent: agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>;
		protected gridWidth: number;
		protected gridHeight: number;
		public constructor (gridWidth: number, gridHeight: number, agEvent: agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>) {
			super();
			this.gridWidth = gridWidth;
			this.gridHeight = gridHeight;
			this.agEvent = agEvent;
		}
		public GetGridWidth (): number {
			return this.gridWidth;
		}
		public GetGridHeight (): number {
			return this.gridHeight;
		}
		public GetAgEvent (): agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any> {
			return this.agEvent;
		}
	}
}