declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
    class FilterMenu implements agGrid.IFilterComp<any> {
        static readonly SELECTORS: {
            CONT_CLS: string;
            SECTIONS_CLS: string;
            SECTION_CLS: string;
            TYPE_CLS: string;
            INPUT_CLS: string;
            INPUT_HIDDEN_CLS: string;
            BTN_ADD_CLS: string;
            BTN_ADD_HIDDEN_CLS: string;
            BTNS_CLS: string;
            BTN_APPLY_CLS: string;
            BTN_CLEAR_CLS: string;
            BTN_CANCEL_CLS: string;
        };
        Static: typeof FilterMenu;
        protected params: Interfaces.FilterMenus.IParams<any>;
        protected grid: AgGrid;
        protected helpers: AgGrids.Tools.Helpers;
        protected translator: Tools.Translator;
        protected columnId: string;
        protected serverColumnCfg: Interfaces.IServerConfigs.IColumn;
        protected serverType: Enums.ServerType;
        protected controlTypes: Enums.FilterControlType;
        protected buttons: Enums.FilterButton;
        protected elms: Interfaces.FilterMenus.IElements;
        protected filteringStr: string;
        protected latestFiltering: Map<Enums.Operator, string[]> | null;
        protected handlers: {
            handleApply?: (e?: MouseEvent) => void;
            handleClear?: (e: MouseEvent) => void;
            handleCancel?: (e: MouseEvent) => void;
        };
        protected sectionHandlers: Interfaces.FilterMenus.Sections.IEvents[];
        protected hideMenuCallback: () => void;
        constructor();
        init(agParams: Interfaces.FilterMenus.IParams<any>): void;
        getGui(): HTMLElement;
        /**
         * Gets called every time the popup is shown, after the GUI returned in
         * getGui is attached to the DOM. If the filter popup is closed and re-opened, this method is
         * called each time the filter is shown. This is useful for any logic that requires attachment
         * before executing, such as putting focus on a particular DOM element. The params has a
         * callback method 'hidePopup', which you can call at any later point to hide the popup - good
         * if you have an 'Apply' button and you want to hide the popup after it is pressed.
         */
        afterGuiAttached(params?: agGrid.IAfterGuiAttachedParams): void;
        /**
         * Gets called when the column is destroyed. If your custom filter needs to do
         * any resource cleaning up, do it here. A filter is NOT destroyed when it is
         * made 'not visible', as the GUI is kept to be shown again if the user selects
         * that filter again. The filter is destroyed when the column it is associated with is
         * destroyed, either when new columns are set into the grid, or the grid itself is destroyed.
         */
        destroy(): void;
        SetUpControls(filteringItem: Map<Enums.Operator, string[]> | null): this;
        protected initParams(agParams: AgGrids.Interfaces.FilterMenus.IParams<any>): this;
        protected initElements(): this;
        protected initElementButton(text: string, className: string): HTMLAnchorElement;
        protected initEvents(): this;
        protected handleApply(e?: MouseEvent): void;
        protected handleClear(e: MouseEvent): void;
        protected handleCancel(e: MouseEvent): void;
        protected destroySections(): this;
        protected destroySection(index: number, sectionElms: Interfaces.FilterMenus.Sections.IElements): this;
        protected createSections(filteringItem: Map<Enums.Operator, string[]> | null): this;
        protected createSectionElements(operator: Enums.Operator | null, value: string | null, index: number, filteringItemsCount: number): this;
        protected changeValueInputType(index: number, currentControlType: Enums.FilterControlType): this;
        protected createSectionElementTypeSelect(section: HTMLDivElement, operator: Enums.Operator | null, value: string | null): [HTMLSelectElement, Enums.FilterControlType];
        protected createSectionElementValueInput(section: HTMLDivElement, operator: Enums.Operator | null, value: string | null, currentControlType: Enums.FilterControlType): HTMLInputElement;
        protected createSectionElementBtnNextValue(section: HTMLDivElement, index: number, filteringItemsCount: number): HTMLAnchorElement;
        protected setValueInput(valueInput: HTMLInputElement, value: string, currentControlType: Enums.FilterControlType): this;
        protected getValueInput(valueInput: HTMLInputElement, currentControlType: Enums.FilterControlType): string;
        protected isControlTypeForCompleteValue(currentControlType: Enums.FilterControlType): boolean;
        protected initSectionEvents(index: number): this;
        protected handleTypeChange(index: number, e: Event): void;
        protected handleValueChange(index: number, e: Event): void;
        protected handleValueKeyUp(index: number, e: KeyboardEvent): void;
        protected handleAddNextValue(index: number, e: MouseEvent): void;
        protected getFilteringFromControls(): Map<Enums.Operator, string[]>;
        protected hide(): this;
        protected stopEvent(e: Event): this;
        isFilterActive(): boolean;
        doesFilterPass(params: agGrid.IDoesFilterPassParams): boolean;
        getModel(): void;
        setModel(): void;
    }
}
