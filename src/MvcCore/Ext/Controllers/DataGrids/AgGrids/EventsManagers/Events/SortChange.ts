namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class SortChange extends Base {
		protected sortingBefore: AgGrids.Types.SortItem[];
		protected sortingAfter: AgGrids.Types.SortItem[];
		public constructor (sortingBefore: AgGrids.Types.SortItem[], sortingAfter: AgGrids.Types.SortItem[]) {
			super();
			this.sortingBefore = sortingBefore;
			this.sortingAfter = sortingAfter;
		}
		public SetSortingBefore (sortingBefore: AgGrids.Types.SortItem[]): this {
			this.sortingBefore = sortingBefore;
			return this;
		}
		public GetSortingBefore (): AgGrids.Types.SortItem[] {
			return this.sortingBefore;
		}
		public SetSortingAfter (sortingAfter: AgGrids.Types.SortItem[]): this {
			this.sortingAfter = sortingAfter;
			return this;
		}
		public GetSortingAfter (): AgGrids.Types.SortItem[] {
			return this.sortingAfter;
		}
	}
}