declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
    class Cache {
        Static: typeof Cache;
        protected enabled: boolean;
        protected maxRows: number;
        protected store: Map<string, Interfaces.Ajax.IResponse>;
        protected keys: string[];
        protected rowsCount: number;
        protected agBaseOptions: Options.AgBases;
        protected rows: Map<string, any>;
        protected rowsIniquelyIdentified: boolean;
        constructor(grid: AgGrid);
        GetEnabled(): boolean;
        SetEnabled(enabled: boolean): this;
        Key(obj: any): string;
        Has(key: string): boolean;
        Get(key: string): Interfaces.Ajax.IResponse;
        Add(key: string, response: Interfaces.Ajax.IResponse): this;
        Update(rowsData: any[]): this;
        protected removeOldestRecord(): this;
    }
}
