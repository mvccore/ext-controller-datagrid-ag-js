declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
    class FilterHeader implements agGrid.IFloatingFilterComp<any> {
        static readonly SELECTORS: {
            CONT_CLS: string;
            INPUT_CLS: string;
            REMOVE_CLS: string;
            ACTIVE_CLS: string;
        };
        Static: typeof FilterHeader;
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
        constructor();
        init(agParams: AgGrids.Interfaces.FilterHeaders.IParams<any>): void;
        getGui(): HTMLElement;
        SetText(filteringItem: Map<Enums.Operator, string[]> | null): this;
        protected initParams(agParams: AgGrids.Interfaces.FilterHeaders.IParams<any>): this;
        protected initElements(): this;
        protected initEvents(): this;
        protected handleSubmit(e: KeyboardEvent): void;
        protected handleBlur(e: KeyboardEvent): void;
        protected handleFocus(e: KeyboardEvent): void;
        protected handleRemove(e: KeyboardEvent): void;
        protected handleChange(e: Event): void;
        protected stopEvent(e: Event): this;
        destroy(): void;
        afterGuiAttached(params?: agGrid.IAfterGuiAttachedParams): void;
        protected setHeaderActive(active: boolean): this;
        onParentModelChanged(parentModel: any, event: agGrid.FilterChangedEvent<any>): void;
    }
}
