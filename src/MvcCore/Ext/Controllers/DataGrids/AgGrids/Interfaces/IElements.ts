declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IElements {
		contElement: HTMLDivElement;
		agGridElement: HTMLDivElement;
		bottomControlsElement: HTMLDivElement;
		pagingControl: HTMLElement;
		countScalesControl: HTMLElement;
		statusControl: HTMLElement;
		pagingAnchors: HTMLAnchorElement[];
	}
}