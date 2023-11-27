declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers.Events {
    class ModelUpdate extends Base {
        protected newData: boolean;
        protected newPage: boolean;
        protected animate: boolean;
        protected keepRenderedRows: boolean;
        protected keepUndoRedoStack: boolean | null;
        protected agEvent: agGrid.ModelUpdatedEvent<any>;
        constructor(newData: boolean, newPage: boolean, animate: boolean, keepRenderedRows: boolean, keepUndoRedoStack: boolean | null, agEvent: agGrid.ModelUpdatedEvent<any>);
        GetNewData(): boolean;
        GetNewPage(): boolean;
        GetAnimate(): boolean;
        GetKeepRenderedRows(): boolean;
        GetKeepUndoRedoStack(): boolean | null;
        SetNewData(newData: boolean): this;
        SetNewPage(newPage: boolean): this;
        SetAnimate(animate: boolean): this;
        SetKeepRenderedRows(keepRenderedRows: boolean): this;
        SetKeepUndoRedoStack(keepUndoRedoStack: boolean | null): this;
        GetAgEvent(): agGrid.ModelUpdatedEvent<any>;
    }
}
