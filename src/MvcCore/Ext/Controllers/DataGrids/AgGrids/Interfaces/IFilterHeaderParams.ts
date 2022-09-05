declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IFilterHeaderParams<P = agGrid.InbuiltParentType, TData = any> extends agGrid.IFloatingFilterParams<P, TData> {
		grid: AgGrid;
		columnId: string;
		filteringItem: Map<Enums.Operator, string[]>;
	}
}