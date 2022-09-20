declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.Events {
	interface IHandlersMap {
		"gridReady": IBase;
		"selectionChange": ISelectionChange;
		"sortChange": ISortChange;
		"filterChange": IFilterChange;
		"pageChange": IPageChange;
	}
}