namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
	export class FilterHeader implements agGrid.IFloatingFilterComp<any> {
		public static readonly SELECTORS = {
			CONT_CLS: 'filter-header',
			INPUT_CLS: 'filter-input',
			REMOVE_CLS: 'filter-remove',
			ACTIVE_CLS: 'filter-active',
		};
		public Static: typeof FilterHeader;
		protected params: AgGrids.Interfaces.FilterHeaders.IParams<any>;
		protected grid: AgGrid;
		protected columnId: string;
		protected elms: AgGrids.Interfaces.FilterHeaders.IElements;
		protected activeFilterClsRegExp: RegExp;
		protected activeState: boolean;
		protected handlers: {
			handleSubmit?: (e: MouseEvent) => void;
			handleFocus?: (e: FocusEvent) => void;
			handleBlur?: (e: FocusEvent) => void;
			handleRemove?: (e: MouseEvent) => void;
			handleChange?: (e: Event) => void;
			changeDelayTimeout?: number;
		};
		public constructor () {
			this.Static = new.target;
			this.activeState = false;
		}
		public init (agParams: AgGrids.Interfaces.FilterHeaders.IParams<any>): void {
			this
				.initParams(agParams)
				.initElements()
				.initEvents()
				.SetText(agParams.filteringItem);
		}
		public getGui (): HTMLElement {
			return this.elms.cont;
		}
		public SetText (filteringItem: Map<Enums.Operator, string[]> | null): this {
			var newStateActive = filteringItem != null;
			if (!this.activeState && !newStateActive) return this;
			this.activeState = newStateActive;
			var input = this.elms.input;
			if (filteringItem == null) {
				input.value = '';
				this.setHeaderActive(false);
				return this;
			}
			var textItems: string[] = [],
				prefix: string,
				serverConfig = this.grid.GetServerConfig(),
				valuesDelimiter = serverConfig.urlSegments.urlDelimiterValues,
				filterOperatorPrefixes = serverConfig.filterOperatorPrefixes;
			for (var [operator, filterValues] of filteringItem.entries()) {
				prefix = filterOperatorPrefixes.get(operator);
				for (var filterValue of filterValues)
					textItems.push(prefix + filterValue);
			}
			input.value = textItems.join(valuesDelimiter);
			this.setHeaderActive(input.value !== '');
			return this;
		}
		protected initParams (agParams: AgGrids.Interfaces.FilterHeaders.IParams<any>): this {
			this.params = agParams;
			this.grid = this.params.grid;
			this.columnId = this.params.columnId;
			this.activeFilterClsRegExp = new RegExp(
				'\\s+' + this.Static.SELECTORS.ACTIVE_CLS.replace(/-/g, '\\-') + '\\s+', 
				'g'
			);
			this.grid.GetFilterHeaders().set(this.columnId, this);
			return this;
		}
		protected initElements (): this {
			var sels = this.Static.SELECTORS;
			var cont = document.createElement('div');
			cont.className = sels.CONT_CLS;
			var input = document.createElement('input');
			input.type = 'text';
			input.className = sels.INPUT_CLS;
			var remove = document.createElement('div');
			remove.className = sels.REMOVE_CLS;
			cont.appendChild(input);
			cont.appendChild(remove);
			this.elms = <AgGrids.Interfaces.FilterHeaders.IElements>{
				cont: cont,
				input: input,
				remove: remove
			};
			return this;
		}
		protected initEvents (): this {
			this.handlers = {};
			var input = this.elms.input,
				remove = this.elms.remove;
			if (this.params.submitDelayMs > 0) {
				input.addEventListener(
					'change', this.handlers.handleChange = this.handleChange.bind(this)
				);
			} else {
				input.addEventListener(
					'keyup', this.handlers.handleSubmit = this.handleSubmit.bind(this)
				);
				input.addEventListener(
					'blur', this.handlers.handleBlur = this.handleBlur.bind(this)
				);
			}
			input.addEventListener(
				'focus', this.handlers.handleFocus = this.handleFocus.bind(this)
			);
			remove.addEventListener(
				'click', this.handlers.handleRemove = this.handleRemove.bind(this), true
			);
			return this;
		}
		protected handleSubmit (e: KeyboardEvent): void {
			this.stopEvent(e);
			var value = this.elms.input.value;
			if (e.key === 'Enter') {
				this.grid.GetEvents().HandleFilterHeaderChange(this.columnId, value);
			} else {
				if (value == null || (value.trim() === '')) {
					this.setHeaderActive(false);
				} else {
					this.setHeaderActive(true);
				}
			}
		}
		protected handleBlur (e: KeyboardEvent): void {
			this.stopEvent(e);
			var value = this.elms.input.value.trim();
			if (value === '' || value == null) {
				var filtering = this.grid.GetFiltering();
				if (filtering.has(this.columnId))
					filtering.delete(this.columnId);
			}
		}
		protected handleFocus (e: KeyboardEvent): void {
			this.grid.GetColumnsVisibilityMenu().Hide();
		}
		protected handleRemove (e: KeyboardEvent): void {
			this.stopEvent(e);
			this.elms.input.value = '';
			this.grid.GetEvents().HandleFilterHeaderChange(this.columnId, null);
		}
		protected handleChange (e: Event): void {
			this.stopEvent(e);
			if (this.handlers.changeDelayTimeout)
				clearTimeout(this.handlers.changeDelayTimeout);
			setTimeout(() => {
				this.grid.GetEvents().HandleFilterHeaderChange(this.columnId, this.elms.input.value.trim());
			}, this.params.submitDelayMs);
		}
		protected stopEvent (e: Event): this {
			if (e == null) return this;
			e.preventDefault();
			e.stopPropagation();
			e.cancelBubble = true;
			return this;
		}
		public destroy (): void {
			var input = this.elms.input,
				cont = this.elms.cont;
			if (this.handlers.changeDelayTimeout)
				clearTimeout(this.handlers.changeDelayTimeout);
			if (this.handlers.handleChange)
				this.elms.remove.removeEventListener(
					'click', this.handlers.handleChange
				);
			if (this.handlers.handleSubmit)
				input.removeEventListener(
					'keyup', this.handlers.handleSubmit
				);
			if (this.handlers.handleBlur)
				input.removeEventListener(
					'blur', this.handlers.handleBlur
				);
			if (this.handlers.handleRemove)
				this.elms.remove.removeEventListener(
					'click', this.handlers.handleRemove
				);
			if (cont.parentNode != null)
				cont.parentNode.removeChild(cont);
			this.params = null;
			this.grid = null;
			this.columnId = '';
			this.elms = null;
		}
		public afterGuiAttached(params?: agGrid.IAfterGuiAttachedParams): void {
			this.elms.headerCell = this.elms.cont.parentNode.parentNode as HTMLDivElement;
			if (this.params.filteringItem != null && this.params.filteringItem.size) {
				this.elms.headerCell.className = [
					this.elms.headerCell.className, this.Static.SELECTORS.ACTIVE_CLS
				].join(' ');
			}
		}
		protected setHeaderActive (active: boolean): this {
			var headerCell = this.elms.headerCell;
			if (headerCell == null) return this;
			var headerCellClassName = ' ' + headerCell.className + ' ';
			if (active) {
				if (!headerCellClassName.match(this.activeFilterClsRegExp))
					headerCell.className = headerCell.className + ' ' + this.Static.SELECTORS.ACTIVE_CLS;
			} else {
				headerCell.className = headerCellClassName.replace(this.activeFilterClsRegExp, ' ');
			}
			return this;
		}
		
		public onParentModelChanged (parentModel: any, event: agGrid.FilterChangedEvent<any>): void {
		}
	}
}