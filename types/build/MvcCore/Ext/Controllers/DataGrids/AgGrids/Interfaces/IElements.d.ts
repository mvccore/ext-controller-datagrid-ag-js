declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.SortHeaders {
    interface IElements {
        contElement: HTMLDivElement;
        agGridElement: HTMLDivElement;
        bottomControlsElement: HTMLDivElement;
        pagingControl: HTMLElement;
        countScalesControl: HTMLElement;
        refreshControl: HTMLElement;
        statusControl: HTMLElement;
        pagingAnchors: HTMLAnchorElement[];
        pagingAnchorsMaps: Map<number, HTMLAnchorElement[]>;
        refreshAnchor: HTMLAnchorElement;
        countScalesAnchors: HTMLAnchorElement[];
    }
}
