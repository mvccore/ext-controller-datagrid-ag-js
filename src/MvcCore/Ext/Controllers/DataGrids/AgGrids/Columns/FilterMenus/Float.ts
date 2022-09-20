namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
	export class Float extends FilterMenu {
		public static VALUE_TYPE = 'number';
		public Static: typeof Float;
		protected parserArgs: string[];
		protected formatArgs: string[];
		protected step: string;
		public init (agParams: Interfaces.FilterMenus.IParams<any>): void {
			super.init(agParams);
			this.parserArgs = this.serverColumnCfg.parserArgs;
			this.formatArgs = this.serverColumnCfg.formatArgs;
			var fractionsCount: number = this.formatArgs.length > 0
				? Number(this.formatArgs[0])
				: this.grid.GetServerConfig().locales.floatFractions;
			var stepItems = ['0.'];
			for (var i = 0; i < fractionsCount - 1; i++)
				stepItems.push('0');
			stepItems.push('1');
			this.step = stepItems.join('');
		}
		protected changeValueInputType (index: number, currentControlType: Enums.FilterControlType): this {
			var sectionElms = this.elms.sections[index];
			if (this.isControlTypeForCompleteValue(currentControlType)) {
				sectionElms.valueInput.type = this.Static.VALUE_TYPE;
				if (this.step != null)
					sectionElms.valueInput.step = this.step;
			} else {
				sectionElms.valueInput.type = 'text';
				sectionElms.valueInput.step = null;
			}
			return this;
		}
	}
}