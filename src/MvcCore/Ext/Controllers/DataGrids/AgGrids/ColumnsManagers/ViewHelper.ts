namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers {
	export class ViewHelper {
		public Static: typeof ViewHelper;
		
		public static readonly FORMAT_PATTERN_DATE: string 		= 'YYYY-MM-DD';
		public static readonly FORMAT_PATTERN_DATE_TIME: string = 'YYYY-MM-DD HH:mm:ss';
		public static readonly FORMAT_PATTERN_TIME: string 		= 'HH:mm:ss';

		protected static defaults: Map<Enums.ServerType, Types.ViewHelper>;

		protected grid: AgGrid;
		protected serverConfig: Interfaces.IServerConfig;
		protected localeNumeric: string;
		protected localeMoney: string;
		protected localeDateTime: string;
		protected formattersInt: Map<string, Intl.NumberFormat>;
		protected formattersFloat: Map<string, Intl.NumberFormat>;
		protected formattersMoney: Map<string, Intl.NumberFormat>;
		
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.serverConfig = grid.GetServerConfig();
			this.localeNumeric = this.serverConfig.locales.localeNumeric.join(
				AgGrids.Options.SYSTEM_LOCALE_SEPARATOR
			);
			this.localeMoney = this.serverConfig.locales.localeMoney.join(
				AgGrids.Options.SYSTEM_LOCALE_SEPARATOR
			);
			this.localeDateTime = this.serverConfig.locales.localeDateTime.join(
				AgGrids.Options.SYSTEM_LOCALE_SEPARATOR
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
						minimumFractionDigits: this.serverConfig.locales.floatFractions,
						maximumFractionDigits: this.serverConfig.locales.floatFractions
					}
				)]
			]);
			this.formattersMoney = new Map<string, Intl.NumberFormat>([
				['default', new Intl.NumberFormat(
					this.localeMoney,
					<Intl.NumberFormatOptions>{
						style: 'currency',
						currency: this.serverConfig.locales.currencyCode,
						currencySign: 'standard',
						minimumFractionDigits: this.serverConfig.locales.currencyFractions,
						maximumFractionDigits: this.serverConfig.locales.currencyFractions
					}
				)]
			]);
			this.Static.defaults = new Map<Enums.ServerType, Types.ViewHelper>([
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
				try {
					var formatter = eval(serverColumnCfg.viewHelper);
					if (typeof formatter === 'function') viewHelper = formatter;
				} catch (e) {
				}
			}
			if (viewHelper == null) {
				var serverType = serverColumnCfg.types[serverColumnCfg.types.length - 1] as Enums.ServerType;
				if (this.Static.defaults.has(serverType))
					viewHelper = this.Static.defaults.get(serverType);
			}
			if (viewHelper != null) {
				var propName = serverColumnCfg.propName,
					formatArgs: string[] = serverColumnCfg.format;
				agColumnCfg.valueFormatter = (params: agGrid.ValueFormatterParams<any, any>): string => {
					return viewHelper.call(this, params, propName, formatArgs);
				};
			}
			return this;
		}

		protected getIntFormater (formatterKey: string, formatArgs: string[]): Intl.NumberFormat {
			if (this.formattersInt.has(formatterKey))
				return this.formattersInt.get(formatterKey);
			var minimumIntegerDigits = 1;
			if (formatArgs.length > 0)
				minimumIntegerDigits = parseInt(formatArgs[0], 10);
			if (minimumIntegerDigits < 1)
				minimumIntegerDigits = 1;
			this.formattersInt.set(formatterKey, new Intl.NumberFormat(
				this.localeNumeric,
				<Intl.NumberFormatOptions>{
					minimumIntegerDigits: minimumIntegerDigits
				}
			));
			return this.formattersInt.get(formatterKey);
		}
		protected getFloatFormater (formatterKey: string, formatArgs: string[]): Intl.NumberFormat {
			if (this.formattersFloat.has(formatterKey))
				return this.formattersFloat.get(formatterKey);
			var minimumFractionDigits = this.serverConfig.locales.floatFractions,
				maximumFractionDigits = this.serverConfig.locales.floatFractions;
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
			var minimumFractionDigits = this.serverConfig.locales.floatFractions,
				maximumFractionDigits = this.serverConfig.locales.floatFractions;
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
					currency: this.serverConfig.locales.currencyCode,
					currencySign: 'standard',
					minimumFractionDigits: minimumFractionDigits,
					maximumFractionDigits: maximumFractionDigits
				}
			));
			return this.formattersMoney.get(formatterKey);
		}

		protected formatInt (params: agGrid.ValueFormatterParams<any, any>, propName: string, formatArgs: string[]): string {
			var formatterKey = formatArgs == null ? 'default' : formatArgs.join('|');
			return this.getIntFormater(formatterKey, formatArgs).format(params.data[propName]);
		}
		protected formatFloat (params: agGrid.ValueFormatterParams<any, any>, propName: string, formatArgs: string[]): string {
			var formatterKey = formatArgs == null ? 'default' : formatArgs.join('|');
			return this.getFloatFormater(formatterKey, formatArgs).format(params.data[propName]);
		}
		protected formatMoney (params: agGrid.ValueFormatterParams<any, any>, propName: string, formatArgs: string[]): string {
			var formatterKey = formatArgs == null ? 'default' : formatArgs.join('|');
			return this.getMoneyFormater(formatterKey, formatArgs).format(params.data[propName]);
		}
		protected formatDate (params: agGrid.ValueFormatterParams<any, any>, propName: string, formatArgs: string[]): string {
			var dateTime = Date.parse(params.data[propName]) + this.serverConfig.timeZoneOffset;
			if (formatArgs == null || formatArgs.length === 0) formatArgs = [this.Static.FORMAT_PATTERN_DATE];
			return moment(dateTime).format(formatArgs[formatArgs.length - 1]);
		}
		protected formatDateTime (params: agGrid.ValueFormatterParams<any, any>, propName: string, formatArgs: string[]): string {
			var dateTime = Date.parse(params.data[propName]) + this.serverConfig.timeZoneOffset;
			if (formatArgs == null || formatArgs.length === 0) formatArgs = [this.Static.FORMAT_PATTERN_DATE_TIME];
			return moment(dateTime).format(formatArgs[formatArgs.length - 1]);
		}
		protected formatTime (params: agGrid.ValueFormatterParams<any, any>, propName: string, formatArgs: string[]): string {
			var dateTime = Date.parse(params.data[propName]) + this.serverConfig.timeZoneOffset;
			if (formatArgs == null || formatArgs.length === 0) formatArgs = [this.Static.FORMAT_PATTERN_TIME];
			return moment(dateTime).format(formatArgs[formatArgs.length - 1]);
		}
	}
}