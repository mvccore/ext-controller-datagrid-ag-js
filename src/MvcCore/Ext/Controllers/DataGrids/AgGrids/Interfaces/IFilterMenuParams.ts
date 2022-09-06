declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IFilterMenuParams<TData = any> extends agGrid.IFilterParams<TData> {
		suppressAndOrCondition: boolean;
		isTouchDevice: boolean;
		grid: AgGrid;
		columnId: string;
		serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn;
		serverType: Enums.ServerType;
		filteringItem: Map<Enums.Operator, string[]>;
		controlTypes: Enums.FilterControlType;
		buttons: Enums.FilterButton;
	}
}