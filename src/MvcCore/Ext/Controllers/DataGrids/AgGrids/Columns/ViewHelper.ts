namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
	export class ViewHelper {
		public static BOOL_FALSE_VALUES = new Set<any>([
			'0', 0, false, 'false', 'False', 'FALSE', 'n', 'N', 'no', 'No', 'NO'
		])
		public Static: typeof ViewHelper;
		
		protected static defaults: Map<Enums.ServerType, Types.ViewHelper>;

		protected grid: AgGrid;
		protected serverConfig: Interfaces.IServerConfig;
		protected localesConfig: Interfaces.IServerConfigs.ILocales;
		protected localeNumeric: string;
		protected localeMoney: string;
		protected localeDateTime: string;
		protected formattersInt: Map<string, Intl.NumberFormat>;
		protected formattersFloat: Map<string, Intl.NumberFormat>;
		protected formattersMoney: Map<string, Intl.NumberFormat>;
		protected translator: Tools.Translator;
		
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.translator = grid.GetTranslator();
			this.serverConfig = grid.GetServerConfig();
			this.localesConfig = this.serverConfig.locales;
			this.localeNumeric = this.localesConfig.localeNumeric.join(
				AgGrids.Options.Manager.SYSTEM_LOCALE_SEPARATOR
			);
			this.localeMoney = this.localesConfig.localeMoney.join(
				AgGrids.Options.Manager.SYSTEM_LOCALE_SEPARATOR
			);
			this.localeDateTime = this.localesConfig.localeDateTime.join(
				AgGrids.Options.Manager.SYSTEM_LOCALE_SEPARATOR
			);
			this.formattersInt = new Map<string, Intl.NumberFormat>([
				['default', new Intl.NumberFormat(
					this.localeNumeric,
					<Intl.NumberFormatOptions>{
						minimumIntegerDigits: 1
					}
				)]
			]);
			this.formattersFloat = new Map<string, Intl.NumberFormat>([
				['default', new Intl.NumberFormat(
					this.localeNumeric,
					<Intl.NumberFormatOptions>{
						minimumFractionDigits: this.localesConfig.floatFractions,
						maximumFractionDigits: this.localesConfig.floatFractions
					}
				)]
			]);
			this.formattersMoney = new Map<string, Intl.NumberFormat>([
				['default', new Intl.NumberFormat(
					this.localeMoney,
					<Intl.NumberFormatOptions>{
						style: 'currency',
						currency: this.localesConfig.currencyCode,
						currencySign: 'standard',
						minimumFractionDigits: this.localesConfig.currencyFractions,
						maximumFractionDigits: this.localesConfig.currencyFractions
					}
				)]
			]);
			this.Static.defaults = new Map<Enums.ServerType, Types.ViewHelper>([
				[Enums.ServerType.BOOL,			this.formatBool],
				[Enums.ServerType.INT,			this.formatInt],
				[Enums.ServerType.FLOAT,		this.formatFloat],
				[Enums.ServerType.MONEY,		this.formatMoney],
				[Enums.ServerType.DATE,			this.formatDate],
				[Enums.ServerType.DATE_TIME,	this.formatDateTime],
				[Enums.ServerType.TIME,			this.formatTime],
			]);
		}

		public SetUpColumnCfg (agColumnCfg: agGrid.ColDef, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): this {
			var viewHelper: Types.ViewHelper = null;
			if (serverColumnCfg.viewHelper != null) {
				var allViewHelpers = this.grid.GetViewHelpers(),
					viewHelperName: string = serverColumnCfg.viewHelper;
				if (allViewHelpers.has(viewHelperName))
					viewHelper = allViewHelpers.get(viewHelperName);
			}
			if (viewHelper == null) {
				var serverType = serverColumnCfg.types[serverColumnCfg.types.length - 1] as Enums.ServerType;
				if (this.Static.defaults.has(serverType))
					viewHelper = this.Static.defaults.get(serverType);
			}
			if (viewHelper != null) {
				var propName = serverColumnCfg.propName,
					parserArgs: string[] = serverColumnCfg.parserArgs,
					formatArgs: string[] = serverColumnCfg.formatArgs;
				agColumnCfg.valueFormatter = (params: agGrid.ValueFormatterParams<any, any>): string => {
					if (params.data == null || params.data[propName] == null) return '';
					return viewHelper.call(this, params, propName, parserArgs, formatArgs);
				};
			}
			return this;
		}

		protected getIntFormater (formatterKey: string, formatArgs: string[]): Intl.NumberFormat {
			if (this.formattersInt.has(formatterKey))
				return this.formattersInt.get(formatterKey);
			var minimumIntegerDigits = 1,
				useGrouping = true;
			if (formatArgs.length > 0)
				minimumIntegerDigits = parseInt(formatArgs[0], 10);
			if (minimumIntegerDigits < 1)
				minimumIntegerDigits = 1;
			if (formatArgs.length > 1)
				useGrouping = !!formatArgs[1];
			this.formattersInt.set(formatterKey, new Intl.NumberFormat(
				this.localeNumeric,
				<Intl.NumberFormatOptions>{
					minimumIntegerDigits: minimumIntegerDigits,
					useGrouping: useGrouping
				}
			));
			return this.formattersInt.get(formatterKey);
		}
		protected getFloatFormater (formatterKey: string, formatArgs: string[]): Intl.NumberFormat {
			if (this.formattersFloat.has(formatterKey))
				return this.formattersFloat.get(formatterKey);
			var minimumFractionDigits = this.localesConfig.floatFractions,
				maximumFractionDigits = this.localesConfig.floatFractions;
			if (formatArgs.length > 0) {
				minimumFractionDigits = parseInt(formatArgs[0], 10);
				if (formatArgs.length > 1) 
					maximumFractionDigits = parseInt(formatArgs[1], 10);
			}
			if (maximumFractionDigits < minimumFractionDigits)
				maximumFractionDigits = minimumFractionDigits;
			this.formattersFloat.set(formatterKey, new Intl.NumberFormat(
				this.localeNumeric,
				<Intl.NumberFormatOptions>{
					minimumFractionDigits: minimumFractionDigits,
					maximumFractionDigits: maximumFractionDigits
				}
			));
			return this.formattersFloat.get(formatterKey);
		}
		protected getMoneyFormater (formatterKey: string, formatArgs: string[]): Intl.NumberFormat {
			if (this.formattersMoney.has(formatterKey))
				return this.formattersMoney.get(formatterKey);
			var minimumFractionDigits = this.localesConfig.floatFractions,
				maximumFractionDigits = this.localesConfig.floatFractions;
			if (formatArgs.length > 0) {
				minimumFractionDigits = parseInt(formatArgs[0], 10);
				if (formatArgs.length > 1) 
					maximumFractionDigits = parseInt(formatArgs[1], 10);
			}
			if (maximumFractionDigits < minimumFractionDigits)
				maximumFractionDigits = minimumFractionDigits;
			this.formattersMoney.set(formatterKey, new Intl.NumberFormat(
				this.localeMoney,
				<Intl.NumberFormatOptions>{
					style: 'currency',
					currency: this.localesConfig.currencyCode,
					currencySign: 'standard',
					minimumFractionDigits: minimumFractionDigits,
					maximumFractionDigits: maximumFractionDigits
				}
			));
			return this.formattersMoney.get(formatterKey);
		}

		protected formatBool (params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[], formatArgs: string[]): string {
			var boolFalse = this.Static.BOOL_FALSE_VALUES.has(params.data[propName]);
			return this.translator.Translate(boolFalse ? 'no' : 'yes');
		}
		protected formatInt (params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[], formatArgs: string[]): string {
			var formatterKey = formatArgs == null ? 'default' : formatArgs.join('|');
			return this.getIntFormater(formatterKey, formatArgs).format(params.data[propName]);
		}
		protected formatFloat (params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[], formatArgs: string[]): string {
			var formatterKey = formatArgs == null ? 'default' : formatArgs.join('|');
			return this.getFloatFormater(formatterKey, formatArgs).format(params.data[propName]);
		}
		protected formatMoney (params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[], formatArgs: string[]): string {
			var formatterKey = formatArgs == null ? 'default' : formatArgs.join('|');
			return this.getMoneyFormater(formatterKey, formatArgs).format(params.data[propName]);
		}
		protected formatDate (params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[], formatArgs: string[]): string {
			if (parserArgs == null || parserArgs.length === 0) parserArgs = this.localesConfig.parserArgsDate;
			var dateTime = moment(params.data[propName], parserArgs[parserArgs.length - 1]);
			dateTime.add(this.serverConfig.timeZoneOffset, 's');
			if (formatArgs == null || formatArgs.length === 0) formatArgs = this.localesConfig.formatArgsDate;
			return dateTime.format(formatArgs[0]);
		}
		protected formatDateTime (params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[], formatArgs: string[]): string {
			if (parserArgs == null || parserArgs.length === 0) parserArgs = this.localesConfig.parserArgsDateTime;
			var dateTime = moment(params.data[propName], parserArgs[parserArgs.length - 1]);
			dateTime.add(this.serverConfig.timeZoneOffset, 's');
			if (formatArgs == null || formatArgs.length === 0) formatArgs = this.localesConfig.formatArgsDateTime;
			return dateTime.format(formatArgs[0]);
		}
		protected formatTime (params: agGrid.ValueFormatterParams<any, any>, propName: string, parserArgs: string[], formatArgs: string[]): string {
			if (parserArgs == null || parserArgs.length === 0) parserArgs = this.localesConfig.parserArgsTime;
			var dateTime = moment(params.data[propName], parserArgs[parserArgs.length - 1]);
			dateTime.add(this.serverConfig.timeZoneOffset, 's');
			if (formatArgs == null || formatArgs.length === 0) formatArgs = this.localesConfig.formatArgsTime;
			return dateTime.format(formatArgs[0]);
		}
	}
}