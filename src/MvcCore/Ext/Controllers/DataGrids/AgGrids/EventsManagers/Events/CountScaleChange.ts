namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class CountScaleChange extends Base {
		protected countBefore: number;
		protected countAfter: number;
		protected anchor: HTMLAnchorElement;
		public constructor (countBefore: number, countAfter: number, anchor: HTMLAnchorElement) {
			super();
			this.countBefore = countBefore;
			this.countAfter = countAfter;
			this.anchor = anchor;
		}
		public SetCountBefore (countBefore: number): this {
			this.countBefore = countBefore;
			return this;
		}
		public GetCountBefore (): number {
			return this.countBefore;
		}
		public SetCountAfter (countAfter: number): this {
			this.countAfter = countAfter;
			return this;
		}
		public GetCountAfter (): number {
			return this.countAfter;
		}
		public SetAnchor (anchor: HTMLAnchorElement): this {
			this.anchor = anchor;
			return this;
		}
		public GetAnchor (): HTMLAnchorElement {
			return this.anchor;
		}
	}
}