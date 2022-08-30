namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers {
	export class SortHeader implements agGrid.IHeaderComp {
		public static readonly SELECTORS = {
			CONT_CLS: 'sort-header',
			SORTABLE_CLS: 'sortable',
			LABEL_CLS: 'label',
			ORDER_CLS: 'order',
			DIRECTION_CLS: 'direction',
			REMOVE_CLS: 'remove',
			ACTIVE_CLS: 'active',
			ASC_CLS: 'asc',
			DESC_CLS: 'desc',
		};
		public Static: typeof SortHeader;

		protected params: AgGrids.Interfaces.IHeaderParams<any>;
		protected grid: AgGrid;
		protected columnId: string;
		protected sortable: boolean;
		protected sequence: number;
		protected direction: 0 | 1 | null; // 1 means asc, 0 means desc
		protected elms: AgGrids.Interfaces.IHeaderElements;
		protected handlers: {
			handleLabelClick?: (e: MouseEvent) => void;
			handleRemoveClick?: (e: MouseEvent) => void;
		};

		public constructor () {
			this.Static = new.target;
		}

		public init (agParams: AgGrids.Interfaces.IHeaderParams<any>): void {
			this
				.initParams(agParams)
				.initElements()
				.initEvents();
		}
		public getGui(): HTMLElement {
			return this.elms.cont;
		}

		public SetSequence (sequence: number): this {
			this.sequence = sequence;
			this.elms.order.innerHTML = Number(this.sequence + 1).toString();
			return this;
		}

		protected initParams (agParams: AgGrids.Interfaces.IHeaderParams<any>): this {
			this.params = agParams;
			this.grid = this.params.grid;
			this.columnId = this.params.columnId;
			this.sortable = this.params.sortable;
			this.sequence = this.params.sequence;
			this.direction = this.params.direction;
			this.grid.GetSortHeaders().set(this.columnId, this);
			return this;
		}
		protected initElements (): this {
			var sels = this.Static.SELECTORS,
				cont = document.createElement('div');
			cont.className = sels.CONT_CLS;
			var innerCodeItems = [
				`<div class="${sels.LABEL_CLS}">${this.params.displayName}</div>`,
				`<div class="${sels.ORDER_CLS}"></div>`,
				`<div class="${sels.DIRECTION_CLS}"></div>`,
				`<div class="${sels.REMOVE_CLS}"></div>`,
			];
			if (!this.sortable) {
				innerCodeItems = [innerCodeItems[0]];
			}
			cont.innerHTML = innerCodeItems.join('');
			this.elms = <AgGrids.Interfaces.IHeaderElements>{
				cont: cont,
				label: cont.querySelector<HTMLDivElement>('.'+sels.LABEL_CLS)
			};
			if (this.sortable) {
				this.elms.order		= cont.querySelector<HTMLDivElement>('.'+sels.ORDER_CLS);
				this.elms.direction	= cont.querySelector<HTMLDivElement>('.'+sels.DIRECTION_CLS);
				this.elms.remove	= cont.querySelector<HTMLDivElement>('.'+sels.REMOVE_CLS);
				if (this.direction == null) {
					this.elms.cont.className = [sels.CONT_CLS, sels.SORTABLE_CLS].join(' ');
				} else {
					this.elms.cont.className = [sels.CONT_CLS, sels.SORTABLE_CLS, sels.ACTIVE_CLS].join(' ');
					this.elms.order.innerHTML = Number(this.sequence + 1).toString();
					this.elms.direction.className = [
						sels.DIRECTION_CLS,
						this.direction === 1
							? sels.ASC_CLS
							: sels.DESC_CLS
					].join(' ');
				}
			}
			return this;
		}
		protected initEvents (): this {
			if (!this.sortable) return this;
			this.handlers = {};
			this.elms.label.addEventListener(
				'click', this.handlers.handleLabelClick = this.handleLabelClick.bind(this)
			);
			this.elms.remove.addEventListener(
				'click', this.handlers.handleRemoveClick = this.handleRemoveClick.bind(this)
			);
			return this;
		}
		public refresh (agParams: AgGrids.Interfaces.IHeaderParams<any>): boolean {
			this.destroy();
			this
				.initParams(agParams)
				.initElements()
				.initEvents();
			return true;
		}
		public destroy (): void {
			if (this.handlers.handleLabelClick)
				this.elms.label.removeEventListener(
					'click', this.handlers.handleLabelClick
				);
			if (this.handlers.handleRemoveClick)
				this.elms.remove.removeEventListener(
					'click', this.handlers.handleRemoveClick
				);
			if (this.elms.cont.parentNode != null)
				this.elms.cont.parentNode.removeChild(this.elms.cont);
			this.params = null;
			this.grid = null;
			this.sortable = null;
			this.sequence = null;
			this.direction = null;
		}

		protected handleLabelClick (e: MouseEvent): void {
			if (this.direction === 0) {
				this.direction = null;
				this.setSortInactive();
			} else {
				if (this.direction === 1) {
					this.direction = 0;
				} else {
					this.direction = 1;
				}
				this.setSortActive()
			}
			this.grid.GetEvents().HandleSortChange(
				this.columnId, this.direction
			);
		}
		protected handleRemoveClick (e: MouseEvent): void {
			this.direction = null;
			this.setSortInactive();
			this.grid.GetEvents().HandleSortChange(
				this.columnId, this.direction
			);
		}
		protected setSortActive (): this {
			this.sequence = 0;
			this.elms.order.innerHTML = '1';
			var sels = this.Static.SELECTORS;
			this.elms.cont.className = [sels.CONT_CLS, sels.SORTABLE_CLS, sels.ACTIVE_CLS].join(' ');
			this.elms.direction.className = [
				sels.DIRECTION_CLS,
				this.direction === 1
					? sels.ASC_CLS
					: sels.DESC_CLS
			].join(' ');
			return this;
		}
		protected setSortInactive (): this {
			this.sequence = null;
			this.elms.order.innerHTML = '';
			var sels = this.Static.SELECTORS;
			this.elms.cont.className = [sels.CONT_CLS, sels.SORTABLE_CLS].join(' ');
			return this;
		}

		/*
		public onSortChanged() {
			const deactivate = (toDeactivateItems: any) => {
				toDeactivateItems.forEach((toDeactivate: any) => {
					toDeactivate.className = toDeactivate.className.split(' ')[0]
				});
			}
	
			const activate = (toActivate: any) => {
				toActivate.className = toActivate.className + " active";
			}
	
			if (this.params.column.isSortAscending()) {
				deactivate([this.eSortUpButton, this.eSortRemoveButton]);
				activate(this.eSortDownButton)
			} else if (this.params.column.isSortDescending()) {
				deactivate([this.eSortDownButton, this.eSortRemoveButton]);
				activate(this.eSortUpButton)
			} else {
				deactivate([this.eSortUpButton, this.eSortDownButton]);
				activate(this.eSortRemoveButton)
			}
		}
		public onMenuClick() {
			this.params.showColumnMenu(this.eMenuButton);
		}
		public onSortRequested(order: any, event: any) {
			// TODO: tohle tady nebude, ale zavolá se něco v gridu, co nastaví jiný sort, pošle ajax a hotovo
			this.params.setSort(order, event.shiftKey);
		}
		*/
	}
}