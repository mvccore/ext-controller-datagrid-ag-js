declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IFilterMenuElements {
		cont: HTMLDivElement;
		sectionsCont: HTMLDivElement;
		sections: IFilterMenuSectionElements[];
		buttonsCont: HTMLDivElement | null;
		btnApply: HTMLAnchorElement | null;
		btnClear: HTMLAnchorElement | null;
		btnCancel: HTMLAnchorElement | null;
	}
}