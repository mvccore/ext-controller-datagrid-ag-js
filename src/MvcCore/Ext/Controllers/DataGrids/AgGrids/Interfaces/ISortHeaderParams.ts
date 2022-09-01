declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface ISortHeaderParams<TData = any> extends agGrid.IHeaderParams<TData> {
		grid: AgGrid;
		columnId: string;
		sortable: boolean;
		direction?: AgGrids.Types.SortDir;
		sequence?: number;
		renderDirection: boolean;
		renderRemove: boolean;
		renderSequence: boolean;
	}
}