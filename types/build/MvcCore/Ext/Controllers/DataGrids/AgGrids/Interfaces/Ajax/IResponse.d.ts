declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.Ajax {
    interface IResponse {
        totalCount: number;
        offset: number;
        limit: number;
        sorting: AgGrids.Types.SortItem[];
        filtering: Map<string, Map<Enums.Operator, string[]>>;
        controls: {
            countScales?: string;
            status?: string;
            paging?: string;
        };
        url: string;
        path: string;
        page: number;
        count: number;
        dataCount: number;
        data: any[];
    }
}
