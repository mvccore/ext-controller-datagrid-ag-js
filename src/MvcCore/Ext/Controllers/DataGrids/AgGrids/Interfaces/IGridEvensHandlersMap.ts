declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IGridEvensHandlersMap {
		"gridReady": IGridEvent;
		"selectionChange": IGridSelectionChangeEvent;
		"sortChange": IGridSortChangeEvent;
		"filterChange": IGridFilterChangeEvent;
		"pageChange": IGridPageChangeEvent;
	}
}