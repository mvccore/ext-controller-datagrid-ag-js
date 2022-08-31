declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IFilterInputParams<P = agGrid.InbuiltParentType, TData = any> extends agGrid.IFloatingFilterParams<P, TData> {
		grid: AgGrid;
		columnId: string;
	}
}