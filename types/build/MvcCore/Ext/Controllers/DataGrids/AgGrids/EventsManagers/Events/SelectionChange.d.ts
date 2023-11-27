declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class SelectionChange extends Base {
        protected userChange: boolean;
        protected selectedRowNodesBefore: agGrid.RowNode<any>[];
        protected selectedRowNodesAfter: agGrid.RowNode<any>[];
        constructor(userChange: boolean, selectedRowNodesBefore: agGrid.RowNode<any>[], selectedRowNodesAfter: agGrid.RowNode<any>[]);
        SetUserChange(userChange: boolean): this;
        GetUserChange(): boolean;
        SetSelectedRowNodesBefore(selectedRowNodesBefore: agGrid.RowNode<any>[]): this;
        GetSelectedRowNodesBefore(): agGrid.RowNode<any>[];
        SetSelectedRowNodesAfter(selectedRowNodesAfter: agGrid.RowNode<any>[]): this;
        GetSelectedRowNodesAfter(): agGrid.RowNode<any>[];
    }
}
