declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IServerRequest {
		offset: number;
		limit: number;
		sorting: AgGrids.Types.SortItem[];
		filtering: Map<string, Map<Enums.Operator, string[]>>;
	}
}