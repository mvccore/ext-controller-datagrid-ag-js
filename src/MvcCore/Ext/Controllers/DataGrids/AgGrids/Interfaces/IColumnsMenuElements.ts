declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IColumnsMenuElements {
		menuCont: HTMLDivElement;
		openBtn: HTMLAnchorElement;

		form: HTMLFormElement;
		heading: HTMLDivElement;
		controls: HTMLDivElement;
		inputs: Map<string, HTMLInputElement>;
		buttons: HTMLDivElement;
		
		btnApply: HTMLButtonElement;
		btnCancel: HTMLButtonElement;
	}
}