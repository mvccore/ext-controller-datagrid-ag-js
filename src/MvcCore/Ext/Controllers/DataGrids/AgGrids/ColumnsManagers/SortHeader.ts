namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers {
	export class SortHeader implements agGrid.IHeaderComp {
		public static readonly SELECTORS = {
			CONT_CLS: 'sort-header',
			CONT_ITEMS_CLS_BASE: 'sort-header-items-',
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

		protected params: AgGrids.Interfaces.ISortHeaderParams<any>;
		protected grid: AgGrid;
		protected columnId: string;
		protected sortable: boolean;
		protected sequence: number;
		protected direction: AgGrids.Types.SortDirNullable; // 1 means asc, 0 means desc
		protected elms: AgGrids.Interfaces.ISortHeaderElements;
		protected contBaseClass: string;
		protected handlers: {
			handleContClick?: (e: MouseEvent) => void;
			handleRemoveClick?: (e: MouseEvent) => void;
		};

		public constructor () {
			this.Static = new.target;
		}

		public init (agParams: AgGrids.Interfaces.ISortHeaderParams<any>): void {
			this
				.initParams(agParams)
				.initElements()
				.initEvents();
		}
		public getGui(): HTMLElement {
			return this.elms.cont;
		}

		public SetSequence (sequence: number | null): this {
			this.sequence = sequence;
			if (this.params.renderSequence)
				this.elms.sequence.innerHTML = sequence == null
					? ''
					: Number(this.sequence + 1).toString();
			return this;
		}
		public SetDirection (direction: AgGrids.Types.SortDirNullable): this {
			this.direction = direction;
			if (direction == null) {
				this.setSortInactive();
			} else {
				this.setSortActive();
			}
			return this;
		}

		protected initParams (agParams: AgGrids.Interfaces.ISortHeaderParams<any>): this {
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
				cont = document.createElement('div'),
				innerCode: string[] = [];
			var innerCodes = {
				label:	`<div class="${sels.LABEL_CLS}">${this.params.displayName}</div>`,
				sequence:	`<div class="${sels.ORDER_CLS}"></div>`,
				direction:	`<div class="${sels.DIRECTION_CLS}"></div>`,
				remove:		`<div class="${sels.REMOVE_CLS}"></div>`,
			};
			innerCode = [innerCodes.label];
			if (this.sortable) {
				if (this.params.renderSequence) innerCode.push(innerCodes.sequence);
				if (this.params.renderDirection) innerCode.push(innerCodes.direction);
				if (this.params.renderRemove) innerCode.push(innerCodes.remove);
			}
			var itemsCountClass = sels.CONT_ITEMS_CLS_BASE + innerCode.length;
			cont.className = this.contBaseClass = [sels.CONT_CLS, itemsCountClass].join(' ');
			cont.innerHTML = innerCode.join('');
			this.elms = <AgGrids.Interfaces.ISortHeaderElements>{
				cont: cont,
				label: cont.querySelector<HTMLDivElement>('.'+sels.LABEL_CLS)
			};
			if (this.sortable) {
				if (this.params.renderSequence) 
					this.elms.sequence	= cont.querySelector<HTMLDivElement>('.'+sels.ORDER_CLS);
				if (this.params.renderDirection)
					this.elms.direction	= cont.querySelector<HTMLDivElement>('.'+sels.DIRECTION_CLS);
				if (this.params.renderRemove) 
					this.elms.remove	= cont.querySelector<HTMLDivElement>('.'+sels.REMOVE_CLS);
				this.contBaseClass = [sels.CONT_CLS, sels.SORTABLE_CLS, itemsCountClass].join(' ');
				if (this.direction == null) {
					this.elms.cont.className = this.contBaseClass;
				} else {
					this.elms.cont.className = [this.contBaseClass, sels.ACTIVE_CLS].join(' ');
					if (this.params.renderSequence) 
						this.elms.sequence.innerHTML = Number(this.sequence + 1).toString();
					if (this.params.renderDirection) {
						this.elms.direction.className = [
							sels.DIRECTION_CLS,
							this.direction === 1
								? sels.ASC_CLS
								: sels.DESC_CLS
						].join(' ');
					}
				}
			}
			return this;
		}
		protected initEvents (): this {
			if (!this.sortable) return this;
			this.handlers = {};
			this.elms.cont.addEventListener(
				'click', this.handlers.handleContClick = this.handleContClick.bind(this)
			);
			if (this.params.renderRemove) {
				this.elms.remove.addEventListener(
					'click', this.handlers.handleRemoveClick = this.handleRemoveClick.bind(this), true
				);
			}
			return this;
		}
		public refresh (agParams: AgGrids.Interfaces.ISortHeaderParams<any>): boolean {
			this.destroy();
			this
				.initParams(agParams)
				.initElements()
				.initEvents();
			return true;
		}
		public destroy (): void {
			if (this.handlers.handleContClick)
				this.elms.label.removeEventListener(
					'click', this.handlers.handleContClick
				);
			if (this.params.renderRemove && this.handlers.handleRemoveClick)
				this.elms.remove.removeEventListener(
					'click', this.handlers.handleRemoveClick, true
				);
			if (this.elms.cont.parentNode != null)
				this.elms.cont.parentNode.removeChild(this.elms.cont);
			this.params = null;
			this.grid = null;
			this.sortable = null;
			this.sequence = null;
			this.direction = null;
		}

		protected handleContClick (e: MouseEvent): void {
			if (this.params.renderRemove) {
				this.switchDirectionByTwoStates();
			} else {
				this.switchDirectionByThreeStates();
			}
			this.grid.GetEvents().HandleSortChange(this.columnId, this.direction);
		}
		protected handleRemoveClick (e: MouseEvent): void {
			e.preventDefault();
			e.stopPropagation();
			e.cancelBubble = true;
			this.direction = null;
			this.setSortInactive();
			this.grid.GetEvents().HandleSortChange(
				this.columnId, this.direction
			);
		}
		protected switchDirectionByTwoStates (): this {
			if (this.direction == null || this.direction === 0) {
				this.direction = 1;
			} else if (this.direction === 1) {
				this.direction = 0;
			}
			this.setSortActive();
			return this;
		}
		protected switchDirectionByThreeStates (): this {
			if (this.direction === 0) {
				this.direction = null;
				this.setSortInactive();
			} else {
				if (this.direction === 1) {
					this.direction = 0;
				} else {
					this.direction = 1;
				}
				this.setSortActive();
			}
			return this;
		}
		protected setSortActive (): this {
			this.sequence = 0;
			if (this.params.renderSequence)
				this.elms.sequence.innerHTML = '1';
			var sels = this.Static.SELECTORS;
			this.elms.cont.className = [this.contBaseClass, sels.ACTIVE_CLS].join(' ');
			if (this.params.renderDirection) {
				this.elms.direction.className = [
					sels.DIRECTION_CLS,
					this.direction === 1
						? sels.ASC_CLS
						: sels.DESC_CLS
				].join(' ');
			}
			return this;
		}
		protected setSortInactive (): this {
			this.sequence = null;
			if (this.params.renderSequence)
				this.elms.sequence.innerHTML = '';
			var sels = this.Static.SELECTORS;
			this.elms.cont.className = this.contBaseClass;
			return this;
		}
	}
}