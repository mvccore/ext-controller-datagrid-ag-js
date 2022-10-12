namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class HistoryChange extends Base {
		protected offsetBefore: number;
		protected offsetAfter: number;
		protected sortingBefore: AgGrids.Types.SortItem[];
		protected sortingAfter: AgGrids.Types.SortItem[];
		protected filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		protected filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
		public constructor (
			offsetBefore: number, 
			offsetAfter: number,
			sortingBefore: AgGrids.Types.SortItem[], 
			sortingAfter: AgGrids.Types.SortItem[],
			filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>, 
			filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>
		) {
			super();
			this.offsetBefore = offsetBefore;
			this.offsetAfter = offsetAfter;
			this.sortingBefore = sortingBefore;
			this.sortingAfter = sortingAfter;
			this.filteringBefore = filteringBefore;
			this.filteringAfter = filteringAfter;
		}
		public SetOffsetBefore (offsetBefore: number): this {
			this.offsetBefore = offsetBefore;
			return this;
		}
		public GetOffsetBefore (): number {
			return this.offsetBefore;
		}
		public SetOffsetAfter (offsetAfter: number): this {
			this.offsetAfter = offsetAfter;
			return this;
		}
		public GetOffsetAfter (): number {
			return this.offsetAfter;
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