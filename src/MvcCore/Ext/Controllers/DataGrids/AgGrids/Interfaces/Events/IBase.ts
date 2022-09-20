declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.Events {
	interface IBase {
		grid: AgGrid;
		eventName: AgGrids.Types.GridEventName;
	}
}