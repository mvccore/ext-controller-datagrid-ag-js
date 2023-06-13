namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
		public Static: typeof MultiplePagesMode;
		protected grid: AgGrid;
		protected countScalesHandlers: Map<number, (e: MouseEvent) => void>;
		protected pagingHandlers: Map<number, (e: MouseEvent) => void>;
		public constructor (grid: AgGrid) {
			super(grid);
		}
		public HandleGridReady (event: agGrid.GridReadyEvent<any>): void {
			this.SelectRowByIndex(0);
			super.HandleGridReady(event);
		}
		public AddCountScalesEvents (): this {
			this.countScalesHandlers = new Map<number, (e: MouseEvent) => void>();
			this.grid.GetOptionsManager().GetElements().countScalesAnchors.forEach(countScaleAnchor => {
				var countInt = parseInt(countScaleAnchor.dataset.count, 10),
					handler = this.handleCountScalesClick.bind(this, countInt) as (e: MouseEvent) => void;
				this.countScalesHandlers.set(countInt, handler);
				countScaleAnchor.addEventListener(
					'click', handler, true
				);
			});
			return this;
		}
		public RemoveCountScalesEvents (): this {
			this.grid.GetOptionsManager().GetElements().countScalesAnchors.forEach(countScaleAnchor => {
				var countInt = parseInt(countScaleAnchor.dataset.count, 10),
					handler = this.countScalesHandlers.get(countInt);
				countScaleAnchor.removeEventListener(
					'click', handler, true
				);
			});
			this.countScalesHandlers = new Map<number, (e: MouseEvent) => void>();
			return this;
		}
		public AddPagingEvents (): this {
			this.pagingHandlers = new Map<number, (e: MouseEvent) => void>();
			this.grid.GetOptionsManager().GetElements().pagingAnchors.forEach(pagingAnchor => {
				var ofsetInt = parseInt(pagingAnchor.dataset.offset, 10),
					handler = this.handlePagingClick.bind(this, ofsetInt) as (e: MouseEvent) => void;
				this.pagingHandlers.set(ofsetInt, handler);
				pagingAnchor.addEventListener(
					'click', handler, true
				);
			});
			return this;
		}
		public RemovePagingEvents (): this {
			this.grid.GetOptionsManager().GetElements().pagingAnchors.forEach(pagingAnchor => {
				var ofsetInt = parseInt(pagingAnchor.dataset.offset, 10),
					handler = this.pagingHandlers.get(ofsetInt);
				pagingAnchor.removeEventListener(
					'click', handler, true
				);
			});
			this.pagingHandlers = new Map<number, (e: MouseEvent) => void>();
			return this;
		}
		protected handleCountScalesClick (countAfter: number, e: MouseEvent): void {
			var continueToBrowserActions = this.FireHandlers("beforeCountScaleChange", new EventsManagers.Events.CountScaleChange(
				this.grid.GetServerConfig().count, countAfter, e.target as HTMLAnchorElement
			));
			if (continueToBrowserActions === false) {
				e.cancelBubble = true;
				e.preventDefault();
				e.stopPropagation();
			}
		}
		protected handlePagingClick (offsetAfter: number, e: MouseEvent): void {
			e.cancelBubble = true;
			e.preventDefault();
			e.stopPropagation();
			var offsetBefore = this.grid.GetOffset();
			var pageChangeEvent = new EventsManagers.Events.PageChange(
				offsetBefore, offsetAfter, e.target as HTMLAnchorElement
			);
			var continueToNextEvent = this.FireHandlers("beforePageChange", pageChangeEvent);
			if (continueToNextEvent === false) 
				return;
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSources.MultiplePagesMode;
			this.grid.SetOffset(offsetAfter);
			dataSource.Load();
			this.FireHandlers("pageChange", pageChangeEvent);
		}
	}
}