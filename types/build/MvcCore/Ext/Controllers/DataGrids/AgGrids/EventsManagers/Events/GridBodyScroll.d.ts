declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class GridBodyScroll extends Base {
        protected agEvent: agGrid.BodyScrollEvent<any>;
        protected left: number;
        protected top: number;
        protected direction: agGrid.ScrollDirection;
        constructor(left: number, top: number, direction: agGrid.ScrollDirection, agEvent: agGrid.BodyScrollEvent<any>);
        GetLeft(): number;
        GetTop(): number;
        GetDirection(): agGrid.ScrollDirection;
        GetAgEvent(): agGrid.BodyScrollEvent<any>;
    }
}
