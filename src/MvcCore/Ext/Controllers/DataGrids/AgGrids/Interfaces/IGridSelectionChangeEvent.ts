declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IGridSelectionChangeEvent extends IGridEvent {
		selectedRows: any[];
	}
}