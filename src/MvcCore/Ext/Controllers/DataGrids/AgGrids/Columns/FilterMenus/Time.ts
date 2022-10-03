namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
	export class Time extends DateTime {
		public static VALUE_TYPE = 'time';
		protected initParserAndFormatArgs (): void {
			this.parserArgs = this.serverColumnCfg.parserArgs;
			this.formatArgs = this.serverColumnCfg.formatArgs;
			if (this.parserArgs == null || this.parserArgs.length === 0) 
				this.parserArgs = this.serverConfig.locales.parserArgsDate;
			if (this.formatArgs == null || this.formatArgs.length === 0) 
				this.formatArgs = this.serverConfig.locales.formatArgsDate;
		}
	}
}