declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class ColumnResize extends Base {
        protected columnId: string;
        protected newWidth: number;
        protected agEvent: agGrid.ColumnResizedEvent<any>;
        constructor(columnId: string, newWidth: number, agEvent: agGrid.ColumnResizedEvent<any>);
        GetColumnId(): string;
        SetNewWidth(newWidth: number): this;
        GetNewWidth(): number;
        SetAgEvent(agEvent: agGrid.ColumnResizedEvent<any>): this;
        GetAgEvent(): agGrid.ColumnResizedEvent<any>;
    }
}
