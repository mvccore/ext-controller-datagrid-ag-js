namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class ColumnsVisibilityChange extends Base {
		protected columnsVisibilityForm: HTMLFormElement;
		public constructor (columnsVisibilityForm: HTMLFormElement) {
			super();
			this.columnsVisibilityForm = columnsVisibilityForm;
		}
		public SetColumnsVisibilityForm (columnsVisibilityForm: HTMLFormElement): this {
			this.columnsVisibilityForm = columnsVisibilityForm;
			return this;
		}
		public GetColumnsVisibilityForm (): HTMLFormElement {
			return this.columnsVisibilityForm;
		}
	}
}