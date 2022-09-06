namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers.FilterMenus {
	export class Date extends DateTime {
		public static PARSER_ARGS_DEFAULT = [ColumnsManagers.ViewHelper.PARSER_PATTERN_DATE];
		public static FORMAT_ARGS_DEFAULT = [ColumnsManagers.ViewHelper.PARSER_PATTERN_DATE];
		public static VALUE_TYPE = 'date';
	}
}