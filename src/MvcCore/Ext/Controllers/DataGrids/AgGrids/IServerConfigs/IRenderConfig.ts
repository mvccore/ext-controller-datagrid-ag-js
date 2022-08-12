declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.IServerConfigs {
	interface IRenderConfig {
		controlPagingNearbyPagesCount: number;
		controlPagingOuterPagesCount: number;
		controlPagingOuterPagesDisplayRatio: number;
		cssClassesControlCountScales: string[];
		cssClassesControlPaging: string[];
		cssClassesControlSorting: string[];
		cssClassesControlStatus: string[];
		renderControlCountScales: number;
		renderControlPaging: number;
		renderControlPagingFirstAndLast: boolean;
		renderControlPagingPrevAndNext: boolean;
		renderControlStatus: number;
		renderTableHead: boolean;
		renderTableHeadFiltering: boolean;
		renderTableHeadSorting: boolean;
		theme: string;
	}
}