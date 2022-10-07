declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.Events {
	interface IHandlersMap {
		"gridReady": IBase;
		"selectionChange": ISelectionChange;
		"sortChange": ISortChange;
		"filterChange": IFilterChange;
		"pageChange": IPageChange;
		/*
		"beforePopState": IBase;
		"beforeSelectionChange": ISelectionChange;
		"beforeSortChange": ISortChange;
		"beforeFilterChange": IFilterChange;
		"beforePageChange": IPageChange;
		*/
	}
}