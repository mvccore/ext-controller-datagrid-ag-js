declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs {
    interface IColumn {
        propName: string;
        headingName: string;
        urlName: string;
        types: string[];
        parserArgs: any[];
        formatArgs: any[];
        idColumn: boolean | null;
        cssClasses: string[];
        filter: number | false;
        sort: number | boolean;
        viewHelper: string | null;
        width: number | string | null;
        maxWidth: number | string | null;
        minWidth: number | string | null;
        flex: number | string | null;
        columnIndex: number | null;
        columnIndexUser: number | null;
        columnIndexActive: number | null;
        title: string | null;
        editable: boolean | null;
        disabled: boolean | null;
    }
    type IColumnIndexes = Pick<IColumn, "columnIndex" | "columnIndexUser" | "columnIndexActive">;
}
