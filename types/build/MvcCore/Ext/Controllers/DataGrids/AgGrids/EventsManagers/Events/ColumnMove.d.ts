declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class ColumnMove extends Base {
        protected columnId: string;
        protected toIndex: number;
        protected agEvent: agGrid.ColumnMovedEvent<any>;
        constructor(columnId: string, toIndex: number, agEvent: agGrid.ColumnMovedEvent<any>);
        GetColumnId(): string;
        SetToIndex(toIndex: number): this;
        GetToIndex(): number;
        SetAgEvent(agEvent: agGrid.ColumnMovedEvent<any>): this;
        GetAgEvent(): agGrid.ColumnMovedEvent<any>;
    }
}
