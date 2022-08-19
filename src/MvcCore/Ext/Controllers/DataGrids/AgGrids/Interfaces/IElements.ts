declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IElements {
		contElement: HTMLDivElement;
		agGridElement: HTMLDivElement;
		bottomControlsElement: HTMLDivElement;
		paginationControl: HTMLElement;
		countScalesControl: HTMLElement;
		statusControl: HTMLElement;
		paginationAnchors: HTMLAnchorElement[];
	}
}