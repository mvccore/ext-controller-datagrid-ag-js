declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class GridSizeChange extends Base {
        protected agEvent: agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>;
        protected gridWidth: number;
        protected gridHeight: number;
        constructor(gridWidth: number, gridHeight: number, agEvent: agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>);
        GetGridWidth(): number;
        GetGridHeight(): number;
        GetAgEvent(): agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>;
    }
}
