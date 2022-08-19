declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs {
	interface IColumn {
		propName: string;
		headingName: string;
		urlName: string;
		types: string[];
		cssClasses: string[];
		filter: number | boolean;
		sort: number | boolean;
		width: number | string | null;
		maxWidth: number | string | null;
		minWidth: number | string | null;
		flex: number | string | null;
		columnIndex: number | null;
		title: string | null;
		disabled: boolean | null;
	}
}