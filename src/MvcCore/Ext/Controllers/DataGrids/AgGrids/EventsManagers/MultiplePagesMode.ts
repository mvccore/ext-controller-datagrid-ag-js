namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
		public Static: typeof MultiplePagesMode;
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			super(grid);
		}
		public AddPagingEvents (): this {
			this.grid.GetOptions().GetElements().pagingAnchors.forEach(pagingAnchor => {
				var ofsetInt = parseInt(pagingAnchor.dataset.offset, 10);
				pagingAnchor.addEventListener(
					'click', this.handlePagingClick.bind(this, ofsetInt), true
				);
			});
			return this;
		}
		public RemovePagingEvents (): this {
			this.grid.GetOptions().GetElements().pagingAnchors.forEach(pagingAnchor => {
				var ofsetInt = parseInt(pagingAnchor.dataset.offset, 10);
				pagingAnchor.removeEventListener(
					'click', this.handlePagingClick.bind(this, ofsetInt), true
				);
			});
			return this;
		}
		protected handlePagingClick (offset: number, e: MouseEvent): void {
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSources.MultiplePagesMode;
			this.grid.SetOffset(offset)
			dataSource.Load();
			e.cancelBubble = true;
			e.preventDefault();
		}
	}
}