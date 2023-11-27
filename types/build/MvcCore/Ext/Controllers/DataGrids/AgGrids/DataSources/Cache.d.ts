declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
    class Cache {
        Static: typeof Cache;
        protected maxRows: number;
        protected enabled: boolean;
        protected store: Map<string, Interfaces.Ajax.IResponse>;
        protected keys: string[];
        protected rowsCount: number;
        constructor(grid: AgGrid);
        SetEnabled(enabled: boolean): this;
        Key(obj: any): string;
        Has(key: string): boolean;
        Get(key: string): Interfaces.Ajax.IResponse;
        Add(key: string, response: Interfaces.Ajax.IResponse): this;
        protected removeOldestRecord(): this;
    }
}
