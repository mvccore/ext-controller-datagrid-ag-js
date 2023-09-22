namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
	export class DateTime extends FilterMenu {
		public static VALUE_TYPE = 'datetime-local';
		public Static: typeof DateTime;
		protected timeZoneOffset: number;
		protected parserArgs: string[] | null;
		protected formatArgs: string[] | null;
		protected serverConfig: Interfaces.IServerConfig;
		public init (agParams: Interfaces.FilterMenus.IParams<any>): void {
			super.init(agParams);
			this.serverConfig = this.grid.GetServerConfig();
			this.timeZoneOffset = this.serverConfig.timeZoneOffset;
			this.initParserAndFormatArgs();
		}
		protected initParserAndFormatArgs (): void {
			this.parserArgs = this.serverColumnCfg.parserArgs;
			this.formatArgs = this.serverColumnCfg.formatArgs;
			if (this.parserArgs == null || this.parserArgs?.length === 0) 
				this.parserArgs = this.serverConfig.locales.parserArgsDateTime;
			if (this.formatArgs == null || this.formatArgs?.length === 0) 
				this.formatArgs = this.serverConfig.locales.formatArgsDateTime;
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
				value = dateTime.format(this.formatArgs[0] ?? null);
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
				value = dateTime.format(this.formatArgs[0] ?? null);
			}
			return value;
		}
		protected valueIsValid (value: string): boolean {
			return value !== '' && value != null;
		}
	}
}