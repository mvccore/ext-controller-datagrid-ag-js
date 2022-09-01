declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IAllowedOperator {
		operator: AgGrids.Enums.Operator;
		multiple: boolean;
		regex: RegExp | null;
	}
}