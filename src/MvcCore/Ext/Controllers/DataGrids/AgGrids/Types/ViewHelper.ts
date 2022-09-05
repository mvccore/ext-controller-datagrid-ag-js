namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Types {
	export type ViewHelper = (params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[], formatArgs: string[]) => string;
}