declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.FilterMenus {
    interface IElements {
        cont: HTMLDivElement;
        sectionsCont: HTMLDivElement;
        sections: Sections.IElements[];
        buttonsCont: HTMLDivElement | null;
        btnApply: HTMLAnchorElement | null;
        btnClear: HTMLAnchorElement | null;
        btnCancel: HTMLAnchorElement | null;
    }
}
