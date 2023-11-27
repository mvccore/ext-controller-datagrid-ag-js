declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
    class Money extends FilterMenu {
        static VALUE_TYPE: string;
        Static: typeof Money;
        protected parserArgs: string[] | null;
        protected formatArgs: string[] | null;
        protected step: string;
        init(agParams: Interfaces.FilterMenus.IParams<any>): void;
        protected changeValueInputType(index: number, currentControlType: Enums.FilterControlType): this;
    }
}
