namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.EventsManagers {
	export class Base {
		public static readonly COLUMN_CHANGES_TIMEOUT = 500;
		public Static: typeof Base;
		protected grid: AgGrid;
		protected autoSelectFirstRow: boolean;
		protected handlers: Map<Types.GridEventName, [Types.GridEventHandler, boolean][]>;
		protected onLoadSelectionIndex: number | null = null;
		protected onLoadSelectionCallback: () => void = null;
		public constructor (grid: AgGrid, serverConfig: AgGrids.Interfaces.IServerConfig = null) {
			this.Static = new.target;
			this.grid = grid;
			this.autoSelectFirstRow = (
				(serverConfig.rowSelection & AgGrids.Enums.RowSelection.ROW_SELECTION_AUTOSELECT_FIRST) != 0
			);
		}
		public SetAutoSelectFirstRow (autoSelectFirstRow: boolean): this {
			this.autoSelectFirstRow = autoSelectFirstRow;
			return this;
		}
		public GetAutoSelectFirstRow (): boolean {
			return this.autoSelectFirstRow;
		}
		public AddEventListener <K extends keyof Interfaces.IHandlersMap>(eventName: Types.GridEventName, handler: (e: Interfaces.IHandlersMap[K]) => void, useTryCatch: boolean = false): this {
			var handlers = this.handlers.has(eventName)
				? this.handlers.get(eventName)
				: [];
			handlers.push([handler, useTryCatch]);
			this.handlers.set(eventName, handlers);
			return this;
		}
		public RemoveEventListener <K extends keyof Interfaces.IHandlersMap>(eventName: Types.GridEventName, handler: (e: Interfaces.IHandlersMap[K]) => void): this {
			var handlers = this.handlers.has(eventName)
				? this.handlers.get(eventName)
				: [];
			var newHandlers: [Types.GridEventHandler, boolean][] = [];
			for (var [handlersItem, useTryCatchLocal] of handlers)
				if (handlersItem !== handler)
					newHandlers.push([handlersItem, useTryCatchLocal]);
			this.handlers.set(eventName, newHandlers);
			return this;
		}
		public FireHandlers <TGridEventName extends Types.GridEventName>(eventName: TGridEventName, event: DataGrids.AgGrids.Interfaces.IHandlersMap[TGridEventName]): boolean {
			var continueNextEvents = true;
			if (!this.handlers.has(eventName)) 
				return continueNextEvents;
			var handlers = this.handlers.get(eventName);
			event.SetGrid(this.grid).SetEventName(eventName);
			for (var [handler, useTryCatch] of handlers) {
				if (useTryCatch) {
					try {
						handler(event);
						if (event.GetStopNextEventsPropagation())  {
							continueNextEvents = false;
							break;
						} else if (event.GetStopCurrentEventPropagation()) {
							break;
						}
					} catch (e) {}
				} else {
					handler(event);
					if (event.GetStopNextEventsPropagation())  {
						continueNextEvents = false;
						break;
					} else if (event.GetStopCurrentEventPropagation()) {
						break;
					}
				}
			}
			return continueNextEvents;
		}
		public SetOnLoadSelectionIndex (rowIndexToSelectAfterLoad: number, onLoadSelectionCallback: () => void = null): this {
			this.onLoadSelectionIndex = rowIndexToSelectAfterLoad;
			this.onLoadSelectionCallback = onLoadSelectionCallback;
			return this;
		}

		protected static getOperatorByRawValue (
			rawValue: string, 
			operatorsAndPrefixes: Map<Enums.Operator, string>, 
			columnFilterCfg: number | boolean
		): [string, Enums.Operator | null] {
			var operator: Enums.Operator = null,
				columnFilterCfgInt = Number(columnFilterCfg),
				columnFilterCfgIsInt = columnFilterCfg === columnFilterCfgInt,
				columnFilterCfgIsBool = !columnFilterCfgIsInt;
			for (var [operatorKey, valuePrefix] of operatorsAndPrefixes.entries()) {
				var valuePrefixLen = valuePrefix.length;
				if (valuePrefixLen > 0) {
					var valuePrefixChars = rawValue.substring(0, valuePrefixLen);
					if (valuePrefixChars === valuePrefix) {
						operator = operatorKey;
						rawValue = rawValue.substring(valuePrefixLen);
						break;
					}
				} else {
					if (
						(columnFilterCfgIsBool && columnFilterCfg) ||
						(columnFilterCfgIsInt && columnFilterCfgInt & Enums.FilteringMode.ALLOW_EQUALS) != 0
					) {
						operator = operatorKey;
					} else if (
						(columnFilterCfgInt & Enums.FilteringMode.ALLOW_LIKE_ANYWHERE) != 0 ||
						(columnFilterCfgInt & Enums.FilteringMode.ALLOW_LIKE_RIGHT_SIDE) != 0 ||
						(columnFilterCfgInt & Enums.FilteringMode.ALLOW_LIKE_LEFT_SIDE) != 0
					) {
						operator = Enums.Operator.LIKE;
					}
					break;
				}
			}
			return [rawValue, operator];
		}
	}
}