declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.FilterMenus {
    interface IParams<TData = any> extends agGrid.IFilterParams<TData> {
        suppressAndOrCondition: boolean;
        isTouchDevice: boolean;
        grid: AgGrid;
        columnId: string;
        serverColumnCfg: IServerConfigs.IColumn;
        serverType: Enums.ServerType;
        filteringItem: Map<Enums.Operator, string[]>;
        controlTypes: Enums.FilterControlType;
        buttons: Enums.FilterButton;
    }
}
