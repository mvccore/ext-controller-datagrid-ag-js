declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class ColumnsVisibilityChange extends Base {
        protected columnsVisibilityForm: HTMLFormElement;
        constructor(columnsVisibilityForm: HTMLFormElement);
        SetColumnsVisibilityForm(columnsVisibilityForm: HTMLFormElement): this;
        GetColumnsVisibilityForm(): HTMLFormElement;
    }
}
