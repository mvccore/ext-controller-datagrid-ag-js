declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	interface IServerResponse {
		TotalCount: number;
		RowCount: number;
		Data: any[];
		StartRow: number;
		EndRow: number;
	}
}