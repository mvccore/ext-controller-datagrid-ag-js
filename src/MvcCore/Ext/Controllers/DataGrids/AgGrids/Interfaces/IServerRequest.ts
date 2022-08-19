declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IServerRequest {
		offset: number;
		limit: number;
		sorting: [string, 0 | 1][];
		filtering: Map<string, Map<Enums.Operator, string[]>>;
	}
}