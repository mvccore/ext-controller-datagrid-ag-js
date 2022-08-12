declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.IToolTip {
	interface IParams {
		color?: string;
		rowIndex: number;
		api: {
			getDisplayedRowAtIndex (index: number): agGrid.RowNode | undefined;
		}
	}
}