namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class ColumnMove extends Base {
		protected columnId: string;
		protected toIndex: number;
		protected agEvent: agGrid.ColumnMovedEvent<any>;
		public constructor (columnId: string, toIndex: number, agEvent: agGrid.ColumnMovedEvent<any>) {
			super();
			this.columnId = columnId;
			this.toIndex = toIndex;
			this.agEvent = agEvent;
		}
		public GetColumnId (): string {
			return this.columnId;
		}
		public SetToIndex (toIndex: number): this {
			this.toIndex = toIndex;
			return this;
		}
		public GetToIndex (): number {
			return this.toIndex;
		}
		public SetAgEvent (agEvent: agGrid.ColumnMovedEvent<any>): this {
			this.agEvent = agEvent;
			return this;
		}
		public GetAgEvent (): agGrid.ColumnMovedEvent<any> {
			return this.agEvent;
		}
	}
}