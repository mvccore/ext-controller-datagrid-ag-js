namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class ColumnsMenu {
		public static SELECTORS = {
			CONT_CLS: 'columns-menu',

			BTN_OPEN_CLS: 'columns-menu-btn-open',
			BTN_APPLY_CLS: 'columns-menu-btn-apply',
			BTN_CANCEL_CLS: 'columns-menu-btn-cancel',

			FORM_CLS: 'columns-menu-form',
			FORM_HIDDEN_CLS: 'columns-menu-form-hidden',
			FORM_HEAD_CLS: 'columns-menu-heading',
			FORM_CTRLS_CLS: 'columns-menu-controls',
			MENU_CTRL_CLS: 'columns-menu-control',
			FORM_BTNS_CLS: 'columns-menu-buttons',

			INPUT_ID_BASE: 'columns-menu-column-',
		};
		public Static: typeof ColumnsMenu;
		protected grid: AgGrid;
		protected helpers: Helpers;
		protected options: Options;
		protected eventsManager: EventsManager;
		protected translator: Translator;
		protected serverConfig: Interfaces.IServerConfig;
		protected isTouchDevice: boolean;
		protected elms: Interfaces.IColumnsMenuElements;
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.eventsManager = grid.GetEvents();
			this.options = grid.GetOptions();
			this.helpers = grid.GetHelpers();
			this.translator = grid.GetTranslator();
			this.serverConfig = grid.GetServerConfig();
			this.isTouchDevice = this.helpers.IsTouchDevice();
			this
				.initElements()
				.initEvents();
		}
		protected Hide (): this {
			if (this.elms.form) {
				var sels = this.Static.SELECTORS;
				this.elms.form.className = [sels.FORM_CLS, sels.FORM_HIDDEN_CLS].join(' ');
			}
			return this;
		}
		protected Show (): this {
			if (this.elms.form) {
				this.elms.form.className = this.Static.SELECTORS.FORM_CLS;
				this.resizeControls();
			}
			return this;
		}
		protected initElements (): this {
			var contElm = this.options.GetElements().contElement,
				sels = this.Static.SELECTORS;
			var menuCont = this.createElm<HTMLDivElement>('div', [sels.CONT_CLS]);
			var openBtn = this.createElm<HTMLAnchorElement>('a', [sels.BTN_OPEN_CLS], null, { href: '#' });
			openBtn = menuCont.appendChild(openBtn);
			this.elms = <Interfaces.IColumnsMenuElements>{
				menuCont: contElm.appendChild(menuCont),
				openBtn: openBtn,
			};
			return this;
		}
		protected initFormElements (): this {
			var sels = this.Static.SELECTORS;
			var form = this.createElm<HTMLFormElement>(
				'form', [sels.FORM_CLS], null, {
					method: 'POST',
					action: this.serverConfig.columnsStatesUrl
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
			var btnApply = this.createBtn(this.translator.Translate('applyFilter'), sels.BTN_APPLY_CLS, true);
			var btnCancel = this.createBtn(this.translator.Translate('cancelFilter'), sels.BTN_CANCEL_CLS, false);
			this.elms.btnApply = btns.appendChild(btnApply);
			this.elms.btnCancel = btns.appendChild(btnCancel);
			this.elms.buttons = btns;
			this.elms.menuCont.appendChild(form);
			this.elms.form = form;
			return this;
		}
		protected initFormControls (): this {
			var columnCfg: Interfaces.IServerConfigs.IColumn,
				inputId: string,
				sels = this.Static.SELECTORS,
				baseId = sels.INPUT_ID_BASE,
				labelCls = sels.MENU_CTRL_CLS,
				label: HTMLLabelElement,
				text: string,
				span: HTMLSpanElement,
				checkbox: HTMLInputElement;
			for (var idColumn in this.serverConfig.columns) {
				columnCfg = this.serverConfig.columns[idColumn];
				text = columnCfg.title ?? columnCfg.headingName;
				if (text === idColumn) continue;
				inputId = baseId + idColumn;
				label = this.createElm<HTMLLabelElement>('label', [labelCls], null, { for: inputId });
				checkbox = this.createElm<HTMLInputElement>('input', [], null, { id: inputId, name: idColumn, type: 'checkbox' });
				checkbox.checked = !columnCfg.disabled;
				span = this.createElm<HTMLSpanElement>('span', [], text);
				label.appendChild(checkbox);
				label.appendChild(span);
				this.elms.controls.appendChild(label);
			}
			return this;
		}
		protected initFormEvents (): this {
			this.elms.btnCancel.addEventListener('click', this.handleCancel.bind(this));
			return this;
		}
		protected resizeControls (): this {
			var gridElm = this.grid.GetOptions().GetElements().agGridElement,
				gridElmParent = gridElm.parentNode as HTMLElement,
				heightDiff = this.elms.heading.offsetHeight + this.elms.buttons.offsetHeight + 20;
			var offsetHeight = Math.max((gridElmParent.offsetHeight * 0.75) - heightDiff, 200);
			this.elms.controls.style.maxHeight = offsetHeight + 'px';
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
			this.Show();
		}
		protected handleCancel (e: MouseEvent): void {
			e.preventDefault();
			e.stopPropagation();
			e.cancelBubble = true;
			this.Hide();
		}
	}
}
