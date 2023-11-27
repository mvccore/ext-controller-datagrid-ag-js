declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
    class ViewHelper {
        static BOOL_FALSE_VALUES: Set<any>;
        static MONEY_DISPLAY_VALUES: Set<any>;
        Static: typeof ViewHelper;
        protected static defaults: Map<Enums.ServerType, Types.ViewHelper>;
        protected grid: AgGrid;
        protected serverConfig: Interfaces.IServerConfig;
        protected localesConfig: Interfaces.IServerConfigs.ILocales;
        protected localeNumeric: string;
        protected localeMoney: string;
        protected localeDateTime: string;
        protected formattersInt: Map<string, Intl.NumberFormat>;
        protected formattersFloat: Map<string, Intl.NumberFormat>;
        protected formattersMoney: Map<string, Intl.NumberFormat>;
        protected translator: Tools.Translator;
        constructor(grid: AgGrid);
        SetUpColumnCfg(agColumnCfg: agGrid.ColDef, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): this;
        protected getIntFormater(formatterKey: string, formatArgs: string[] | null): Intl.NumberFormat;
        protected getFloatFormater(formatterKey: string, formatArgs: string[] | null): Intl.NumberFormat;
        protected getMoneyFormater(formatterKey: string, formatArgs: string[] | null): Intl.NumberFormat;
        protected formatBool(params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[] | null, formatArgs: string[] | null): string;
        protected formatInt(params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[] | null, formatArgs: string[] | null): string;
        protected formatFloat(params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[] | null, formatArgs: string[] | null): string;
        protected formatMoney(params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[] | null, formatArgs: string[] | null): string;
        protected formatDate(params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[] | null, formatArgs: string[] | null): string;
        protected formatDateTime(params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[] | null, formatArgs: string[] | null): string;
        protected formatTime(params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[] | null, formatArgs: string[] | null): string;
    }
}
