declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.Ajax {
    interface IRequest {
        offset: number;
        limit: number;
        sorting: AgGrids.Types.SortItem[];
        filtering: Map<string, Map<Enums.Operator, string[]>>;
    }
}
