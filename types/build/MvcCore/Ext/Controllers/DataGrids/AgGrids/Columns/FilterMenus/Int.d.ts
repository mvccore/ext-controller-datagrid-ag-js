declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
    class Int extends FilterMenu {
        static VALUE_TYPE: string;
        Static: typeof Int;
        init(agParams: Interfaces.FilterMenus.IParams<any>): void;
        protected changeValueInputType(index: number, currentControlType: Enums.FilterControlType): this;
    }
}
