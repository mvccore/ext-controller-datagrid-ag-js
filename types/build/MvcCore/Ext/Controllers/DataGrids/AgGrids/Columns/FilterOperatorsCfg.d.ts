declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
    class FilterOperatorsCfg {
        static FILTERING_CONTROL_TYPES: Map<Enums.FilteringMode, Enums.FilterControlType[]>;
        static SERVER_TYPES_CONTROL_TYPES_ORDERS: Map<Enums.ServerType, Enums.FilterControlType[]>;
        static CONTROL_TYPES_OPERATORS: Map<Enums.FilterControlType, Enums.Operator>;
        static CONTROL_TYPES_TEXTS: Map<Enums.FilterControlType, string>;
        static CONTROL_TYPES_VALUE_PATTERNS: Map<Enums.FilterControlType, string>;
        protected static serverTypesExtendedFilterMenus: Map<Enums.ServerType, typeof Columns.FilterMenu>;
        static GetServerTypesExtendedFilterMenu(grid: AgGrid, serverType: Enums.ServerType): typeof AgGrids.Columns.FilterMenu;
    }
}
