namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
	export class Date extends DateTime {
		public static PARSER_ARGS_DEFAULT = [Columns.ViewHelper.PARSER_PATTERN_DATE];
		public static FORMAT_ARGS_DEFAULT = [Columns.ViewHelper.PARSER_PATTERN_DATE];
		public static VALUE_TYPE = 'date';
	}
}