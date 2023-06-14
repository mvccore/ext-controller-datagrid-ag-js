namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class ModelUpdate extends Base {
		protected newData: boolean;
		protected newPage: boolean;
		protected animate: boolean;
		protected keepRenderedRows: boolean;
		protected keepUndoRedoStack: boolean | null;
		protected agEvent: agGrid.ModelUpdatedEvent<any>;
		public constructor (
			newData: boolean, 
			newPage: boolean, 
			animate: boolean, 
			keepRenderedRows: boolean, 
			keepUndoRedoStack: boolean | null, 
			agEvent: agGrid.ModelUpdatedEvent<any>
		) {
			super();
			this.newData = newData;
			this.newPage = newPage;
			this.animate = animate;
			this.keepRenderedRows = keepRenderedRows;
			this.keepUndoRedoStack = keepUndoRedoStack;
			this.agEvent = agEvent;
		}
		public GetNewData(): boolean {
			return this.newData;
		}
		public GetNewPage (): boolean {
			return this.newPage;
		}
		public GetAnimate (): boolean {
			return this.animate;
		}
		public GetKeepRenderedRows (): boolean {
			return this.keepRenderedRows;
		}
		public GetKeepUndoRedoStack (): boolean | null {
			return this.keepUndoRedoStack;
		}
		public SetNewData (newData: boolean): this {
			this.newData = newData;
			return this;
		}
		public SetNewPage (newPage: boolean): this {
			this.newPage = newPage;
			return this;
		}
		public SetAnimate (animate: boolean): this {
			this.animate = animate;
			return this;
		}
		public SetKeepRenderedRows (keepRenderedRows: boolean): this {
			this.keepRenderedRows = keepRenderedRows;
			return this;
		}
		public SetKeepUndoRedoStack (keepUndoRedoStack: boolean | null): this {
			this.keepUndoRedoStack = keepUndoRedoStack;
			return this;
		}
		public GetAgEvent (): agGrid.ModelUpdatedEvent<any> {
			return this.agEvent;
		}
	}
}