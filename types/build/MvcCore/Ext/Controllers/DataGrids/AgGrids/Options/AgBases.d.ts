declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Options {
    class AgBases {
        Static: typeof AgBases;
        protected grid: AgGrid;
        protected optionsManager: AgGrids.Options.Manager;
        protected eventsManager: AgGrids.EventsManager;
        protected helpers: AgGrids.Tools.Helpers;
        protected agOptions: agGrid.GridOptions<any>;
        constructor(grid: AgGrid);
        SetAgOptions(options: agGrid.GridOptions<any>): this;
        GetAgOptions(): agGrid.GridOptions<any>;
        Init(): this;
        protected initBases(): this;
        protected initRowSelection(): this;
        protected initEvents(): this;
    }
}
