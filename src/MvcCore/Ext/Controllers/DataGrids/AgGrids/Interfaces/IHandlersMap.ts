declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	import Events = AgGrids.EventsManagers.Events;
	interface IHandlersMap {
		"gridReady": Events.Base;

		"beforeSelectionChange": Events.SelectionChange;
		"selectionChange": Events.SelectionChange;
		
		"beforeSortChange": Events.SortChange;
		"sortChange": Events.SortChange;

		"beforePageChange": Events.PageChange;
		"pageChange": Events.PageChange;

		"beforeFilterChange": Events.FilterChange;
		"filterChange": Events.FilterChange;

		"beforeCountScaleChange": Events.CountScaleChange;
		"beforeColumnsVisibilityChange": Events.ColumnsVisibilityChange;

		"beforeHistoryChange": Events.HistoryChange;
		"historyChange": Events.HistoryChange;

	}
}