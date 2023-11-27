declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class CountScaleChange extends Base {
        protected countBefore: number;
        protected countAfter: number;
        protected anchor: HTMLAnchorElement;
        constructor(countBefore: number, countAfter: number, anchor: HTMLAnchorElement);
        SetCountBefore(countBefore: number): this;
        GetCountBefore(): number;
        SetCountAfter(countAfter: number): this;
        GetCountAfter(): number;
        SetAnchor(anchor: HTMLAnchorElement): this;
        GetAnchor(): HTMLAnchorElement;
    }
}
