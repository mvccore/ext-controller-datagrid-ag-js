namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class Base {
		protected grid: AgGrid;
		protected eventName: AgGrids.Types.GridEventName;
		protected stopCurrentEventPropagation: boolean = false;
		protected stopNextEventsPropagation: boolean = false;
		public constructor () {
		}
		public SetGrid (grid: AgGrid): this {
			this.grid = grid;
			return this;
		}
		public GetGrid (): AgGrid {
			return this.grid;
		}
		public SetEventName (eventName: AgGrids.Types.GridEventName): this {
			this.eventName = eventName;
			return this;
		}
		public GetEventName (): AgGrids.Types.GridEventName {
			return this.eventName;
		}
		public SetStopCurrentEventPropagation (stopCurrentEventPropagation: boolean = true): this {
			this.stopCurrentEventPropagation = stopCurrentEventPropagation;
			return this;
		}
		public GetStopCurrentEventPropagation (): boolean {
			return this.stopCurrentEventPropagation;
		}
		public SetStopNextEventsPropagation (stopNextEventsPropagation: boolean = true): this {
			this.stopNextEventsPropagation = stopNextEventsPropagation;
			return this;
		}
		public GetStopNextEventsPropagation (): boolean {
			return this.stopNextEventsPropagation;
		}
	}
}