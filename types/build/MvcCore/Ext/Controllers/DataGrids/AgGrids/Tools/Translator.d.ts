declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Tools {
    class Translator {
        static LOCALE_DEFAULT: string;
        Static: typeof Translator;
        protected store: {
            [key: string]: string;
        };
        protected grid: AgGrid;
        constructor(grid: AgGrid);
        GetStore(): {
            [key: string]: string;
        } | null;
        Translate(translationKey: string): string;
    }
}
