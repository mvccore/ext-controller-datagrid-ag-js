namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class EventsManager {
		public static readonly COLUMN_CHANGES_TIMEOUT = 2000;
		public Static: typeof EventsManager;
		protected grid: AgGrid;
		protected multiSorting: boolean;
		protected multiFiltering: boolean;
		protected defaultAllowedOperators: Map<Enums.Operator, Interfaces.IAllowedOperator>;
		protected columnsAllowedOperators: Map<string, Map<Enums.Operator, Interfaces.IAllowedOperator>>;
		protected helpers: Helpers;
		protected likeOperatorsAndPrefixes: Map<Enums.Operator, string>;
		protected notLikeOperatorsAndPrefixes: Map<Enums.Operator, string>;
		protected columnsChanges: Map<string, Interfaces.IColumnChange>;
		protected columnsChangesTimeout: number;
		protected columnsChangesSending: boolean;
		protected handlers: Map<Types.GridEventName, Types.GridEventHandler[]>;
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			var serverConfig = grid.GetServerConfig();
			this.multiSorting = (
				(serverConfig.sortingMode & Enums.SortingMode.SORT_MULTIPLE_COLUMNS) != 0
			);
			this.multiFiltering = (
				(serverConfig.filteringMode & Enums.FilteringMode.MULTIPLE_COLUMNS) != 0
			);
			this.helpers = grid.GetHelpers();
			this.defaultAllowedOperators = this.helpers.GetAllowedOperators(serverConfig.filteringMode);
			this.columnsAllowedOperators = new Map<string, Map<Enums.Operator, Interfaces.IAllowedOperator>>();
			var columnConfig: Interfaces.IServerConfigs.IColumn,
				columnFilterCfg: number | boolean;
			for (var columnId of Object.keys(serverConfig.columns)) {
				columnConfig = serverConfig.columns[columnId];
				columnFilterCfg = columnConfig.filter;
				if (typeof(columnFilterCfg) === 'number' && columnFilterCfg !== 0) 
					this.columnsAllowedOperators.set(
						columnId, 
						this.helpers.GetAllowedOperators(columnFilterCfg)
					);
			}
			var likeOperatorsArrFilter = new Set<Enums.Operator>([Enums.Operator.LIKE, Enums.Operator.NOT_LIKE]);
			this.likeOperatorsAndPrefixes = new Map<Enums.Operator, string>();
			this.notLikeOperatorsAndPrefixes = new Map<Enums.Operator, string>();
			for (var [operator, prefix] of serverConfig.filterOperatorPrefixes.entries()) {
				if (likeOperatorsArrFilter.has(operator)) {
					this.likeOperatorsAndPrefixes.set(operator, prefix);
				} else {
					this.notLikeOperatorsAndPrefixes.set(operator, prefix);
				}
			}
			this.handlers = new Map<Types.GridEventName, Types.GridEventHandler[]>();
			this.columnsChanges = new Map<string, Interfaces.IColumnChange>();
			this.columnsChangesSending = false;
		}
		public AddEventListener <K extends keyof Interfaces.IGridEvensHandlersMap>(eventName: Types.GridEventName, handler: (e: Interfaces.IGridEvensHandlersMap[K]) => void): this {
			var handlers = this.handlers.has(eventName)
				? this.handlers.get(eventName)
				: [];
			handlers.push(handler);
			this.handlers.set(eventName, handlers);
			return this;
		}
		public RemoveEventListener <K extends keyof Interfaces.IGridEvensHandlersMap>(eventName: Types.GridEventName, handler: (e: Interfaces.IGridEvensHandlersMap[K]) => void): this {
			var handlers = this.handlers.has(eventName)
				? this.handlers.get(eventName)
				: [];
			var newHandlers = [];
			for (var handlersItem of handlers)
				if (handlersItem !== handler)
					newHandlers.push(handlersItem);
			this.handlers.set(eventName, newHandlers);
			return this;
		}
		public FireHandlers (eventName: Types.GridEventName, event: Interfaces.IGridEvent): this {
			if (!this.handlers.has(eventName)) return this;
			var handlers = this.handlers.get(eventName);
			event.grid = this.grid;
			event.eventName = eventName;
			for (var handler of handlers) {
				try {
					handler(event);
				} catch (e) {}
			}
			return this;
		}
		public HandleSelectionChange (event: agGrid.SelectionChangedEvent<any>): void {
			this.FireHandlers("selectionChange", <Interfaces.IGridSelectionChangeEvent>{
				selectedRows: this.grid.GetGridApi().getSelectedRows()
			});
		}
		public HandleColumnResized (event: agGrid.ColumnResizedEvent<any>): void {
			if (event.source !== 'uiColumnDragged' || !event.finished) return;

			if (this.columnsChangesTimeout) 
				clearTimeout(this.columnsChangesTimeout);

			var columnId = event.column.getColId(),
				newWidth = event.column.getActualWidth();

			if (this.columnsChanges.has(columnId)) {
				this.columnsChanges.get(columnId).width = newWidth;
			} else {
				this.columnsChanges.set(columnId, <Interfaces.IColumnChange>{
					width: newWidth
				});
			}

			this.columnsChangesTimeout = setTimeout(
				this.handleColumnChangesSent.bind(this), 
				this.Static.COLUMN_CHANGES_TIMEOUT
			);
		}
		public HandleColumnMoved (event: agGrid.ColumnMovedEvent<any>): void {
			if (this.columnsChangesTimeout) 
				clearTimeout(this.columnsChangesTimeout);

			var columnId = event.column.getColId(),
				columnConfig = this.grid.GetServerConfig().columns[columnId],
				columnsManager = this.grid.GetOptions().GetColumnManager(),
				activeColumnsSorted = columnsManager.GetActiveServerColumnsSorted(),
				allColumnsSorted = columnsManager.GetAllServerColumnsSorted(),
				activeIndexOld = columnConfig.activeColumnIndex,
				activeIndexNex = event.toIndex,
				allIndexOld = columnConfig.columnIndex,
				allIndexNew = allColumnsSorted[activeIndexNex].columnIndex;

			// přehodit reálné all indexy
			var [allColumnCfg] = allColumnsSorted.splice(allIndexOld, 1);
			allColumnsSorted.splice(allIndexNew, 0, allColumnCfg);
			var [activeColumnCfg] = activeColumnsSorted.splice(activeIndexOld, 1);
			activeColumnsSorted.splice(activeIndexNex, 0, activeColumnCfg);
			
			for (var i = 0, l = allColumnsSorted.length; i < l; i++) {
				columnConfig = allColumnsSorted[i]
				columnConfig.columnIndex = i;
				columnId = columnConfig.urlName;
				if (this.columnsChanges.has(columnId)) {
					this.columnsChanges.get(columnId).index = i;
				} else {
					this.columnsChanges.set(columnId, <Interfaces.IColumnChange>{
						index: i
					});
				}
			}
			for (var i = 0, l = activeColumnsSorted.length; i < l; i++)
				activeColumnsSorted[i].activeColumnIndex = i;
				
			columnsManager.SetActiveServerColumnsSorted(activeColumnsSorted);
			columnsManager.SetAllServerColumnsSorted(allColumnsSorted);
			this.grid.GetColumnsMenu().RedrawControls();

			this.columnsChangesTimeout = setTimeout(
				this.handleColumnChangesSent.bind(this), 
				this.Static.COLUMN_CHANGES_TIMEOUT
			);
		}
		protected handleColumnChangesSent (): void {
			if (this.columnsChangesSending) return;
			var plainObj = AgGrids.Helpers.ConvertMap2Object(this.columnsChanges);
			this.columnsChanges = new Map<string, Interfaces.IColumnChange>();
			Ajax.load(<Ajax.LoadConfig>{
				url: this.grid.GetServerConfig().urlColumnsChanges,
				data: { changes: plainObj },
				type: 'json',
				method: 'POST',
				success: this.handleColumnChangesResponse.bind(this),
				error: this.handleColumnChangesResponse.bind(this)
			});
		}
		protected handleColumnChangesResponse (): void {
			this.columnsChangesSending = false;
			if (this.columnsChanges.size === 0) return;
			if (this.columnsChangesTimeout) 
				clearTimeout(this.columnsChangesTimeout);
			this.columnsChangesTimeout = setTimeout(
				this.handleColumnChangesSent.bind(this), 
				this.Static.COLUMN_CHANGES_TIMEOUT
			);
		}

		public HandleFilterMenuChange (columnId: string, filteringItem: Map<Enums.Operator, string[]> | null): void {
			var filtering = this.grid.GetFiltering(),
				filterRemoving = filteringItem == null || filteringItem.size === 0,
				filterHeader = this.grid.GetFilterHeaders().get(columnId),
				filterMenu = this.grid.GetFilterMenus().get(columnId);
			if (filterRemoving) {
				filtering.delete(columnId);
				filterHeader?.SetText(null);
				filterMenu?.SetUpControls(null);
			} else {
				if (!this.multiFiltering)
					filtering = new Map<string, Map<Enums.Operator, string[]>>();
				filtering.set(columnId, filteringItem);
				filterHeader?.SetText(filtering.get(columnId));
				filterMenu?.SetUpControls(filteringItem);
			}
			this.firefiltering(filtering);
		}
		public HandleFilterHeaderChange (columnId: string, rawInputValue: string): void {
			var rawInputIsNull = rawInputValue == null,
				rawInputValue = rawInputIsNull ? '' : rawInputValue.trim(),
				filterRemoving = rawInputValue === '',
				serverConfig = this.grid.GetServerConfig(),
				valuesDelimiter = serverConfig.urlSegments.urlDelimiterValues,
				rawValues = filterRemoving ? [] : rawInputValue.split(valuesDelimiter),
				serverColumnCfg = serverConfig.columns[columnId],
				columnFilterCfg = serverColumnCfg.filter,
				columnFilterCfgInt = Number(columnFilterCfg),
				columnFilterCfgIsInt = columnFilterCfg === columnFilterCfgInt,
				allowedOperators = (columnFilterCfgIsInt && this.columnsAllowedOperators.has(columnId)
					? this.columnsAllowedOperators.get(columnId)
					: this.defaultAllowedOperators),
				columnAllowNullFilter = columnFilterCfgIsInt && (
					(columnFilterCfgInt & Enums.FilteringMode.ALLOW_NULL) != 0
				),
				filterValues: Map<Enums.Operator, string[]>,
				filterOperatorValues: string[],
				operatorsAndPrefixes: Map<Enums.Operator, string>,
				filtering = this.grid.GetFiltering(),
				valueIsStringNull: boolean,
				operator: Enums.Operator,
				operatorCfg: Interfaces.IAllowedOperator;
			if (!filterRemoving) {
				filterValues = new Map<Enums.Operator, string[]>();
				for (var rawValue of rawValues) {
					valueIsStringNull = rawValue.toLowerCase() === 'null';
					// complete possible operator prefixes from submitted value
					operatorsAndPrefixes = this.getOperatorsAndPrefixesByRawValue(rawValue);
					// complete operator value from submitted value
					[rawValue, operator] = this.getOperatorByRawValue(rawValue, operatorsAndPrefixes, columnFilterCfg);
					// check if operator is allowed
					if (operator == null || !allowedOperators.has(operator)) continue;
					// check if operator configuration allowes submitted value form
					operatorCfg = allowedOperators.get(operator);
					if (operatorCfg.regex != null && !rawValue.match(operatorCfg.regex)) continue;
					if (valueIsStringNull) {
						if (columnAllowNullFilter) {
							rawValue = 'null';
						} else {
							continue;
						}
					}
					// set up filtering value
					if (filterValues.has(operator)) {
						filterValues.get(operator).push(rawValue);
					} else {
						filterValues.set(operator, [rawValue]);
					}
					filterOperatorValues = filterValues.get(operator);
					if (!operatorCfg.multiple && filterOperatorValues.length > 1)
						filterValues.set(operator, [filterOperatorValues[0]]);
				}
				if (filterValues.size === 0) {
					filterRemoving = true;
				} else {
					if (!this.multiFiltering)
						filtering = new Map<string, Map<Enums.Operator, string[]>>();
					filtering.set(columnId, filterValues);
				}
			}
			var filterHeader = this.grid.GetFilterHeaders().get(columnId),
				filterMenu = this.grid.GetFilterMenus().get(columnId),
				filteringItem: Map<Enums.Operator, string[]>;
			if (filterRemoving) {
				filtering.delete(columnId);
				filterHeader?.SetText(null);
				filterMenu?.SetUpControls(null);
			} else {
				filteringItem = filtering.get(columnId);
				filterHeader?.SetText(filteringItem);
				filterMenu?.SetUpControls(filteringItem);
			}
			this.firefiltering(filtering);
		}
		public firefiltering (filtering: Map<string, Map<Enums.Operator, string[]>>): this {
			this.grid
				.SetFiltering(filtering)
				.SetTotalCount(null);
			var pageMode = this.grid.GetPageMode();
			if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				var gridOptions = this.grid.GetOptions().GetAgOptions();
				gridOptions.api.onFilterChanged();
			} else if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				var dataSourceMp: AgGrids.DataSources.MultiplePagesMode = this.grid.GetDataSource() as any;
				dataSourceMp.Load();
			}
			this.FireHandlers("filterChange", <Interfaces.IGridFilterChangeEvent>{
				filtering: filtering
			});
			return this;
		}
		public HandleSortChange (columnId: string, direction: AgGrids.Types.SortDirNullable): void {
			var sortRemoving = direction == null,
				sortHeaders = this.grid.GetSortHeaders(),
				newSorting: AgGrids.Types.SortItem[] = [],
				//agColumnsState: agGrid.ColumnState[] = [],
				oldSorting: Types.SortItem[] = [];
			if (sortRemoving) {
				oldSorting = this.grid.GetSorting();
			} else {
				if (this.multiSorting)
					oldSorting = this.grid.GetSorting();
				newSorting.push([columnId, direction]);
			}
			for (var [sortColId, sortDir] of oldSorting) {
				if (sortColId === columnId) continue;
				newSorting.push([sortColId, sortDir]);
			}
			for (var i = 0, sortColId = '', l = newSorting.length; i < l; i++) {
				var [sortColId, sortDir] = newSorting[i];
				if (sortColId === columnId) continue;
				sortHeaders.get(sortColId).SetSequence(i);
			}
			this.grid.SetSorting(newSorting);
			var pageMode = this.grid.GetPageMode();
			if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				var gridOptions = this.grid.GetOptions().GetAgOptions();
				gridOptions.api.onSortChanged();
			} else if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				var dataSourceMp: AgGrids.DataSources.MultiplePagesMode = this.grid.GetDataSource() as any;
				dataSourceMp.Load();
			}
			this.FireHandlers("sortChange", <Interfaces.IGridSortChangeEvent>{
				sorting: newSorting
			});
		}
		public HandleGridSizeChanged (viewPort: boolean, event: agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>): void {
			// get the current grids width
			var gridElm = this.grid.GetOptions().GetElements().agGridElement,
				gridElmParent = gridElm.parentNode as HTMLElement;
			var gridWidth = gridElmParent.offsetWidth;
			// keep track of which columns to hide/show
			var columnsToShow: string[] = [],
				columnsToHide: string[] = [];
			// iterate over all columns (visible or not) and work out
			// now many columns can fit (based on their minWidth)
			var totalColsWidth = 0;
			var allColumns = event.columnApi.getColumns();
			if (allColumns && allColumns.length > 0) {
				for (var i = 0; i < allColumns.length; i++) {
					var column = allColumns[i];
					totalColsWidth += column.getMinWidth() || 0;
					if (totalColsWidth > gridWidth) {
						columnsToHide.push(column.getColId());
					} else {
						columnsToShow.push(column.getColId());
					}
				}
			}
			// show/hide columns based on current grid width
			event.columnApi.setColumnsVisible(columnsToShow, true);
			event.columnApi.setColumnsVisible(columnsToHide, false);
			// fill out any available space to ensure there are no gaps
			event.api.sizeColumnsToFit();
			this.grid.GetColumnsMenu().ResizeControls();
		}
		public AddUrlChangeEvent (): this {
			window.addEventListener('popstate', (e: PopStateEvent): void => {
				if (this.grid.GetHelpers().IsInstanceOfIServerRequestRaw(e.state))
					this.HandleUrlChange(e);
			});
			return this;
		}
		public HandleExecChange (offset: number, sorting: Types.SortItem[], filtering: Map<string, Map<Enums.Operator, string[]>>): void {
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSource,
				reqData = <Interfaces.IServerRequest>{
					offset: offset,
					limit: this.grid.GetServerConfig().itemsPerPage,
					sorting: sorting,
					filtering: filtering,
				},
				reqDataRaw = dataSource.Static.RetypeRequestMaps2Objects(reqData),
				
				oldOffset = this.grid.GetOffset(),
				oldFiltering = JSON.stringify(dataSource.Static.RetypeFilteringMap2Obj(this.grid.GetFiltering())),
				oldSorting = JSON.stringify(this.grid.GetSorting()),
				
				newFiltering = JSON.stringify(reqDataRaw.filtering),
				newSorting = JSON.stringify(sorting);
			
			this.grid
				.SetOffset(offset)
				.SetSorting(sorting)
				.SetFiltering(filtering);

			this.handleUrlChangeSortsFilters(reqData);
			dataSource.ExecRequest(reqDataRaw, true);

			if (oldOffset !== reqData.offset) {
				this.FireHandlers("pageChange", <Interfaces.IGridPageChangeEvent>{
					offset: reqData.offset
				});
			}
			if (oldFiltering !== newFiltering) {
				this.FireHandlers("filterChange", <Interfaces.IGridFilterChangeEvent>{
					filtering: reqData.filtering
				});
			}
			if (oldSorting !== newSorting) {
				this.FireHandlers("sortChange", <Interfaces.IGridSortChangeEvent>{
					sorting: reqData.sorting
				});
			}
		}
		public HandleUrlChange (e: PopStateEvent): void {
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSource,
				reqDataRaw = e.state as Interfaces.IServerRequestRaw,
				oldOffset = this.grid.GetOffset(),
				oldFiltering = JSON.stringify(dataSource.Static.RetypeFilteringMap2Obj(this.grid.GetFiltering())),
				oldSorting = JSON.stringify(this.grid.GetSorting()),
				newFiltering = JSON.stringify(reqDataRaw.filtering),
				newSorting = JSON.stringify(reqDataRaw.sorting),
				reqData = dataSource.Static.RetypeRequestObjects2Maps(reqDataRaw);
			
			this.grid
				.SetOffset(reqData.offset)
				.SetSorting(reqData.sorting)
				.SetFiltering(reqData.filtering);

			this.handleUrlChangeSortsFilters(reqData);
			dataSource.ExecRequest(reqDataRaw, false);

			if (oldOffset !== reqData.offset) {
				this.FireHandlers("pageChange", <Interfaces.IGridPageChangeEvent>{
					offset: reqData.offset
				});
			}
			if (oldFiltering !== newFiltering) {
				this.FireHandlers("filterChange", <Interfaces.IGridFilterChangeEvent>{
					filtering: reqData.filtering
				});
			}
			if (oldSorting !== newSorting) {
				this.FireHandlers("sortChange", <Interfaces.IGridSortChangeEvent>{
					sorting: reqData.sorting
				});
			}
		}
		public HandleResponseLoaded (response: AgGrids.Interfaces.IServerResponse): void {
			this.grid
				.SetOffset(response.offset)
				.SetTotalCount(response.totalCount)
				.SetSorting(response.sorting)
				.SetFiltering(response.filtering);
			for (var [columnId, filterHeader] of this.grid.GetFilterHeaders().entries()) {
				if (response.filtering.has(columnId)) {
					filterHeader.SetText(response.filtering.get(columnId));
				} else {
					filterHeader.SetText(null);
				}
			}
			for (var [columnId, filterMenu] of this.grid.GetFilterMenus().entries()) {
				if (response.filtering.has(columnId)) {
					filterMenu.SetUpControls(response.filtering.get(columnId));
				} else {
					filterMenu.SetUpControls(null);
				}
			}
			var sortHeaders = this.grid.GetSortHeaders(),
				index = 0;
			for (var [columnId, sortDir] of response.sorting) {
				if (sortHeaders.has(columnId)) {
					sortHeaders.get(columnId)
						.SetSequence(index)
						.SetDirection(sortDir);
				}
				index++;
			}
		}
		protected handleUrlChangeSortsFilters (reqData: Interfaces.IServerRequest): this {
			// set up sort headers:
			var sortHeaders = this.grid.GetSortHeaders(),
				activeSortItems = new Map<string, [AgGrids.Types.SortDir, number]>(),
				sequence = 0;
			for (var [columnId, sortDir] of reqData.sorting)
				activeSortItems.set(columnId, [sortDir, sequence++]);
			for (var [columnId, sortHeader] of sortHeaders.entries()) {
				if (activeSortItems.has(columnId)) {
					var [sortDir, sequence] = activeSortItems.get(columnId);
					sortHeader.SetDirection(sortDir).SetSequence(sequence);
				} else {
					sortHeader.SetDirection(null).SetSequence(null);
				}
			}
			// set up filtering inputs:
			var filterInputs = this.grid.GetFilterHeaders();
			for (var [columnId, filterInput] of filterInputs.entries()) {
				if (reqData.filtering.has(columnId)) {
					filterInput?.SetText(reqData.filtering.get(columnId));
				} else {
					filterInput?.SetText(null);
				}
			}
			return this;
		}
		protected getOperatorsAndPrefixesByRawValue (rawValue: string): Map<Enums.Operator, string> {
			var operatorsAndPrefixes: Map<Enums.Operator, string>,
				containsPercentage = this.helpers.CheckFilterValueForLikeChar(rawValue, '%'),
				containsUnderScore = this.helpers.CheckFilterValueForLikeChar(rawValue, '_');
			if (containsPercentage || containsUnderScore) {
				if ((containsPercentage & 1) !== 0 || (containsUnderScore & 1) !== 0) {
					operatorsAndPrefixes = this.likeOperatorsAndPrefixes;
				} else {
					operatorsAndPrefixes = this.notLikeOperatorsAndPrefixes;
				}
			} else {
				operatorsAndPrefixes = this.notLikeOperatorsAndPrefixes;
			}
			return operatorsAndPrefixes;
		}
		protected getOperatorByRawValue (
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