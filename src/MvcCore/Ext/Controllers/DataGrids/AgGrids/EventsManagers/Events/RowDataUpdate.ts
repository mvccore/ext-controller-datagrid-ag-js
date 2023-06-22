namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class RowDataUpdate extends Base {
		protected agEvent: agGrid.RowDataUpdatedEvent<any>;
		public constructor (agEvent: agGrid.RowDataUpdatedEvent<any>) {
			super();
			this.agEvent = agEvent;
		}
		public GetAgEvent (): agGrid.RowDataUpdatedEvent<any> {
			return this.agEvent;
		}
	}
}