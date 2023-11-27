declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class SortChange extends Base {
        protected sortingBefore: AgGrids.Types.SortItem[];
        protected sortingAfter: AgGrids.Types.SortItem[];
        constructor(sortingBefore: AgGrids.Types.SortItem[], sortingAfter: AgGrids.Types.SortItem[]);
        SetSortingBefore(sortingBefore: AgGrids.Types.SortItem[]): this;
        GetSortingBefore(): AgGrids.Types.SortItem[];
        SetSortingAfter(sortingAfter: AgGrids.Types.SortItem[]): this;
        GetSortingAfter(): AgGrids.Types.SortItem[];
    }
}
