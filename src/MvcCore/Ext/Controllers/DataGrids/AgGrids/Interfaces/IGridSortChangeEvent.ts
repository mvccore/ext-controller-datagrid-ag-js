declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IGridSortChangeEvent extends IGridEvent {
		sorting: AgGrids.Types.SortItem[];
	}
}