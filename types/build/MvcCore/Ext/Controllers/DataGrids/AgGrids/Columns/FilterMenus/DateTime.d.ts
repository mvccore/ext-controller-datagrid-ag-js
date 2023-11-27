declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns.FilterMenus {
    class DateTime extends FilterMenu {
        static VALUE_TYPE: string;
        Static: typeof DateTime;
        protected timeZoneOffset: number;
        protected parserArgs: string[] | null;
        protected formatArgs: string[] | null;
        protected serverConfig: Interfaces.IServerConfig;
        init(agParams: Interfaces.FilterMenus.IParams<any>): void;
        protected initParserAndFormatArgs(): void;
        protected changeValueInputType(index: number, currentControlType: Enums.FilterControlType): this;
        protected setValueInput(valueInput: HTMLInputElement, value: string, currentControlType: Enums.FilterControlType): this;
        protected getValueInput(valueInput: HTMLInputElement, currentControlType: Enums.FilterControlType): string;
        protected valueIsValid(value: string): boolean;
    }
}
