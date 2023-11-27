declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class FilterChange extends Base {
        protected filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
        protected filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
        constructor(filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>, filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>);
        SetFilteringBefore(filteringBefore: Map<string, Map<AgGrids.Enums.Operator, string[]>>): this;
        GetFilteringBefore(): Map<string, Map<AgGrids.Enums.Operator, string[]>>;
        SetFilteringAfter(filteringAfter: Map<string, Map<AgGrids.Enums.Operator, string[]>>): this;
        GetFilteringAfter(): Map<string, Map<AgGrids.Enums.Operator, string[]>>;
    }
}
