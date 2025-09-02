declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Tools {
    class Helpers {
        Static: typeof Helpers;
        protected grid: AgGrid;
        protected touchDevice: boolean;
        protected isChromeBrowser: boolean;
        constructor(grid: AgGrid);
        CloneFiltering(filtering: Map<string, Map<Enums.Operator, string[]>>): Map<string, Map<Enums.Operator, string[]>>;
        GetControlTypeByOperatorAndValue(operator: Enums.Operator | null, value: string | null, defaultResult: Enums.FilterControlType, serverType: Enums.ServerType): Enums.FilterControlType;
        RetypeFilteringMap2Obj(filtering: Map<string, Map<Enums.Operator, string[]>>): any;
        RetypeRequestMaps2Objects(serverRequest: Interfaces.Ajax.IRequest): Interfaces.Ajax.IReqRawObj;
        protected addRequestSystemData(serverRequest: Interfaces.Ajax.IReqRawObj): Interfaces.Ajax.IReqRawObj;
        RetypeRawServerResponse(serverResponse: Interfaces.Ajax.IResponse): Interfaces.Ajax.IResponse;
        RetypeRequestObjects2Maps(serverRequest: Interfaces.Ajax.IReqRawObj): Interfaces.Ajax.IRequest;
        protected retypeFilteringObj2Map(filtering: any): Map<string, Map<Enums.Operator, string[]>>;
        IsTouchDevice(): boolean;
        IsChromeBrowser(): boolean;
        GetHtmlElementFromString(htmlCode: string): HTMLElement;
        IsInstanceOfIServerRequestRaw(obj: any): boolean;
        RetypeRawServerConfig(serverConfig: Interfaces.IServerConfig): Interfaces.IServerConfig;
        GetAllowedOperators(columnFilterFlags: Enums.FilteringMode): Map<Enums.Operator, AgGrids.Interfaces.SortHeaders.IAllowedOperator>;
        SortConfigColumns(serverColumns: AgGrids.Interfaces.IServerConfigs.IColumn[], columnIndexPropName: keyof AgGrids.Interfaces.IServerConfigs.IColumnIndexes): AgGrids.Interfaces.IServerConfigs.IColumn[];
        /**
         * Check if given value contains any LIKE/NOT LIKE special
         * character: `%` or `_` or escaped like this: `[%]` or `[_]`.
         * Returns `0` if no special char `%` or `_` matched.
         * Returns `1` if special char `%` or `_` matched in raw form only, not escaped.
         * Returns `2` if special char `%` or `_` matched in escaped form only.
         * Returns `1 | 2` if special char `%` or `_` matched in both forms.
         */
        CheckFilterValueForLikeChar(rawValue: string, specialLikeChar: '_' | '%'): number;
        static ConvertObject2Map<TKey, TValue>(obj: any): Map<TKey, TValue>;
        static ConvertMap2Object<TKey, TValue>(map: Map<TKey, TValue>): object;
        static Trim(str: string, charlist: string): string;
        MergeObjectsRecursively(target: any, ...sources: any[]): any;
        protected normalizeColumnParserArgs(configColumn: Interfaces.IServerConfigs.IColumn): void;
        protected isObjectAndNotArray(item: any): boolean;
        protected isObject(obj: any): boolean;
        protected isArray(obj: any): boolean;
    }
}
