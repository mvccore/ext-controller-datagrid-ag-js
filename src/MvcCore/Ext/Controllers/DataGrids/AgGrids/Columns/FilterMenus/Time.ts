namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
	export class Time extends DateTime {
		public static PARSER_ARGS_DEFAULT = [Columns.ViewHelper.PARSER_PATTERN_TIME];
		public static FORMAT_ARGS_DEFAULT = [Columns.ViewHelper.PARSER_PATTERN_TIME];
		public static VALUE_TYPE = 'time';
	}
}