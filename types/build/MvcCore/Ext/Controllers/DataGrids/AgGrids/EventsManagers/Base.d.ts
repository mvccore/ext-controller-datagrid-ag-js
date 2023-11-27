declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
    class Base {
        static readonly COLUMN_CHANGES_TIMEOUT = 500;
        Static: typeof Base;
        protected grid: AgGrid;
        protected autoSelectFirstRow: boolean;
        protected handlers: Map<Types.GridEventName, [Types.GridEventHandler, boolean][]>;
        protected onLoadSelectionIndex: number | null;
        protected onLoadSelectionCallback: () => void;
        constructor(grid: AgGrid, serverConfig?: AgGrids.Interfaces.IServerConfig);
        SetAutoSelectFirstRow(autoSelectFirstRow: boolean): this;
        GetAutoSelectFirstRow(): boolean;
        AddEventListener<K extends keyof Interfaces.IHandlersMap>(eventName: Types.GridEventName, handler: (e: Interfaces.IHandlersMap[K]) => void, useTryCatch?: boolean): this;
        RemoveEventListener<K extends keyof Interfaces.IHandlersMap>(eventName: Types.GridEventName, handler: (e: Interfaces.IHandlersMap[K]) => void): this;
        FireHandlers<TGridEventName extends Types.GridEventName>(eventName: TGridEventName, event: DataGrids.AgGrids.Interfaces.IHandlersMap[TGridEventName]): boolean;
        SetOnLoadSelectionIndex(rowIndexToSelectAfterLoad: number, onLoadSelectionCallback?: () => void): this;
        protected static getOperatorByRawValue(rawValue: string, operatorsAndPrefixes: Map<Enums.Operator, string>, columnFilterCfg: number | boolean): [string, Enums.Operator | null];
    }
}
