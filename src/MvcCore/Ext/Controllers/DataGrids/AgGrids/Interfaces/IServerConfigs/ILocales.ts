declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs {
	interface ILocales {
		locale: string[];
		localeNumeric: string[];
		localeMoney: string[];
		localeDateTime: string[];
		currencyCode: string;
		currencySign: string;
		currencyFractions: number;
		floatFractions: number;
		formatPatternDate: string;
		formatPatternDateTime: string;
		formatPatternTime: string;
	}
}