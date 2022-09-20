namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
	export class Int extends FilterMenu {
		public static VALUE_TYPE = 'number';
		public Static: typeof Int;
		public init (agParams: Interfaces.FilterMenus.IParams<any>): void {
			super.init(agParams);
		}
		protected changeValueInputType (index: number, currentControlType: Enums.FilterControlType): this {
			var sectionElms = this.elms.sections[index];
			if (this.isControlTypeForCompleteValue(currentControlType)) {
				sectionElms.valueInput.type = this.Static.VALUE_TYPE;
				sectionElms.valueInput.step = '1';
			} else {
				sectionElms.valueInput.type = 'text';
				sectionElms.valueInput.step = null;
			}
			return this;
		}
	}
}