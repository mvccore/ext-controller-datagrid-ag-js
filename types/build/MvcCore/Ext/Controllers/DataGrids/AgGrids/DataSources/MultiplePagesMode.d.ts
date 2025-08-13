declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
    class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSource {
        Static: typeof MultiplePagesMode;
        protected eventsManager: AgGrids.EventsManagers.MultiplePagesMode;
        constructor(grid: AgGrid);
        protected initPageReqDataAndCache(): void;
        Load(): this;
        ExecRequest(reqData: Interfaces.Ajax.IReqRawObj, changeUrl?: boolean): this;
        UpdateRows(rowsData: any[]): this;
        protected handleResponse(reqData: Interfaces.Ajax.IReqRawObj, changeUrl: boolean, cacheKey: string, cached: boolean, rawResponse: AgGrids.Interfaces.Ajax.IResponse): void;
        protected handleResponseControls(response: AgGrids.Interfaces.Ajax.IResponse): void;
    }
}
