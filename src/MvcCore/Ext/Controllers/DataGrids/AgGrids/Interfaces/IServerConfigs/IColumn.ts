declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs {
	interface IColumn {
		propName: string;
		headingName: string;
		urlName: string;
		types: string[];
		cssClasses: string[];
		filter: number | boolean;
		sort: number | boolean;
		maxWidth: number | string | null;
		minWidth: number | string | null;
		width: number | string | null;
		columnIndex: number | null;
		title: string | null;
		disabled: boolean | null;
	}
}