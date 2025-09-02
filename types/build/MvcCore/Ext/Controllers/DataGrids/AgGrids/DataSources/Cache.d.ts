declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
    class Cache {
        Static: typeof Cache;
        protected helpers: AgGrids.Tools.Helpers;
        protected enabled: boolean;
        protected maxRows: number;
        protected store: Map<string, [number, Interfaces.Ajax.IResponse]>;
        protected reqDataKeys: string[];
        protected rowsCount: number;
        protected agBaseOptions: Options.AgBases;
        protected rowIds2StoreIds: Map<string, [number, number]>;
        protected storeIds2Keys: Map<number, string>;
        protected storeIdsCounter: number;
        protected rowsIniquelyIdentified: boolean;
        protected cacheBlockSize: number;
        constructor(grid: AgGrid);
        Purge(): this;
        GetEnabled(): boolean;
        SetEnabled(enabled: boolean): this;
        Key(reqData: Interfaces.Ajax.IReqRawObj): string;
        Has(reqDataKey: string): boolean;
        Get(reqDataKey: string): Interfaces.Ajax.IResponse;
        Add(reqDataKey: string, response: Interfaces.Ajax.IResponse): this;
        Update(rowsData: any[]): this;
        protected removeOldestRecord(): this;
    }
}
