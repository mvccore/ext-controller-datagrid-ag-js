namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers {
	export class FilterMenu implements agGrid.IFilterComp<any> {
		public static readonly SELECTORS = {
			CONT_CLS: 'filter-menu',
			SECTIONS_CLS: 'filter-sections',
			SECTION_CLS: 'filter-section',
			TYPE_CLS: 'filter-type',
			INPUT_CLS: 'filter-input',
			INPUT_HIDDEN_CLS: 'filter-input-hidden',
			BTN_ADD_CLS: 'filter-add-btn',
			BTN_ADD_HIDDEN_CLS: 'filter-add-btn-hidden',
			BTNS_CLS: 'filter-buttons',
			BTN_APPLY_CLS: 'filter-button filter-button-apply',
			BTN_CLEAR_CLS: 'filter-button filter-button-clear',
			BTN_CANCEL_CLS: 'filter-button filter-button-storno',
		};
		public Static: typeof FilterMenu;
		protected params: Interfaces.IFilterMenuParams<any>;
		protected grid: AgGrid;
		protected translator: Translator;
		protected columnId: string;
		protected serverColumnCfg: Interfaces.IServerConfigs.IColumn;
		protected serverType: Enums.ServerType;
		protected controlTypes: Enums.FilterControlType;
		protected buttons: Enums.FilterButton;
		protected elms: Interfaces.IFilterMenuElements;
		protected filteringStr: string;
		protected latestFiltering: Map<Enums.Operator, string[]> | null;
		protected handlers: {
			handleApply?: (e?: MouseEvent) => void;
			handleClear?: (e: MouseEvent) => void;
			handleCancel?: (e: MouseEvent) => void;
		};
		protected sectionHandlers: Interfaces.IFilterMenuSectionEvents[];
		protected hideMenuCallback: () => void;

		public constructor () {
			this.Static = new.target;
			this.sectionHandlers = [];
		}

		public init (agParams: Interfaces.IFilterMenuParams<any>): void {
			this
				.initParams(agParams)
				.initElements()
				.initEvents()
		}
		public getGui (): HTMLElement {
			return this.elms.cont;
		}
		/**
		 * Gets called every time the popup is shown, after the GUI returned in
		 * getGui is attached to the DOM. If the filter popup is closed and re-opened, this method is
		 * called each time the filter is shown. This is useful for any logic that requires attachment
		 * before executing, such as putting focus on a particular DOM element. The params has a
		 * callback method 'hidePopup', which you can call at any later point to hide the popup - good
		 * if you have an 'Apply' button and you want to hide the popup after it is pressed.
		 */
		public afterGuiAttached (params?: agGrid.IAfterGuiAttachedParams): void {
			this.hideMenuCallback = params.hidePopup;
			var filtering = this.grid.GetFiltering();
			this.latestFiltering = filtering.has(this.columnId)
				? filtering.get(this.columnId)
				: null;
			this.SetUpControls(this.latestFiltering);
		}
		/**
		 * Gets called when the column is destroyed. If your custom filter needs to do
		 * any resource cleaning up, do it here. A filter is NOT destroyed when it is
		 * made 'not visible', as the GUI is kept to be shown again if the user selects
		 * that filter again. The filter is destroyed when the column it is associated with is
		 * destroyed, either when new columns are set into the grid, or the grid itself is destroyed.
		 */
		 public destroy (): void {
			this.destroySections();
			// remove events
			if (this.handlers.handleApply)
				this.elms.btnApply.removeEventListener(
					'click', this.handlers.handleApply
				);
			if (this.handlers.handleClear)
				this.elms.btnClear.removeEventListener(
					'click', this.handlers.handleClear
				);
			if (this.handlers.handleCancel)
				this.elms.btnCancel.removeEventListener(
					'click', this.handlers.handleCancel
				);
			this.handlers = {};
			// remove dom
			var contParent = this.elms.cont.parentNode;
			if (contParent != null)
				contParent.removeChild(this.elms.cont);
			this.elms = null;
			// local props
			this.grid = null;
			this.translator = null;
			this.columnId = null;
			this.serverColumnCfg = null;
			this.serverType = null;
			this.controlTypes = null;
			this.buttons = null;
			this.filteringStr = null;
			this.latestFiltering = null;
			this.sectionHandlers = [];
			this.hideMenuCallback = null;
		}
		public SetUpControls (filteringItem: Map<Enums.Operator, string[]> | null): this {
			var filteringStr = filteringItem == null ? '' : JSON.stringify(AgGrids.Helpers.ConvertMap2Object(filteringItem));
			if (filteringStr === this.filteringStr) return this;
			this.filteringStr = filteringStr;
			this
				.destroySections()
				.createSections(filteringItem);
			return this;
		}

		protected initParams (agParams: AgGrids.Interfaces.IFilterMenuParams<any>): this {
			this.params = agParams;
			this.grid = this.params.grid;
			this.translator = this.grid.GetTranslator();
			this.columnId = this.params.columnId;
			this.serverColumnCfg = this.params.serverColumnCfg;
			this.serverType = this.params.serverType;
			this.controlTypes = this.params.controlTypes;
			this.buttons = this.params.buttons;
			this.grid.GetFilterMenus().set(this.columnId, this);
			return this;
		}

		protected initElements (): this {
			var sels = this.Static.SELECTORS;
			var cont = document.createElement('div');
			cont.className = sels.CONT_CLS;

			var sectionsCont = document.createElement('div');
			sectionsCont.className = sels.SECTIONS_CLS;
			sectionsCont = cont.appendChild(sectionsCont);

			var buttonsCont = null, btnApply = null, btnClear = null, btnCancel = null;
			if (this.buttons !== Enums.FilterButton.NONE) {
				buttonsCont = document.createElement('div');
				buttonsCont.className = sels.BTNS_CLS;
				buttonsCont = cont.appendChild(buttonsCont);
				if ((this.buttons & Enums.FilterButton.APPLY) != 0)
					btnApply = buttonsCont.appendChild(
						this.initElementButton(
							this.translator.Translate('applyFilter'), sels.BTN_APPLY_CLS
						)
					);
				if ((this.buttons & Enums.FilterButton.CLEAR) != 0)
					btnClear = buttonsCont.appendChild(
						this.initElementButton(
							this.translator.Translate('clearFilter'), sels.BTN_CLEAR_CLS
						)
					);
				if ((this.buttons & Enums.FilterButton.CANCEL) != 0)
					btnCancel = buttonsCont.appendChild(
						this.initElementButton(
							this.translator.Translate('cancelFilter'), sels.BTN_CANCEL_CLS
						)
					);
			}

			this.elms = <AgGrids.Interfaces.IFilterMenuElements>{
				cont: cont,
				sectionsCont: sectionsCont,
				sections: [],
				buttonsCont: buttonsCont,
				btnApply: btnApply,
				btnClear: btnClear,
				btnCancel: btnCancel
			};

			return this;
		}
		protected initElementButton (text: string, className: string): HTMLAnchorElement {
			var btn = document.createElement('a');
			btn.className = className;
			btn.href = '#';
			var span = document.createElement('span');
			span = btn.appendChild(span);
			var b = document.createElement('b');
			b = span.appendChild(b);
			b.innerHTML = text;
			return btn;
		}

		protected initEvents (): this {
			this.handlers = {};
			if (this.buttons !== Enums.FilterButton.NONE) {
				if (this.elms.btnApply)
					this.elms.btnApply.addEventListener(
						'click', this.handlers.handleApply = this.handleApply.bind(this)
					);
				if (this.elms.btnClear)
					this.elms.btnClear.addEventListener(
						'click', this.handlers.handleClear = this.handleClear.bind(this)
					);
				if (this.elms.btnCancel)
					this.elms.btnCancel.addEventListener(
						'click', this.handlers.handleCancel = this.handleCancel.bind(this)
					);
			}
			return this;
		}

		protected handleApply (e?: MouseEvent): void {
			this.stopEvent(e);
			var filtering = this.getFilteringFromControls();
			this.grid.GetEvents().HandleFilterMenuChange(this.columnId, filtering);
			this.hide();
		}
		protected handleClear (e: MouseEvent): void {
			this.stopEvent(e);
			this.filteringStr = '';
			this.latestFiltering = null;
			this
				.destroySections()
				.createSections(null);
			this.grid.GetEvents().HandleFilterMenuChange(this.columnId, null);
			this.hide();
		}
		protected handleCancel (e: MouseEvent): void {
			this.stopEvent(e);
			this
				.destroySections()
				.createSections(this.latestFiltering);
			this.hide();
		}

		protected destroySections (): this {
			for (var index = this.elms.sections.length - 1; index >= 0; index--)
				this.destroySection(index, this.elms.sections[index]);
			return this;
		}
		protected destroySection (index: number, sectionElms: Interfaces.IFilterMenuSectionElements): this {
			var sectionElms = this.elms.sections[index],
				sectionHandlers = this.sectionHandlers[index];
			if (sectionHandlers.handleTypeChange != null)
				sectionElms.typeSelect.removeEventListener(
					'change', sectionHandlers.handleTypeChange as any
				);
			if (sectionHandlers.handleValueChange != null)
				sectionElms.valueInput.removeEventListener(
					'change', sectionHandlers.handleValueChange as any
				);
			if (sectionHandlers.handleValueKeyUp != null)
				sectionElms.valueInput.removeEventListener(
					'keyup', sectionHandlers.handleValueKeyUp as any
				);
			if (sectionHandlers.handleAddNextValue != null)
				sectionElms.btnNextValue.removeEventListener(
					'click', sectionHandlers.handleAddNextValue as any
				);
			this.elms.sections.splice(index, 1);
			this.elms.sectionsCont.removeChild(sectionElms.section);
			return this;
		}

		protected createSections (filteringItem: Map<Enums.Operator, string[]> | null): this {
			var index = 0;
			if (filteringItem != null && filteringItem.size > 0) {
				var totalSectionsCount = 0;
				for (var values of filteringItem.values())
					totalSectionsCount += values.length;
				for (var [operator, values] of filteringItem.entries()) {
					for (var value of values) {
						this
							.createSectionElements(operator, value, index, totalSectionsCount)
							.initSectionEvents(index);
						index++;
					}
				}
			} else {
				this
					.createSectionElements(null, null)
					.initSectionEvents(index);
			}
			return this;
		}
		protected createSectionElements (operator: Enums.Operator | null, value: string | null, index: number = 0, filteringItemsCount: number = 1): this {
			var section = document.createElement('div');
			section.className = this.Static.SELECTORS.SECTION_CLS;
			var [typeSelect, currentControlType] = this.createSectionElementTypeSelect(
				section, operator, value
			);
			var valueInput = this.createSectionElementValueInput(
				section, operator, value, currentControlType
			);
			var btnNextValue = this.createSectionElementBtnNextValue(
				section, index, filteringItemsCount
			);
			section = this.elms.sectionsCont.appendChild(section);
			this.elms.sections.push(<Interfaces.IFilterMenuSectionElements>{
				section: section,
				typeSelect: typeSelect,
				valueInput: valueInput,
				btnNextValue: btnNextValue
			});
			return this.changeValueInputType(index, currentControlType);
		}
		protected changeValueInputType (index: number, currentControlType: Enums.FilterControlType): this {
			// do nothing in base class
			return this;
		}
		protected createSectionElementTypeSelect (section: HTMLDivElement, operator: Enums.Operator | null, value: string | null): [HTMLSelectElement, Enums.FilterControlType] {
			var typeSelect = document.createElement('select');
			typeSelect.className = this.Static.SELECTORS.TYPE_CLS;
			var allServerTypesControlTypesOrders = FilterOperatorsCfg.SERVER_TYPES_CONTROL_TYPES_ORDERS;
			var allControlTypes = allServerTypesControlTypesOrders.has(this.serverType)
					? allServerTypesControlTypesOrders.get(this.serverType)
					: allServerTypesControlTypesOrders.get(Enums.ServerType.STRING);
			var currentControlType = this.getControlTypeByOperatorAndValue(
					operator, value, allControlTypes.length > 0
						? allControlTypes[0]
						: Enums.FilterControlType.UNKNOWN
				),
				allowedControlTypes = this.params.controlTypes;
			for (var controlType of allControlTypes) {
				if ((allowedControlTypes & controlType) != 0) {
					var option = document.createElement('option');
					if (controlType === currentControlType) {
						option.selected = true;
					}
					option.value = controlType.toString();
					option.title = [
						'column',
						FilterOperatorsCfg.CONTROL_TYPES_OPERATORS.get(controlType).toString(),
						FilterOperatorsCfg.CONTROL_TYPES_VALUE_PATTERNS.get(controlType).replace('<value>', 'value')
					].join(' ');
					option.innerHTML = this.translator.Translate(
						FilterOperatorsCfg.CONTROL_TYPES_TEXTS.get(controlType)
					);
					typeSelect.appendChild(option);
				}
			}
			return [section.appendChild(typeSelect), currentControlType];
		}
		protected createSectionElementValueInput (section: HTMLDivElement, operator: Enums.Operator | null, value: string | null, currentControlType: Enums.FilterControlType): HTMLInputElement {
			var sels = this.Static.SELECTORS,
				valueInput = document.createElement('input');
			if (
				currentControlType === Enums.FilterControlType.IS_NULL || 
				currentControlType === Enums.FilterControlType.IS_NOT_NULL || 
				this.serverType === Enums.ServerType.BOOL
			) {
				valueInput.className = [sels.INPUT_CLS, sels.INPUT_HIDDEN_CLS].join(' ');
			} else {
				valueInput.className = sels.INPUT_CLS;
				if (value != null) {
					var valuePattern = FilterOperatorsCfg.CONTROL_TYPES_VALUE_PATTERNS.get(currentControlType),
						regExp = new RegExp('^' + valuePattern.replace('<value>', '(.*)') + '$', 'g'),
						value = value.replace(regExp, '$1');
					this.setValueInput(valueInput, value, currentControlType);
				}
			}
			return section.appendChild(valueInput);
		}
		protected createSectionElementBtnNextValue (section: HTMLDivElement, index: number, filteringItemsCount: number): HTMLAnchorElement {
			var sels = this.Static.SELECTORS,
				btnNextValue = section.appendChild(
					this.initElementButton(
						this.translator.Translate('addOr'), sels.BTN_ADD_CLS
					)
				);
			var hiddenBtnClass = [sels.BTN_ADD_CLS, sels.BTN_ADD_HIDDEN_CLS].join(' ');;
			if (index + 1 < filteringItemsCount) {
				btnNextValue.className = hiddenBtnClass;
			} else if (
				filteringItemsCount === 1 && !(
					(this.params.controlTypes & Enums.FilterControlType.IS_NULL) != 0 ||
					(this.params.controlTypes & Enums.FilterControlType.IS_NOT_NULL) != 0
				)
			) {
				btnNextValue.className = hiddenBtnClass;
			}
			return btnNextValue;
		}

		protected setValueInput (valueInput: HTMLInputElement, value: string, currentControlType: Enums.FilterControlType): this {
			// do nothing special in base class
			valueInput.value = value;
			return this;
		}
		protected getValueInput (valueInput: HTMLInputElement, currentControlType: Enums.FilterControlType): string {
			// do nothing special in base class
			return valueInput.value;
		}
		protected isControlTypeForCompleteValue (currentControlType: Enums.FilterControlType): boolean {
			return (
				(currentControlType & Enums.FilterControlType.EQUAL) != 0 || 
				(currentControlType & Enums.FilterControlType.GREATER) != 0 || 
				(currentControlType & Enums.FilterControlType.LOWER) != 0 || 
				(currentControlType & Enums.FilterControlType.GREATER_EQUAL) != 0 || 
				(currentControlType & Enums.FilterControlType.LOWER_EQUAL) != 0 || 
				(currentControlType & Enums.FilterControlType.NOT_EQUAL) != 0
			);
		}

		protected initSectionEvents (index: number): this {
			var sectionElms = this.elms.sections[index],
				sectionHandlers: Interfaces.IFilterMenuSectionEvents = {} as any;
			sectionElms.typeSelect.addEventListener(
				'change', sectionHandlers.handleTypeChange = this.handleTypeChange.bind(this, index)
			);
			if (this.buttons === Enums.FilterButton.NONE) {
				sectionElms.valueInput.addEventListener(
					'change', sectionHandlers.handleValueChange = this.handleValueChange.bind(this, index)
				);
			}
			sectionElms.valueInput.addEventListener(
				'keyup', sectionHandlers.handleValueKeyUp = this.handleValueKeyUp.bind(this, index)
			);
			sectionElms.btnNextValue.addEventListener(
				'click', sectionHandlers.handleAddNextValue = this.handleAddNextValue.bind(this, index)
			);
			this.sectionHandlers[index] = sectionHandlers;
			return this;
		}

		protected handleTypeChange (index: number, e: Event): void {
			var sectionElms = this.elms.sections[index],
				sels = this.Static.SELECTORS,
				filteringControlType: Enums.FilterControlType = parseInt(sectionElms.typeSelect.value, 10) as any;
			if (
				filteringControlType === Enums.FilterControlType.IS_NULL ||
				filteringControlType === Enums.FilterControlType.IS_NOT_NULL ||
				this.serverType === Enums.ServerType.BOOL
			) {
				sectionElms.valueInput.className = [sels.INPUT_CLS, sels.INPUT_HIDDEN_CLS].join(' ');
			} else {
				sectionElms.valueInput.className = sels.INPUT_CLS;
				this.changeValueInputType(index, filteringControlType);
			}
		}
		protected handleValueChange (index: number, e: Event): void {
			this.handleApply();
			this.stopEvent(e);
		}
		protected handleValueKeyUp (index: number, e: KeyboardEvent): void {
			if (e.key === 'Enter') {
				this.handleApply();
				e.preventDefault();
				e.stopPropagation();
				e.cancelBubble = true;
			}
		}
		protected handleAddNextValue (index: number, e: MouseEvent): void {
			this.stopEvent(e);
			var sectionElms = this.elms.sections[index],
				sels = this.Static.SELECTORS;
			sectionElms.btnNextValue.className = [sels.BTN_ADD_CLS, sels.BTN_ADD_HIDDEN_CLS].join(' ');
			var nextIndex = index + 1;
			this
				.createSectionElements(null, null, nextIndex, nextIndex + 1)
				.initSectionEvents(nextIndex);
		}

		protected getFilteringFromControls (): Map<Enums.Operator, string[]> {
			var filtering = new Map<Enums.Operator, string[]>(),
				operator: Enums.Operator,
				filteringControlType: Enums.FilterControlType,
				valuePattern: string, 
				rawValue: string, 
				value: string;
			for (var sectionElms of this.elms.sections) {
				filteringControlType = parseInt(sectionElms.typeSelect.value, 10) as any;
				rawValue = this.getValueInput(sectionElms.valueInput, filteringControlType);
				valuePattern = FilterOperatorsCfg.CONTROL_TYPES_VALUE_PATTERNS.get(filteringControlType);
				value = valuePattern.replace('<value>', rawValue);
				operator = FilterOperatorsCfg.CONTROL_TYPES_OPERATORS.get(filteringControlType);
				if (filtering.has(operator)) {
					filtering.get(operator).push(value);
				} else {
					filtering.set(operator, [value]);
				}
			}
			return filtering;
		}
		protected hide (): this {
			if (this.hideMenuCallback) this.hideMenuCallback();
			this.hideMenuCallback = null;
			return this;
		}
		protected getControlTypeByOperatorAndValue (operator: Enums.Operator | null, value: string | null, defaultResult: Enums.FilterControlType): Enums.FilterControlType {
			var result = Enums.FilterControlType.UNKNOWN;
			if (operator == null || value == null) return defaultResult;
			var isEqual = operator === Enums.Operator.EQUAL,
				isNotEqual = operator === Enums.Operator.NOT_EQUAL,
				isLike = operator === Enums.Operator.LIKE,
				isNotLike = operator === Enums.Operator.NOT_LIKE;
			if (isEqual || isNotEqual) {
				if (isEqual && this.serverType === Enums.ServerType.BOOL) {
					result = value === '1'
						? Enums.FilterControlType.IS_TRUE
						: Enums.FilterControlType.IS_FALSE;
				} else if (value === 'null') {
					result = isEqual
						? Enums.FilterControlType.IS_NULL
						: Enums.FilterControlType.IS_NOT_NULL;
				} else {
					result = isEqual
						? Enums.FilterControlType.EQUAL
						: Enums.FilterControlType.NOT_EQUAL;
				}
			} else if (operator === Enums.Operator.LOWER) {
				result = Enums.FilterControlType.LOWER;
			} else if (operator === Enums.Operator.GREATER) {
				result = Enums.FilterControlType.GREATER;
			} else if (operator === Enums.Operator.LOWER_EQUAL) {
				result = Enums.FilterControlType.LOWER_EQUAL;
			} else if (operator === Enums.Operator.GREATER_EQUAL) {
				result = Enums.FilterControlType.GREATER_EQUAL;
			} else if (isLike || isNotLike) {
				var startsAndEndsRegExp = /^%(.*)%$/g,
					startsWithRegExp = /([^%_]+)%$/g,
					endsWithRegExp = /^%([^%_]+)/g;
				if (value.match(startsAndEndsRegExp)) {
					result = isLike
						? Enums.FilterControlType.CONTAINS
						: Enums.FilterControlType.NOT_CONTAINS;
				} else if (value.match(startsWithRegExp)) {
					result = isLike
						? Enums.FilterControlType.STARTS_WITH
						: Enums.FilterControlType.NOT_STARTS_WITH;
				} else if (value.match(endsWithRegExp)) {
					result = isLike
						? Enums.FilterControlType.ENDS_WITH
						: Enums.FilterControlType.NOT_ENDS_WITH;
				} else {
					result = isLike
						? Enums.FilterControlType.CONTAINS
						: Enums.FilterControlType.NOT_CONTAINS;
				}
			}
			if (result === Enums.FilterControlType.UNKNOWN)
				result = defaultResult;
			return result;
		}
		protected stopEvent (e: Event): this {
			if (e == null) return this;
			e.preventDefault();
			e.stopPropagation();
			e.cancelBubble = true;
			return this;
		}
		
		public isFilterActive (): boolean {
			return false;
		}
		public doesFilterPass (params: agGrid.IDoesFilterPassParams): boolean {
			return false; 
		}
		public getModel () {
		}
		public setModel () {
		}
	}
}