declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface ITooltipParams {
		color?: string;
		rowIndex: number;
		api: {
			getDisplayedRowAtIndex (index: number): agGrid.RowNode | undefined;
		}
	}
}