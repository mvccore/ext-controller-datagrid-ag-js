declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IServerConfig {
		elementSelector: string;
		renderConfig: MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs.IRenderConfig;
		columns: {
			[columnUrlName: string]: MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs.IColumn;
		};
		urlSegments: MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs.IUrlSegment;
		ajaxParamsNames: Map<Enums.AjaxParamName, string>;
		id: string;
		clientPageMode: Enums.ClientPageMode;
		dataUrl?: string;
		dataRequestMethod: Enums.AjaxDataRequestMethod;
		rowSelection: Enums.RowSelection;
		itemsPerPage: number;
		page: number;
		clientRowBuffer: number;
		sortingMode: Enums.SortingMode;
		filteringMode: Enums.FilteringMode;
		controlsTexts: Map<Enums.ControlText, string>;
	}
}