namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
	export class SelectionChange extends Base {
		protected userChange: boolean;
		protected selectedRowNodesBefore: agGrid.RowNode<any>[];
		protected selectedRowNodesAfter: agGrid.RowNode<any>[];
		public constructor (userChange: boolean, selectedRowNodesBefore: agGrid.RowNode<any>[], selectedRowNodesAfter: agGrid.RowNode<any>[]) {
			super();
			this.userChange = userChange;
			this.selectedRowNodesBefore = selectedRowNodesBefore;
			this.selectedRowNodesAfter = selectedRowNodesAfter;
		}
		public SetUserChange (userChange: boolean): this {
			this.userChange = userChange;
			return this;
		}
		public GetUserChange (): boolean {
			return this.userChange;
		}
		public SetSelectedRowNodesBefore (selectedRowNodesBefore: agGrid.RowNode<any>[]): this {
			this.selectedRowNodesBefore = selectedRowNodesBefore;
			return this;
		}
		public GetSelectedRowNodesBefore (): agGrid.RowNode<any>[] {
			return this.selectedRowNodesBefore;
		}
		public SetSelectedRowNodesAfter (selectedRowNodesAfter: agGrid.RowNode<any>[]): this {
			this.selectedRowNodesAfter = selectedRowNodesAfter;
			return this;
		}
		public GetSelectedRowNodesAfter (): agGrid.RowNode<any>[] {
			return this.selectedRowNodesAfter;
		}
	}
}