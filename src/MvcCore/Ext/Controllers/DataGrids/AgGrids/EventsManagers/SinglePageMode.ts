namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
		public Static: typeof SinglePageMode;
		protected grid: AgGrid;
		protected refreshOffsets: number[] = [];
		public constructor (grid: AgGrid) {
			super(grid);
		}
		public HandleBodyScroll (event: agGrid.BodyScrollEvent<any>): void {
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSources.SinglePageMode;
			if (event.direction === 'vertical')
				dataSource.SetBodyScrolled(event.top > 0);
			super.HandleBodyScroll(event);
		}
		public HandleResponseLoaded (response: AgGrids.Interfaces.Ajax.IResponse, selectFirstRow: boolean = false): void {
			super.HandleResponseLoaded(response, selectFirstRow);
			if (this.refreshOffsets.length > 0) {
				var offsetIndex = this.refreshOffsets.indexOf(response.offset);
				if (offsetIndex !== -1)
					this.refreshOffsets.splice(offsetIndex, 1);
				if (this.refreshOffsets.length === 0)
					this.handleRefreshResponse();
			}
		}
		protected handleRefreshClick (refreshAnchor: HTMLAnchorElement, loadingCls: string, e: MouseEvent): boolean {
			var exec = super.handleRefreshClick(refreshAnchor, loadingCls, e);
			if (!exec) return false;
			var api = this.grid.GetOptionsManager().GetAgOptions().api,
				limit = this.grid.GetLimit(),
				firstRowIndex = api.getFirstDisplayedRow(), 
				lastRowIndex = api.getLastDisplayedRow(),
				start = Math.floor(firstRowIndex / limit) * limit,
				end = Math.ceil(lastRowIndex / limit) * limit;
			for (var i = start, l = end; i < l; i += limit)
				this.refreshOffsets.push(i);
			this.grid.GetOptionsManager().GetAgOptions().api.purgeInfiniteCache();
			return true;
		}
	}
}