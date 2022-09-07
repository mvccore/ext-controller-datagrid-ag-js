declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IGridEvent {
		grid: AgGrid;
		eventName: AgGrids.Types.GridEventName;
	}
}