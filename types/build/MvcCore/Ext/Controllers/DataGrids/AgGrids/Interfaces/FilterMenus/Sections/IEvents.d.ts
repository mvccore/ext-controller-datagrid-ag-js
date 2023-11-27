declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.FilterMenus.Sections {
    interface IEvents {
        handleTypeChange: (index: number, e: Event) => void;
        handleValueChange: (index: number, e: Event) => void;
        handleValueKeyUp: (index: number, e: KeyboardEvent) => void;
        handleAddNextValue: (index: number, e: MouseEvent) => void;
    }
}
