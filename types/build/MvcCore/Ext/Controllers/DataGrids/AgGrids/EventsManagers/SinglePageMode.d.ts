declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
    class SinglePageMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
        Static: typeof SinglePageMode;
        protected grid: AgGrid;
        protected refreshOffsets: number[];
        constructor(grid: AgGrid);
        HandleBodyScroll(event: agGrid.BodyScrollEvent<any>): void;
        HandleResponseLoaded(response: AgGrids.Interfaces.Ajax.IResponse, selectFirstRow?: boolean): void;
        protected handleRefreshClick(refreshAnchor: HTMLAnchorElement, loadingCls: string, e: MouseEvent): boolean;
    }
}
