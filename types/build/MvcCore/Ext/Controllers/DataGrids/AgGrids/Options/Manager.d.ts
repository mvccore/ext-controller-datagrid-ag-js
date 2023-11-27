declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Options {
    class Manager {
        static readonly SELECTORS: {
            AG_GRID_SEL: string;
            BOTTOM_CONTROLS: {
                CONT_SEL: string;
                COUNT_SCALES_SEL: string;
                REFRESH_SEL: string;
                STATUS_SEL: string;
                PAGING_SEL: string;
                COUNT_SCALES_ANCHOR_SEL: string;
                REFRESH_ANCHOR_SEL: string;
                REFRESH_ANCHOR_LOADING_CLS: string;
                PAGING_ANCHOR_SEL: string;
            };
        };
        static readonly SYSTEM_LOCALE_SEPARATOR: string;
        static readonly SINGLE_PAGE_MODE: {
            MAX_ROWS_2_SUPPRESS_ROW_VIRTUALIZATION: number;
        };
        Static: typeof Manager;
        protected grid: AgGrid;
        protected eventsManager: AgGrids.EventsManager;
        protected helpers: AgGrids.Tools.Helpers;
        protected agBases: AgGrids.Options.AgBases;
        protected columnManager: AgGrids.Columns.Manager;
        protected elements: AgGrids.Interfaces.SortHeaders.IElements;
        protected agOptions: agGrid.GridOptions<any>;
        protected agDataSource: agGrid.IDatasource;
        constructor(grid: AgGrid);
        SetElements(elements: AgGrids.Interfaces.SortHeaders.IElements): this;
        GetElements(): AgGrids.Interfaces.SortHeaders.IElements;
        SetAgBases(agBases: AgGrids.Options.AgBases): this;
        GetAgBases(): AgGrids.Options.AgBases;
        SetAgOptions(options: agGrid.GridOptions<any>): this;
        GetAgOptions(): agGrid.GridOptions<any>;
        SetColumnManager(columnManager: AgGrids.Columns.Manager): this;
        GetColumnManager(): AgGrids.Columns.Manager;
        InitElements(): this;
        InitBottomControls(): this;
        InitBottomControlsCountScales(): this;
        InitBottomControlsRefresh(): this;
        InitBottomControlsPaging(): this;
        InitAgBases(): this;
        InitAgColumns(): this;
        InitAgPageModeSpecifics(): this;
        protected initSinglePageSpecifics(): this;
        protected initMultiplePagesSpecifics(): this;
    }
}
