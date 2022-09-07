declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IGridPageChangeEvent extends IGridEvent {
		offset: number;
	}
}