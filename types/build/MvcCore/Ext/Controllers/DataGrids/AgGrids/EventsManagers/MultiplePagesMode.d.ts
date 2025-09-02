declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
    class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManager {
        Static: typeof MultiplePagesMode;
        protected grid: AgGrid;
        protected countScalesHandlers: Map<number, (e: MouseEvent) => void>;
        protected pagingHandlers: Map<number, (e: MouseEvent) => void>;
        protected handleRefreshResponseCallback: (e: EventsManagers.Events.ModelUpdate) => void;
        constructor(grid: AgGrid);
        HandleGridReady(event: agGrid.GridReadyEvent<any>): void;
        AddCountScalesEvents(): this;
        RemoveCountScalesEvents(): this;
        AddPagingEvents(): this;
        RemovePagingEvents(): this;
        protected handleRefreshClick(refreshAnchor: HTMLAnchorElement, loadingCls: string, e: MouseEvent): boolean;
        ExecuteRefresh(): this;
        protected handleRefreshResponse(): void;
        protected handleCountScalesClick(countAfter: number, e: MouseEvent): void;
        protected handlePagingClick(offsetAfter: number, e: MouseEvent): void;
    }
}
