declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IGridEvensHandlersMap {
		"selectionChange": IGridSelectionChangeEvent;
		"sortChange": IGridSortChangeEvent;
		"filterChange": IGridFilterChangeEvent;
		"pageChange": IGridPageChangeEvent;
	}
}