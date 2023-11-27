declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Types {
    type SortDir = 0 | 1;
    type SortDirNullable = SortDir | null;
    type SortItem = [string, SortDir];
    type SortItemNullable = [string, SortDirNullable];
}
