declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs {
	interface IRenderConfig {
		theme: string;
		renderTableHead: boolean;
		renderTableHeadFiltering: boolean;
		renderTableHeadSorting: boolean;
		renderTableBodyFilteringLinks: boolean;
		tableHeadFilteringTitle?: string;
		renderControlSorting: boolean;
		renderControlPaging: number;
		renderControlPagingPrevAndNext: boolean;
		renderControlPagingFirstAndLast: boolean;
		renderControlCountScales: number;
		renderControlRefresh: number;
		renderControlStatus: number;
		//renderFilterForm: boolean;
		controlPagingNearbyPagesCount: number;
		controlPagingOuterPagesCount: number;
		controlPagingOuterPagesDisplayRatio: number;
		//cssClassesContentTable: string[];
		cssClassesControlsWrapper: string[];
		cssClassesControlSorting: string[];
		cssClassesControlPaging: string[];
		cssClassesControlPagingButton: string[];
		cssClassesControlPagingCurrent: string[];
		cssClassesControlCountScales: string[];
		cssClassesControlCountScalesButton: string[];
		cssClassesControlCountScalesCurrent: string[];
		cssClassesControlRefresh: string[];
		cssClassesControlRefreshButton: string[];
		cssClassesControlStatus: string[];
	}
}