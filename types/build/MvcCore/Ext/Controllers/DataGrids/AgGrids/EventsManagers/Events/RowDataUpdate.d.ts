declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class RowDataUpdate extends Base {
        protected agEvent: agGrid.RowDataUpdatedEvent<any>;
        constructor(agEvent: agGrid.RowDataUpdatedEvent<any>);
        GetAgEvent(): agGrid.RowDataUpdatedEvent<any>;
    }
}
