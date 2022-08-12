declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	interface IServerConfig {
		ElementSelector: string;
		Columns: {
			[propName: string]: MvcCore.Ext.Controllers.DataGrids.AgGrids.IServerConfigs.IColumn;
		};
		RenderConfig: MvcCore.Ext.Controllers.DataGrids.AgGrids.IServerConfigs.IRenderConfig;
		UrlSegments: MvcCore.Ext.Controllers.DataGrids.AgGrids.IServerConfigs.IUrlSegment;
		DataUrl?: string;
		RowSelection: Enums.RowSelection;
		ItemsPerPage: number;
	}
}