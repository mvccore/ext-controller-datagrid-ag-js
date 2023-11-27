declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class PageChange extends Base {
        protected offsetBefore: number;
        protected offsetAfter: number;
        protected anchor: HTMLAnchorElement | null;
        constructor(offsetBefore: number, offsetAfter: number, anchor?: HTMLAnchorElement | null);
        SetOffsetBefore(offsetBefore: number): this;
        GetOffsetBefore(): number;
        SetOffsetAfter(offsetAfter: number): this;
        GetOffsetAfter(): number;
        SetAnchor(anchor: HTMLAnchorElement | null): this;
        GetAnchor(): HTMLAnchorElement | null;
    }
}
