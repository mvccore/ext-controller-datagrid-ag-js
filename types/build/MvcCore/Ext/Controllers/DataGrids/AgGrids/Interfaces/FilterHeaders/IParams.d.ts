declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.FilterHeaders {
    interface IParams<P = agGrid.InbuiltParentType, TData = any> extends agGrid.IFloatingFilterParams<P, TData> {
        submitDelayMs: number;
        grid: AgGrid;
        columnId: string;
        filteringItem: Map<Enums.Operator, string[]>;
    }
}
