declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IFilterMenuSectionEvents {
		handleTypeChange: (index: number, e: Event) => void;
		handleValueChange: (index: number, e: Event) => void;
		handleValueKeyUp: (index: number, e: KeyboardEvent) => void;
		handleAddNextValue: (index: number, e: MouseEvent) => void;
	}
}