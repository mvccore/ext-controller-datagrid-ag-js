declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IServerConfig {
		contElementSelector: string;
		renderConfig: MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs.IRenderConfig;
		columns: {
			[columnUrlName: string]: MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs.IColumn;
		};
		locales: MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs.ILocales;
		urlSegments: MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs.IUrlSegment;
		filterOperatorPrefixes: Map<Enums.Operator, string>;
		ajaxParamsNames: Map<Enums.AjaxParamName, string>;
		id: string;
		clientPageMode: Enums.ClientPageMode;
		dataUrl?: string;
		dataRequestMethod: Enums.AjaxDataRequestMethod;
		rowSelection: Enums.RowSelection;
		itemsPerPage: number;
		page: number;
		count: number;
		sortingMode: Enums.SortingMode;
		filteringMode: Enums.FilteringMode;
		controlsTexts: Map<Enums.ControlText, string>;
		timeZoneOffset: number;
		clientRowBuffer: number;
		clientMaxRowsInCache: number;
		clientRowBufferMax: number;
	}
}