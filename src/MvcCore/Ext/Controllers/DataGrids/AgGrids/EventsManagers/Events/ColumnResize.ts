namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class ColumnResize extends Base {
		protected columnId: string;
		protected newWidth: number;
		protected agEvent: agGrid.ColumnResizedEvent<any>;
		public constructor (columnId: string, newWidth: number, agEvent: agGrid.ColumnResizedEvent<any>) {
			super();
			this.columnId = columnId;
			this.newWidth = newWidth;
			this.agEvent = agEvent;
		}
		public GetColumnId (): string {
			return this.columnId;
		}
		public SetNewWidth (newWidth: number): this {
			this.newWidth = newWidth;
			return this;
		}
		public GetNewWidth (): number {
			return this.newWidth;
		}
		public SetAgEvent (agEvent: agGrid.ColumnResizedEvent<any>): this {
			this.agEvent = agEvent;
			return this;
		}
		public GetAgEvent (): agGrid.ColumnResizedEvent<any> {
			return this.agEvent;
		}
	}
}