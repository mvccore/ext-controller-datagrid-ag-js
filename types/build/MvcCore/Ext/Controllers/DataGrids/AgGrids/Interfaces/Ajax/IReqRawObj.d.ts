declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.Ajax {
    interface IReqRawObj extends Omit<IRequest, 'sorting' | 'filtering'> {
        id: string;
        mode: number;
        path: string;
        sorting: any;
        filtering: any;
        title?: string;
    }
}
