declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class HistoryChange extends Base {
        protected offsetBefore: number;
        protected offsetAfter: number;
        protected sortingBefore: AgGrids.Types.SortItem[];
        protected sortingAfter: AgGrids.Types.SortItem[];
        protected filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
        protected filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
        constructor(offsetBefore: number, offsetAfter: number, sortingBefore: AgGrids.Types.SortItem[], sortingAfter: AgGrids.Types.SortItem[], filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>, filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>);
        SetOffsetBefore(offsetBefore: number): this;
        GetOffsetBefore(): number;
        SetOffsetAfter(offsetAfter: number): this;
        GetOffsetAfter(): number;
        SetSortingBefore(sortingBefore: AgGrids.Types.SortItem[]): this;
        GetSortingBefore(): AgGrids.Types.SortItem[];
        SetSortingAfter(sortingAfter: AgGrids.Types.SortItem[]): this;
        GetSortingAfter(): AgGrids.Types.SortItem[];
        SetFilteringBefore(filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>): this;
        GetFilteringBefore(): Map<string, Map<AgGrids.Enums.Operator, string[]>>;
        SetFilteringAfter(filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>): this;
        GetFilteringAfter(): Map<string, Map<AgGrids.Enums.Operator, string[]>>;
    }
}
