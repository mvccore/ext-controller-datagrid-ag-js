namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
		public Static: typeof MultiplePagesMode;
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			super(grid);
		}
		public HandleGridReady (event: agGrid.GridReadyEvent<any>): void {
			this.SelectRowByIndex(0);
			super.HandleGridReady(event);
		}
		public AddPagingEvents (): this {
			this.grid.GetOptionsManager().GetElements().pagingAnchors.forEach(pagingAnchor => {
				var ofsetInt = parseInt(pagingAnchor.dataset.offset, 10);
				pagingAnchor.addEventListener(
					'click', this.handlePagingClick.bind(this, ofsetInt), true
				);
			});
			return this;
		}
		public RemovePagingEvents (): this {
			this.grid.GetOptionsManager().GetElements().pagingAnchors.forEach(pagingAnchor => {
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
			e.stopPropagation();
			this.FireHandlers("pageChange", <Interfaces.Events.IPageChange>{
				offset: offset
			});
		}
	}
}