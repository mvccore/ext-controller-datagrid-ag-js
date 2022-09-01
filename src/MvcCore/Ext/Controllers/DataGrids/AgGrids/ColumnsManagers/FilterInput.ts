namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers {
	export class FilterInput implements agGrid.IFloatingFilterComp<any> {
		public static readonly SELECTORS = {
			INPUT_CLS: 'filter-input',
		};

		//eGui: HTMLDivElement;
		//currentValue: any;
		//eFilterInput: HTMLInputElement;

		
		protected params: AgGrids.Interfaces.IFilterInputParams<any>;
		protected grid: AgGrid;
		protected columnId: string;
		protected input: HTMLInputElement;
		protected handlers: {
			handleSubmit?: (e: MouseEvent) => void;
			handleBlur?: (e: FocusEvent) => void;
		};
		
		public Static: typeof FilterInput;

		public constructor () {
			this.Static = new.target;
		}

		public init (agParams: AgGrids.Interfaces.IFilterInputParams<any>): void {
			this
				.initParams(agParams)
				.initElements()
				.initEvents()
				.SetText(agParams.filteringItem);
		}
		public getGui (): HTMLElement {
			return this.input;
		}

		public SetText (filteringItem: Map<Enums.Operator, string[]> | null): this {
			if (filteringItem == null) {
				this.input.value = '';
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
			this.input.value = textItems.join(valuesDelimiter);
			return this;
		}

		protected initParams (agParams: AgGrids.Interfaces.IFilterInputParams<any>): this {
			this.params = agParams;
			this.grid = this.params.grid;
			this.columnId = this.params.columnId;
			this.grid.GetFilterInputs().set(this.columnId, this);
			return this;
		}
		protected initElements (): this {
			this.input = document.createElement('input');
			this.input.type = 'text';
			this.input.className = this.Static.SELECTORS.INPUT_CLS;
			return this;
		}
		protected initEvents (): this {
			this.handlers = {};
			this.input.addEventListener(
				'keyup', this.handlers.handleSubmit = this.handleSubmit.bind(this)
			);
			this.input.addEventListener(
				'blur', this.handlers.handleBlur = this.handleBlur.bind(this)
			);
			return this;
		}
		protected handleSubmit (e: KeyboardEvent): void {
			if(e.key !== 'Enter') return;
			e.stopPropagation();
			e.preventDefault();
			e.cancelBubble = true;
			this.grid.GetEvents().HandleInputFilterChange(this.columnId, this.input.value);
		}
		protected handleBlur (e: KeyboardEvent): void {
			e.stopPropagation();
			e.preventDefault();
			e.cancelBubble = true;
			var value = this.input.value.trim();
			if (value === '' || value == null) {
				var filtering = this.grid.GetFiltering();
				if (filtering.has(this.columnId))
					filtering.delete(this.columnId);
			}
		}

		/*protected _tmp (): void {


			this.eGui = document.createElement('div');
			this.eGui.innerHTML = '<input type="text" />';
			this.currentValue = null;
			this.eFilterInput = this.eGui.querySelector('input');
			
	 
			const onInputBoxChanged = () => {
				if (this.eFilterInput.value === '') {
					// clear the filter
					params.parentFilterInstance(instance => {
						instance.onFloatingFilterChanged(null, null);
					});
					return;
				}
	 
				this.currentValue = Number(this.eFilterInput.value);
				params.parentFilterInstance(instance => {
					// TODO: tohle tady nebude, prostě se pošle to co tam je do gridu a provede se AJAX request
					instance.onFloatingFilterChanged('greaterThan', this.currentValue);
				});
			}
	 
			this.eFilterInput.addEventListener('input', onInputBoxChanged);
		}*/
	 
		onParentModelChanged (parentModel: any, event: agGrid.FilterChangedEvent<any>): void {
			debugger;
			// When the filter is empty we will receive a null message her
			/*if (!parentModel) {
				this.eFilterInput.value = '';
				this.currentValue = null;
			} else {
				this.eFilterInput.value = parentModel.filter + '';
				this.currentValue = parentModel.filter;
			}*/
		}

		// Optional methods

		// Gets called every time the popup is shown, after the GUI returned in
		// getGui is attached to the DOM. If the filter popup is closed and re-opened, this method is
		// called each time the filter is shown. This is useful for any logic that requires attachment
		// before executing, such as putting focus on a particular DOM element. 
		afterGuiAttached (params?: agGrid.IAfterGuiAttachedParams): void {
			//debugger;
		}

		/**
		 * Gets called when the floating filter is destroyed. Like column headers,
		 * the floating filter lifespan is only when the column is visible,
		 * so they are destroyed if the column is made not visible or when a user
		 * scrolls the column out of view with horizontal scrolling.
		 */
		public destroy (): void {
			if (this.handlers.handleSubmit)
				this.input.removeEventListener(
					'keyup', this.handlers.handleSubmit
				);
				
			if (this.input.parentNode != null)
				this.input.parentNode.removeChild(this.input);
			this.params = null;
			this.grid = null;
			this.columnId = '';
			this.input = null;
		}
	}
}