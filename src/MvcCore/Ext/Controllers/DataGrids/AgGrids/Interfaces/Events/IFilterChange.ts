declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.Events {
	interface IFilterChange extends IBase {
		filtering: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
	}
}