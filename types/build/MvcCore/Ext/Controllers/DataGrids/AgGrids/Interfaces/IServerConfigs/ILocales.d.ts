declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs {
    interface ILocales {
        locale: string[];
        localeNumeric: string[];
        localeMoney: string[];
        localeDateTime: string[];
        currencyCode: string;
        currencySign: string;
        currencyFractions: number;
        currencyRoundIncrement: number;
        floatFractions: number;
        parserArgsDate: string[];
        parserArgsDateTime: string[];
        parserArgsTime: string[];
        formatArgsDate: string[];
        formatArgsDateTime: string[];
        formatArgsTime: string[];
    }
}
