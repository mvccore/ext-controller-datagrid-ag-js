namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class PageChange extends Base {
		protected offsetBefore: number;
		protected offsetAfter: number;
		protected anchor: HTMLAnchorElement | null = null;
		public constructor (offsetBefore: number, offsetAfter: number, anchor: HTMLAnchorElement | null = null) {
			super();
			this.offsetBefore = offsetBefore;
			this.offsetAfter = offsetAfter;
			this.anchor = anchor;
		}
		public SetOffsetBefore (offsetBefore: number): this {
			this.offsetBefore = offsetBefore;
			return this;
		}
		public GetOffsetBefore (): number {
			return this.offsetBefore;
		}
		public SetOffsetAfter (offsetAfter: number): this {
			this.offsetAfter = offsetAfter;
			return this;
		}
		public GetOffsetAfter (): number {
			return this.offsetAfter;
		}
		public SetAnchor (anchor: HTMLAnchorElement | null): this {
			this.anchor = anchor;
			return this;
		}
		public GetAnchor (): HTMLAnchorElement | null {
			return this.anchor;
		}
	}
}