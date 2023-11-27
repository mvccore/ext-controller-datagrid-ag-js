declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
    class Manager {
        Static: typeof Manager;
        protected grid: AgGrid;
        protected optionsManager: AgGrids.Options.Manager;
        protected eventsManager: AgGrids.EventsManager;
        protected helpers: AgGrids.Tools.Helpers;
        protected agColumnsConfigs: Map<string, AgGrids.Types.GridColumn>;
        protected agColumnDefaults: agGrid.ColDef<any>;
        protected sortHeaderDefaults: AgGrids.Interfaces.SortHeaders.IParams;
        protected filterHeaderDefaults: AgGrids.Interfaces.FilterHeaders.IParams;
        protected filterMenuDefaults: AgGrids.Interfaces.FilterMenus.IParams;
        protected serverConfig: Interfaces.IServerConfig;
        protected initData: Interfaces.Ajax.IResponse;
        protected viewHelper: Columns.ViewHelper;
        protected serverColumnsMapAll: Map<string, Interfaces.IServerConfigs.IColumn>;
        protected serverColumnsSortedAll: Interfaces.IServerConfigs.IColumn[];
        protected serverColumnsUserSortedAll: Interfaces.IServerConfigs.IColumn[];
        protected serverColumnsSortedActive: Interfaces.IServerConfigs.IColumn[];
        protected filteringEnabled: boolean;
        protected sortingEnabled: boolean;
        constructor(grid: AgGrid);
        SetServerColumnsMapAll(serverColumnsMapAll: Map<string, Interfaces.IServerConfigs.IColumn>): this;
        GetServerColumnsMapAll(): Map<string, Interfaces.IServerConfigs.IColumn>;
        SetServerColumnsSortedAll(serverColumnsSortedAll: Interfaces.IServerConfigs.IColumn[]): this;
        GetServerColumnsSortedAll(): Interfaces.IServerConfigs.IColumn[];
        SetServerColumnsUserSortedAll(serverColumnsUserSortedAll: Interfaces.IServerConfigs.IColumn[]): this;
        GetServerColumnsUserSortedAll(): Interfaces.IServerConfigs.IColumn[];
        SetServerColumnsSortedActive(serverColumnsSortedActive: Interfaces.IServerConfigs.IColumn[]): this;
        GetServerColumnsSortedActive(): Interfaces.IServerConfigs.IColumn[];
        SetAgColumnsConfigs(gridColumns: Map<string, AgGrids.Types.GridColumn>): this;
        GetAgColumnsConfigs(): Map<string, AgGrids.Types.GridColumn>;
        SetAgColumnDefaults(defaultColDef: agGrid.ColDef): this;
        GetAgColumnDefaults(): agGrid.ColDef;
        Init(): this;
        protected initServerCfgAndViewHelper(): this;
        protected initColumns(): this;
        protected initColumn(serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): AgGrids.Types.GridColumn;
        protected initColumnSorting(column: agGrid.ColDef, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): this;
        protected initColumnFiltering(column: agGrid.ColDef, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): this;
        protected initColumnStyles(column: agGrid.ColDef, serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn): this;
    }
}
