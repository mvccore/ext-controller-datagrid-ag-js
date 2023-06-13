namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class GridBodyScroll extends Base {
		protected agEvent: agGrid.BodyScrollEvent<any>;
		protected left: number;
		protected top: number;
		protected direction: agGrid.ScrollDirection;
		public constructor (left: number, top: number, direction: agGrid.ScrollDirection, agEvent: agGrid.BodyScrollEvent<any>) {
			super();
			this.left = left;
			this.top = top;
			this.direction = direction;
			this.agEvent = agEvent;
		}
		public GetLeft (): number {
			return this.left;
		}
		public GetTop (): number {
			return this.top;
		}
		public GetDirection (): agGrid.ScrollDirection {
			return this.direction;
		}
		public GetAgEvent (): agGrid.BodyScrollEvent<any> {
			return this.agEvent;
		}
	}
}