namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers.FilterMenus {
	export class DateTime extends FilterMenu {
		public static PARSER_ARGS_DEFAULT = [ColumnsManagers.ViewHelper.PARSER_PATTERN_DATE_TIME];
		public static FORMAT_ARGS_DEFAULT = [ColumnsManagers.ViewHelper.PARSER_PATTERN_DATE_TIME];
		public static VALUE_TYPE = 'datetime-local';
		public Static: typeof DateTime;
		protected timeZoneOffset: number;
		protected parserArgs: string[];
		protected formatArgs: string[];
		public init (agParams: Interfaces.IFilterMenuParams<any>): void {
			super.init(agParams);
			this.timeZoneOffset = this.grid.GetServerConfig().timeZoneOffset;
			this.parserArgs = this.serverColumnCfg.parserArgs;
			this.formatArgs = this.serverColumnCfg.formatArgs;
			if (this.parserArgs == null || this.parserArgs.length === 0) 
				this.parserArgs = this.Static.PARSER_ARGS_DEFAULT;
			if (this.formatArgs == null || this.formatArgs.length === 0) 
				this.formatArgs = this.Static.FORMAT_ARGS_DEFAULT;
		}
		protected changeValueInputType (index: number, currentControlType: Enums.FilterControlType): this {
			var sectionElms = this.elms.sections[index];
			if (this.isControlTypeForCompleteValue(currentControlType)) {
				sectionElms.valueInput.type = this.Static.VALUE_TYPE;
			} else {
				sectionElms.valueInput.type = 'text';
			}
			return this;
		}
		protected setValueInput (valueInput: HTMLInputElement, value: string, currentControlType: Enums.FilterControlType): this {
			if (
				this.timeZoneOffset !== 0 && 
				this.valueIsValid(value) && 
				(
					this.isControlTypeForCompleteValue(currentControlType) || 
					(currentControlType & Enums.FilterControlType.STARTS_WITH) != 0 ||
					(currentControlType & Enums.FilterControlType.NOT_STARTS_WITH) != 0
				)
			) {
				var dateTime = moment(value, this.parserArgs[this.parserArgs.length - 1]);
				dateTime.add(this.timeZoneOffset, 's');
				value = dateTime.format(this.formatArgs[0]);
			}
			valueInput.value = value;
			return this;
		}
		protected getValueInput (valueInput: HTMLInputElement, currentControlType: Enums.FilterControlType): string {
			var value = valueInput.value;
			if (
				this.timeZoneOffset !== 0 && 
				this.valueIsValid(value) && 
				this.isControlTypeForCompleteValue(currentControlType)
			) {
				if (valueInput.type != 'text')
					value = value.replace(/T|Z/g, ' ');
				var dateTime = moment(value, this.parserArgs[this.parserArgs.length - 1]);
				dateTime.add(-(this.timeZoneOffset), 's');
				value = dateTime.format(this.formatArgs[0]);
			}
			return value;
		}
		protected valueIsValid (value: string): boolean {
			return value !== '' && value != null;
		}
	}
}