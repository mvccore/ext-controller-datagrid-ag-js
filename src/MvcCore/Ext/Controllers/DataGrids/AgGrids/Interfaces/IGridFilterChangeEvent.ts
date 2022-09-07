declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IGridFilterChangeEvent extends IGridEvent {
		filtering: Map<string, Map<AgGrids.Enums.Operator, string[]>>;
	}
}