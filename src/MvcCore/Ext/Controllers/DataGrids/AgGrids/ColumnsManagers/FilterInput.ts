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
		protected multiFilter: boolean;
		protected handlers: {
			handleSubmit?: (e: MouseEvent) => void;
		};
		
		public Static: typeof FilterInput;

		public constructor () {
			this.Static = new.target;
		}

		public init (agParams: AgGrids.Interfaces.IFilterInputParams<any>): void {
			this
				.initParams(agParams)
				.initElements()
				.initEvents();
		}
		public getGui (): HTMLElement {
			return this.input;
		}

		public SetText (): this {
			// todo: set up filter text info input in grid short syntax
			return this;
		}

		protected initParams (agParams: AgGrids.Interfaces.IFilterInputParams<any>): this {
			this.params = agParams;
			this.grid = this.params.grid;
			this.columnId = this.params.columnId;
			this.multiFilter = (
				(this.grid.GetServerConfig().filteringMode & Enums.FilteringMode.FILTER_MULTIPLE_COLUMNS) != 0
			);
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
			return this;
		}
		protected handleSubmit (e: KeyboardEvent): void {
			if(e.key !== 'Enter') return;
			this.grid.GetEvents().HandleInputFilterChange(this.columnId, this.input.value);
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
			this.multiFilter = false;
		}
	}
}