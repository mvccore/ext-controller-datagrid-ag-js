namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class FilterChange extends Base {
		protected filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		protected filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		public constructor (filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>, filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>) {
			super();
			this.filteringBefore = filteringBefore;
			this.filteringAfter = filteringAfter;
		}
		public SetFilteringBefore (filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>): this {
			this.filteringBefore = filteringBefore;
			return this;
		}
		public GetFilteringBefore (): Map<string, Map<AgGrids.Enums.Operator, string[]>> {
			return this.filteringBefore;
		}
		public SetFilteringAfter (filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>): this {
			this.filteringAfter = filteringAfter;
			return this;
		}
		public GetFilteringAfter (): Map<string, Map<AgGrids.Enums.Operator, string[]>> {
			return this.filteringAfter;
		}
	}
}