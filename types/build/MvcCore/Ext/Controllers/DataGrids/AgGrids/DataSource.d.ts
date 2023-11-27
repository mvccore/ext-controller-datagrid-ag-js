declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
    abstract class DataSource {
        Static: typeof DataSource;
        protected grid: AgGrid;
        protected optionsManager: AgGrids.Options.Manager;
        protected eventsManager: AgGrids.EventsManager;
        protected helpers: AgGrids.Tools.Helpers;
        protected initialData: Interfaces.Ajax.IResponse;
        protected cache: DataSources.Cache;
        protected pageReqData?: Interfaces.Ajax.IReqRawObj;
        protected serverConfig: Interfaces.IServerConfig;
        protected docTitleChange: boolean;
        protected docTitlePattern: string;
        protected lastHistory: [Interfaces.Ajax.IReqRawObj, string, number, number];
        protected autoSelectFirstRow: boolean;
        constructor(grid: AgGrid);
        abstract ExecRequest(reqData: Interfaces.Ajax.IReqRawObj, changeUrl: boolean): this;
        GetCache(): DataSources.Cache;
        SetLastHistory(lastHistory: [Interfaces.Ajax.IReqRawObj, string, number, number]): this;
        GetLastHistory(): [Interfaces.Ajax.IReqRawObj, string, number, number];
        BrowserHistoryReplace(stateData: Interfaces.Ajax.IReqRawObj, url: string, page: number, count: number): this;
        BrowserHistoryPush(stateData: Interfaces.Ajax.IReqRawObj, url: string, page: number, count: number): this;
        AjaxLoad(url: string, method: string, data: Interfaces.Ajax.IReqRawObj, type: string, success: (rawResponse: AgGrids.Interfaces.Ajax.IResponse) => void): void;
        CompleteDocumentTitle(stateData: Interfaces.Ajax.IReqRawObj, page: number, count: number): string;
        protected completeDocumentTitleSorting(sorting: Types.SortItem[], docTitleReplacements: string[]): this;
        protected completeDocumentTitleFiltering(stateDataFiltering: any, docTitleReplacements: string[]): this;
        protected completeDocumentTitleFilteringItem(columnUrlName: string, filteringItem: any): Map<Enums.FilterControlType, string[]>;
        protected handleResponseControls(response: AgGrids.Interfaces.Ajax.IResponse): void;
        protected initPageReqDataAndCache(): void;
        protected getReqUrlMethodAndType(): [string, string, string];
    }
}
