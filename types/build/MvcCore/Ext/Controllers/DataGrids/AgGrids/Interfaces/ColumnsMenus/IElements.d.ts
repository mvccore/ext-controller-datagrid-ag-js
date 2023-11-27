declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.ColumnsMenus {
    interface IElements {
        menuCont: HTMLDivElement;
        openBtn: HTMLAnchorElement;
        form: HTMLFormElement;
        heading: HTMLDivElement;
        controls: HTMLDivElement;
        inputs: Map<string, HTMLInputElement>;
        hidden: HTMLInputElement;
        buttons: HTMLDivElement;
        btnApply: HTMLButtonElement;
        btnCancel: HTMLButtonElement;
    }
}
