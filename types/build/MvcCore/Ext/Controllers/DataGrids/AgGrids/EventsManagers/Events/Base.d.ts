declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class Base {
        protected grid: AgGrid;
        protected eventName: AgGrids.Types.GridEventName;
        protected stopCurrentEventPropagation: boolean;
        protected stopNextEventsPropagation: boolean;
        constructor();
        SetGrid(grid: AgGrid): this;
        GetGrid(): AgGrid;
        SetEventName(eventName: AgGrids.Types.GridEventName): this;
        GetEventName(): AgGrids.Types.GridEventName;
        SetStopCurrentEventPropagation(stopCurrentEventPropagation?: boolean): this;
        GetStopCurrentEventPropagation(): boolean;
        SetStopNextEventsPropagation(stopNextEventsPropagation?: boolean): this;
        GetStopNextEventsPropagation(): boolean;
    }
}
