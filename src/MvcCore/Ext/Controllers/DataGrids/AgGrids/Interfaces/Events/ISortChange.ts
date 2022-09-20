declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.Events {
	interface ISortChange extends IBase {
		sorting: AgGrids.Types.SortItem[];
	}
}