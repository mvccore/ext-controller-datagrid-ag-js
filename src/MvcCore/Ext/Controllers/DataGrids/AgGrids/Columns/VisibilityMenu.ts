namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
	export class VisibilityMenu {
		public static SELECTORS = {
			GRID_TOP_PLACE_BEFORE_SEL: '.ag-root .ag-overlay',
			//GRID_TOP_PLACE_BEFORE_SEL: '.grid-table-component', // use this if column resizing is buggy
			GRID_BOTTOM_PLACE_BEFORE_SEL: '.grid-controls-bottom',

			CONT_CLS: 'columns-menu',

			BTN_OPEN_CLS: 'columns-menu-btn-open',
			BTN_APPLY_CLS: 'columns-menu-btn-apply',
			BTN_CANCEL_CLS: 'columns-menu-btn-cancel',

			FORM_CLS: 'columns-menu-form',
			FORM_SMALL_CLS: 'columns-menu-form-small',
			FORM_HIDDEN_CLS: 'columns-menu-form-hidden',
			FORM_HEAD_CLS: 'columns-menu-heading',
			FORM_CTRLS_CLS: 'columns-menu-controls',
			MENU_CTRL_CLS: 'columns-menu-control',
			FORM_BTNS_CLS: 'columns-menu-buttons',

			INPUT_ID_BASE: 'columns-menu-column-',
		};
		public Static: typeof VisibilityMenu;
		protected grid: AgGrid;
		protected optionsManager: Options.Manager;
		protected translator: Tools.Translator;
		protected serverConfig: Interfaces.IServerConfig;
		protected elms: Interfaces.ColumnsMenus.IElements;
		protected displayed: boolean;
		protected formClick: boolean;
		protected formBaseClasses: string[];
		protected handlers: {
			handleDocumentClick?: (e: MouseEvent) => void;
			handleFormClick?: (e: MouseEvent) => void;
			handleFormSubmit?: (e: MouseEvent) => void;
		}
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.optionsManager = grid.GetOptionsManager();
			this.translator = grid.GetTranslator();
			this.serverConfig = grid.GetServerConfig();
			this.displayed = false;
			this.formClick = false;
			this
				.initElements()
				.initEvents();
		}
		public Hide (): this {
			if (!this.displayed) return this;
			if (this.elms.form) {
				this.displayed = false;
				var sels = this.Static.SELECTORS;
				this.formBaseClasses = [sels.FORM_CLS, sels.FORM_HIDDEN_CLS];
				this.elms.form.className = this.formBaseClasses.join(' ');
				this.removeShownEvents();
			}
			return this;
		}
		public Show (): this {
			if (this.displayed) 
				return this;
			if (this.elms.form) {
				this.displayed = true;
				this.formBaseClasses = [this.Static.SELECTORS.FORM_CLS];
				this.elms.form.className = this.formBaseClasses.join(' ');
				this
					.ResizeControls()
					.disableUsedColumns()
					.addShownEvents();
			}
			return this;
		}
		public RedrawControls (): this {
			if (!this.elms.controls) return this;
			this.elms.controls.innerHTML = '';
			return this.initFormControls();
		}
		public ResizeControls (): this {
			if (!this.displayed) return this;
			var gridElm = this.grid.GetOptionsManager().GetElements().agGridElement,
				heightDiff = this.elms.heading.offsetHeight + this.elms.buttons.offsetHeight + 10,
				sels = this.Static.SELECTORS,
				pos = this.formBaseClasses.indexOf(sels.FORM_SMALL_CLS),
				offsetHeight = Math.max((gridElm.offsetHeight * 0.75) - heightDiff);
			if (offsetHeight < 300) {
				offsetHeight = Math.max(gridElm.offsetHeight - heightDiff);
				if (pos === -1)
					this.formBaseClasses.push(sels.FORM_SMALL_CLS);
			} else {
				if (pos !== -1)
					this.formBaseClasses.splice(pos, 1);
			}
			this.elms.form.className = this.formBaseClasses.join(' ');
			this.elms.controls.style.maxHeight = offsetHeight + 'px';
			return this;
		}
		public UpdateFormAction (gridPath: string): this {
			if (!this.elms.form) return this;
			var formAction = location.href,
				delim = '?',
				pos = formAction.indexOf(delim);
			if (pos > -1) 
				delim = (pos == formAction.length - 1) ? '' : '&';
			formAction += delim + this.serverConfig.gridActionParamName + '=' + this.serverConfig.gridActionColumnStates;
			this.elms.form.action = formAction;
			this.elms.hidden.value = gridPath;
			return this;
		}
		protected removeShownEvents(): this {
			document.removeEventListener('click', this.handlers.handleDocumentClick);
			this.elms.form.removeEventListener('click', this.handlers.handleFormClick, true);
			this.elms.form.removeEventListener('submit', this.handlers.handleFormSubmit);
			return this;
		}
		protected disableUsedColumns (): this {
			if (this.serverConfig.ignoreDisabledColumns) return this;
			var filtering = this.grid.GetFiltering(),
				sorting = this.grid.GetSorting(),
				sortingSet = new Set<string>();
			for (var [idColumn] of sorting)
				sortingSet.add(idColumn);
			for (var [idColumn, input] of this.elms.inputs.entries()) {
				input.disabled = filtering.has(idColumn) || sortingSet.has(idColumn);
			}
			return this;
		}
		protected addShownEvents(): this {
			this.handlers = {};
			setTimeout(() => {
				document.addEventListener(
					'click', this.handlers.handleDocumentClick = this.handleDocumentClick.bind(this)
				);
				this.elms.form.addEventListener(
					'click', this.handlers.handleFormClick = this.handleFormClick.bind(this), true
				);
			});
			this.elms.form.addEventListener(
				'submit', this.handlers.handleFormSubmit = this.handleFormSubmit.bind(this)	
			);
			return this;
		}
		protected handleDocumentClick (e: MouseEvent): void {
			if (!this.formClick) {
				this.Hide();
			}
			this.formClick = false;
		}
		protected handleFormClick (e: MouseEvent): void {
			this.formClick = true;
		}
		protected handleFormSubmit (e: Event): void {
			var continueToBrowserActions = this.grid.GetEvents().FireHandlers(
				"beforeColumnsVisibilityChange", 
				new EventsManagers.Events.ColumnsVisibilityChange(this.elms.form)	
			);
			if (continueToBrowserActions === false) {
				e.cancelBubble = true;
				e.preventDefault();
				e.stopPropagation();
			}
		}
		protected initElements (): this {
			var gridElm = this.optionsManager.GetElements().contElement,
				renderCfg = this.serverConfig.renderConfig,
				renderTableHead = renderCfg.renderTableHead,
				sels = this.Static.SELECTORS,
				placeBeforeElm = gridElm.querySelector(
					renderTableHead
						? sels.GRID_TOP_PLACE_BEFORE_SEL
						: sels.GRID_BOTTOM_PLACE_BEFORE_SEL
				),
				menuCont = this.createElm<HTMLDivElement>('div', [sels.CONT_CLS]),
				openBtn = this.createElm<HTMLAnchorElement>('a', [sels.BTN_OPEN_CLS], null, { href: '#' });
			openBtn = menuCont.appendChild(openBtn);
			if (placeBeforeElm != null)
				menuCont = placeBeforeElm.parentNode.insertBefore(menuCont, placeBeforeElm);
			this.elms = <Interfaces.ColumnsMenus.IElements>{
				menuCont: menuCont,
				openBtn: openBtn,
			};
			return this;
		}
		protected initFormElements (): this {
			var sels = this.Static.SELECTORS;
			var form = this.createElm<HTMLFormElement>(
				'form', [sels.FORM_CLS], null, {
					method: 'POST'
				}
			);
			var head = this.createElm<HTMLDivElement>(
				'div', [sels.FORM_HEAD_CLS], this.translator.Translate('displayColumns')
			);
			this.elms.heading = form.appendChild(head);
			var ctrls = this.createElm<HTMLDivElement>('div', [sels.FORM_CTRLS_CLS]);
			this.elms.controls = form.appendChild(ctrls);
			this.initFormControls();
			var btns = this.createElm<HTMLDivElement>('div', [sels.FORM_BTNS_CLS]);
			this.elms.buttons = form.appendChild(btns);
			var hiddenInput = this.createElm<HTMLInputElement>('input', [], null, {
				type: 'hidden',
				name: this.serverConfig.gridUrlParamName,
				value: this.grid.GetInitialData().path
			});
			var btnApply = this.createBtn(this.translator.Translate('applyFilter'), sels.BTN_APPLY_CLS, true);
			var btnCancel = this.createBtn(this.translator.Translate('cancelFilter'), sels.BTN_CANCEL_CLS, false);
			this.elms.hidden = btns.appendChild(hiddenInput);
			this.elms.btnApply = btns.appendChild(btnApply);
			this.elms.btnCancel = btns.appendChild(btnCancel);
			this.elms.buttons = btns;
			this.elms.menuCont.appendChild(form);
			this.elms.form = form;
			this.UpdateFormAction(this.grid.GetGridPath());
			return this;
		}
		protected initFormControls (): this {
			var columnCfg: Interfaces.IServerConfigs.IColumn,
				inputId: string,
				idColumn: string,
				sels = this.Static.SELECTORS,
				baseId = sels.INPUT_ID_BASE,
				labelCls = sels.MENU_CTRL_CLS,
				label: HTMLLabelElement,
				text: string,
				span: HTMLSpanElement,
				checkbox: HTMLInputElement;
			this.elms.inputs = new Map<string, HTMLInputElement>();
			for (var columnCfg of this.grid.GetOptionsManager().GetColumnManager().GetServerColumnsSortedAll()) {
				idColumn = columnCfg.urlName;
				text = columnCfg.title ?? columnCfg.headingName;
				if (text === idColumn) continue;
				inputId = baseId + idColumn;
				label = this.createElm<HTMLLabelElement>('label', [labelCls], null, { for: inputId });
				checkbox = this.createElm<HTMLInputElement>('input', [], null, { id: inputId, name: idColumn, type: 'checkbox' });
				checkbox.checked = !columnCfg.disabled;
				span = this.createElm<HTMLSpanElement>('span', [], text);
				this.elms.inputs.set(idColumn, label.appendChild(checkbox));
				label.appendChild(span);
				this.elms.controls.appendChild(label);
			}
			return this;
		}
		protected initFormEvents (): this {
			this.elms.btnCancel.addEventListener('click', this.handleCancel.bind(this));
			return this;
		}
		protected createElm<T> (elmName: string, clsNames: string[] = [], innerHTML: string | null = null, props: any = null): T {
			var result: any = document.createElement(elmName);
			if (clsNames.length > 0) result.className = clsNames.join(' ');
			if (innerHTML != null) result.innerHTML = innerHTML;
			if (props != null) for (var prop in props) result[prop] = props[prop];
			return result;
		}
		protected createBtn (text: string, className: string, submit: boolean): HTMLButtonElement {
			var btn = this.createElm<HTMLButtonElement>('button', [className]);
			btn.type = submit ? 'submit' : 'button';
			var span = this.createElm<HTMLSpanElement>('span');
			var b = this.createElm<HTMLElement>('b');
			b.innerHTML = text;
			span.appendChild(b);
			btn.appendChild(span);
			return btn;
		}
		protected initEvents (): this {
			this.elms.openBtn.addEventListener('click', this.handleOpen.bind(this));
			return this;
		}
		protected handleOpen (e: MouseEvent): void {
			if (!this.elms.form) 
				this.initFormElements().initFormEvents();
			this.stopEvent(e).Show();

		}
		protected handleCancel (e: MouseEvent): void {
			this.stopEvent(e).Hide();
		}
		protected stopEvent (e: Event): this {
			e.preventDefault();
			e.stopPropagation();
			e.cancelBubble = true;
			return this;
		}
	}
}
