declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
    interface IServerConfig {
        version: string;
        contElementSelector: string;
        renderConfig: IServerConfigs.IRenderConfig;
        columns: {
            [columnUrlName: string]: IServerConfigs.IColumn;
        };
        columnIdsSeparator: string;
        locales: IServerConfigs.ILocales;
        urlSegments: IServerConfigs.IUrlSegment;
        filterOperatorPrefixes: Map<Enums.Operator, string>;
        ajaxParamsNames: Map<Enums.AjaxParamName, string>;
        id: string;
        clientPageMode: Enums.ClientPageMode;
        urlData: string;
        urlColumnsChanges: string;
        urlColumnsStates: string;
        gridUrlParamName: string;
        gridActionParamName: string;
        gridActionColumnStates: string;
        ignoreDisabledColumns: boolean;
        dataRequestMethod: Enums.AjaxDataRequestMethod;
        rowSelection: Enums.RowSelection;
        itemsPerPage: number;
        page: number;
        count: number;
        sortingMode: Enums.SortingMode;
        filteringMode: Enums.FilteringMode;
        controlsTexts: Map<Enums.ControlText, string>;
        timeZoneOffset: number;
        clientChangeHistory: boolean;
        clientTitleTemplate?: string;
        clientRequestBlockSize: number;
        clientCache: boolean;
        clientRowBuffer: number;
        clientMaxRowsInCache: number;
        clientRowBufferMax: number;
    }
}
