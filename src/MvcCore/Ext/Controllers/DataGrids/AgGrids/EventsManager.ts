namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class EventsManager extends AgGrids.EventsManagers.Base {
		public Static: typeof EventsManager;
		
		protected multiSorting: boolean;
		protected multiFiltering: boolean;
		protected defaultAllowedOperators: Map<Enums.Operator, Interfaces.SortHeaders.IAllowedOperator>;
		protected columnsAllowedOperators: Map<string, Map<Enums.Operator, Interfaces.SortHeaders.IAllowedOperator>>;
		protected helpers: Tools.Helpers;
		protected likeOperatorsAndPrefixes: Map<Enums.Operator, string>;
		protected notLikeOperatorsAndPrefixes: Map<Enums.Operator, string>;
		protected columnsChanges: Map<string, Interfaces.EventArgs.IColumnChange>;
		protected columnsActualWidths: Map<string, number>;
		protected columnsChangesTimeout: number;
		protected columnsChangesSending: boolean;
		protected automaticSelectionChange: boolean = false;
		protected internalColumnMove: boolean = false;
		protected gridWidth: number | null = null;
		protected gridHeight: number | null = null;
		protected docTitleChange: boolean;
		public constructor (grid: AgGrid, serverConfig: AgGrids.Interfaces.IServerConfig = null) {
			super(grid, serverConfig = grid.GetServerConfig());
			this.multiSorting = (
				(serverConfig.sortingMode & Enums.SortingMode.SORT_MULTIPLE_COLUMNS) != 0
			);
			this.multiFiltering = (
				(serverConfig.filteringMode & Enums.FilteringMode.MULTIPLE_COLUMNS) != 0
			);
			this.helpers = grid.GetHelpers();
			this.defaultAllowedOperators = this.helpers.GetAllowedOperators(serverConfig.filteringMode);
			this.columnsAllowedOperators = new Map<string, Map<Enums.Operator, Interfaces.SortHeaders.IAllowedOperator>>();
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
			this.handlers = new Map<Types.GridEventName, [Types.GridEventHandler, boolean][]>();
			this.columnsChanges = new Map<string, Interfaces.EventArgs.IColumnChange>();
			this.columnsChangesSending = false;
			this.docTitleChange = serverConfig.clientTitleTemplate != null;
		}
		public HandleBodyScroll (event: agGrid.BodyScrollEvent<any>): void {
			this.FireHandlers("bodyScroll", new EventsManagers.Events.GridBodyScroll(
				event.left, event.top, event.direction, event
			));
		}
		public HandleModelUpdated (event: agGrid.ModelUpdatedEvent<any>): void {
			//console.log("onModelUpdated", this.onLoadSelectionIndex)
			if (this.onLoadSelectionIndex != null) {
				var nextIndex = this.onLoadSelectionIndex,
					nextRow = event.api.getDisplayedRowAtIndex(nextIndex);
				//this.grid.SetSelectedRowNodes([nextRow], null);
				if (nextRow.data == null) {
					//console.log("onModelUpdated1", nextIndex, nextRow.data);
				} else {
					//console.log("onModelUpdated2", nextIndex, nextRow.data);
					this.automaticSelectionChange = true;
					nextRow.setSelected(true);
					if (this.onLoadSelectionCallback) {
						this.onLoadSelectionCallback();
						this.onLoadSelectionCallback = null;
					}
					this.onLoadSelectionIndex = null;
				}
			}
			this.FireHandlers('modelUpdate', new EventsManagers.Events.ModelUpdate(
				event.newData, event.newPage, event.animate, 
				event.keepRenderedRows, event.keepUndoRedoStack, event
			));
		}
		public HandleRowDataUpdated (event: agGrid.RowDataUpdatedEvent<any>): void {
			//console.log("onRowDataUpdated", this.onLoadSelectionIndex)
			if (this.onLoadSelectionIndex != null) {
				var nextIndex = this.onLoadSelectionIndex,
					nextRow = event.api.getDisplayedRowAtIndex(nextIndex);
				//this.grid.SetSelectedRowNodes([nextRow], null);
				if (nextRow.data == null) {
					//console.log("onModelUpdated1", nextIndex, nextRow.data);
				} else {
					//console.log("onModelUpdated2", nextIndex, nextRow.data);
					this.automaticSelectionChange = true;
					nextRow.setSelected(true);
					if (this.onLoadSelectionCallback) {
						this.onLoadSelectionCallback();
						this.onLoadSelectionCallback = null;
					}
					this.onLoadSelectionIndex = null;
				}
			}
			this.FireHandlers('rowDataUpdate', new EventsManagers.Events.RowDataUpdate(
				event
			));
		}
		public SelectRowByIndex (rowIndex: number, onLoadSelectionCallback: () => void = null): this {
			var gridApi = this.grid.GetGridApi();
			if (this.autoSelectFirstRow) {
				var row = gridApi.getDisplayedRowAtIndex(rowIndex);
				if (row != null) {
					this.grid.SetSelectedRowNodes([row], null);
					if (row.data == null) {
						this.SetOnLoadSelectionIndex(rowIndex, onLoadSelectionCallback);
					} else {
						this.automaticSelectionChange = true;
						row.setSelected(true);
					}
				} else {
					var selectedRowNodesBefore = this.grid.GetSelectedRowNodes();
					if (selectedRowNodesBefore.length > 0) {
						this.grid.SetSelectedRowNodes([], null);
						this.FireHandlers("selectionChange", new EventsManagers.Events.SelectionChange(
							false, selectedRowNodesBefore, []
						));
					}
				}
			} else {
				var selectedRowNodesBefore = this.grid.GetSelectedRowNodes();
				if (selectedRowNodesBefore.length > 0) {
					this.grid.SetSelectedRowNodes([], null);
					this.FireHandlers("selectionChange", new EventsManagers.Events.SelectionChange(
						false, selectedRowNodesBefore, []
					));
				}
			}
			return this;
		}
		public HandleGridReady (event: agGrid.GridReadyEvent<any>): void {
			this.FireHandlers("gridReady", new EventsManagers.Events.Base());
		}
		public HandleSelectionChange (event: agGrid.SelectionChangedEvent<any>): void {
			if (this.grid.GetInternalSelectionChange()) return;
			var userChange = !this.automaticSelectionChange;
			this.automaticSelectionChange = false;
			var gridApi = this.grid.GetGridApi(),
				selectedRowsBefore = this.grid.GetSelectedRowNodes(),
				selectedRowsAfter = gridApi.getSelectedNodes(),
				selectionchangeEvent = new EventsManagers.Events.SelectionChange(
					userChange, selectedRowsBefore, selectedRowsAfter
				);
			var continueToNextEvent = this.FireHandlers("beforeSelectionChange", selectionchangeEvent);
			if (continueToNextEvent) {
				this.grid.SetSelectedRowNodes(selectedRowsAfter, null);
				this.FireHandlers("selectionChange", selectionchangeEvent);
			} else {
				this.grid.SetSelectedRowNodes(selectedRowsBefore, false);
			}
		}
		public HandleColumnResized (event: agGrid.ColumnResizedEvent<any>): void {
			if (event.source !== 'uiColumnDragged' || !event.finished) return;

			var columnId = event.column.getColId(),
				newWidth = event.column.getActualWidth(),
				resizeEvent = new EventsManagers.Events.ColumnResize(
					columnId, newWidth, event
				);

			var continueToNextEvent = this.FireHandlers("beforeColumnResize", resizeEvent);
			if (continueToNextEvent === false) {
				event.column.setActualWidth(this.columnsActualWidths.get(columnId), "uiColumnResized", false);
				event.api.sizeColumnsToFit();
				return;
			}
			this.columnsActualWidths.set(columnId, newWidth);

			if (this.columnsChangesTimeout) 
				clearTimeout(this.columnsChangesTimeout);

			newWidth = resizeEvent.GetNewWidth();

			if (this.columnsChanges.has(columnId)) {
				this.columnsChanges.get(columnId).width = newWidth;
			} else {
				this.columnsChanges.set(columnId, <Interfaces.EventArgs.IColumnChange>{
					width: newWidth
				});
			}

			this.columnsChangesTimeout = setTimeout(
				this.handleColumnChangesSent.bind(this), 
				this.Static.COLUMN_CHANGES_TIMEOUT
			);

			this.FireHandlers("columnResize", resizeEvent);
		}
		public HandleColumnMoved (event: agGrid.ColumnMovedEvent<any>): void {
			if (this.internalColumnMove) {
				this.internalColumnMove = false;
				return;
			}

			var columnId = event.column.getColId(),
				columnConfig = this.grid.GetServerConfig().columns[columnId],
				moveEvent = new EventsManagers.Events.ColumnMove(
					columnId, event.toIndex, event
				);

			var continueToNextEvent = this.FireHandlers("beforeColumnMove", moveEvent);
			if (continueToNextEvent === false) {
				this.internalColumnMove = true;
				event.columnApi.moveColumnByIndex(event.toIndex, columnConfig.columnIndexActive);
				return;
			}

			if (this.columnsChangesTimeout) 
				clearTimeout(this.columnsChangesTimeout);

			var columnsManager = this.grid.GetOptionsManager().GetColumnManager(),
				activeColumnsSorted = columnsManager.GetServerColumnsSortedActive(),
				allColumnsSorted = columnsManager.GetServerColumnsUserSortedAll(),
				activeIndexOld = columnConfig.columnIndexActive,
				activeIndexNext = moveEvent.GetToIndex(),
				allIndexOld = columnConfig.columnIndexUser,
				allIndexNew = 0;
			if (activeIndexNext < activeIndexOld) {
				allIndexNew = allIndexOld - 1;
			} else {
				allIndexNew = allIndexOld + 1;
			}

			var [allColumnCfg] = allColumnsSorted.splice(allIndexOld, 1);
			allColumnsSorted.splice(allIndexNew, 0, allColumnCfg);
			var [activeColumnCfg] = activeColumnsSorted.splice(activeIndexOld, 1);
			activeColumnsSorted.splice(activeIndexNext, 0, activeColumnCfg);

			for (var i = 0, l = allColumnsSorted.length; i < l; i++) {
				columnConfig = allColumnsSorted[i]
				columnConfig.columnIndexUser = i;
				columnId = columnConfig.urlName;
				if (this.columnsChanges.has(columnId)) {
					this.columnsChanges.get(columnId).index = i;
				} else {
					this.columnsChanges.set(columnId, <Interfaces.EventArgs.IColumnChange>{
						index: i
					});
				}
			}

			for (var i = 0, l = activeColumnsSorted.length; i < l; i++)
				activeColumnsSorted[i].columnIndexActive = i;

			columnsManager.SetServerColumnsSortedActive(activeColumnsSorted);
			columnsManager.SetServerColumnsSortedAll(allColumnsSorted);
			this.grid.GetColumnsVisibilityMenu().RedrawControls();

			this.columnsChangesTimeout = setTimeout(
				this.handleColumnChangesSent.bind(this), 
				this.Static.COLUMN_CHANGES_TIMEOUT
			);

			this.FireHandlers("columnMove", moveEvent);
		}
		public GetNewFilteringByMenu (columnId: string, filteringItem: Map<Enums.Operator, string[]> | null, clearAllOther: boolean = false): [boolean, Map<string, Map<Enums.Operator, string[]>>] {
			var filteringBefore = this.grid.GetFiltering(),
				filteringAfter = this.helpers.CloneFiltering(filteringBefore),
				filterRemoving = filteringItem == null || filteringItem.size === 0;
			if (filterRemoving) {
				if (clearAllOther) {
					filteringAfter = new Map<string, Map<Enums.Operator, string[]>>();
				} else {
					filteringAfter.delete(columnId);
				}
			} else {
				if (!this.multiFiltering || clearAllOther)
					filteringAfter = new Map<string, Map<Enums.Operator, string[]>>();
				filteringAfter.set(columnId, filteringItem);
			}
			return [filterRemoving, filteringAfter];
		}
		public HandleFilterMenuChange (columnId: string, filterRemoving: boolean, filteringBefore: Map<string, Map<Enums.Operator, string[]>>, filteringAfter: Map<string, Map<Enums.Operator, string[]>>): void {
			var filterHeader = this.grid.GetFilterHeaders().get(columnId),
				filterMenu = this.grid.GetFilterMenus().get(columnId);
			if (filterRemoving) {
				filterHeader?.SetText(null);
				filterMenu?.SetUpControls(null);
			} else {
				var filteringItem = filteringAfter.get(columnId);
				filterHeader?.SetText(filteringItem);
				filterMenu?.SetUpControls(filteringItem);
			}
			this.firefiltering(filteringBefore, filteringAfter);
		}
		public GetNewFilteringByHeader (columnId: string, rawInputValue: string, clearAllOther: boolean = false): [boolean, Map<string, Map<Enums.Operator, string[]>>] {
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
				filteringBefore = this.grid.GetFiltering(),
				filteringAfter = this.helpers.CloneFiltering(filteringBefore),
				valueIsStringNull: boolean,
				operator: Enums.Operator,
				operatorCfg: Interfaces.SortHeaders.IAllowedOperator;
			if (!filterRemoving) {
				filterValues = new Map<Enums.Operator, string[]>();
				for (var rawValue of rawValues) {
					valueIsStringNull = rawValue.toLowerCase() === 'null';
					// complete possible operator prefixes from submitted value
					operatorsAndPrefixes = this.getOperatorsAndPrefixesByRawValue(rawValue);
					// complete operator value from submitted value
					[rawValue, operator] = this.Static.getOperatorByRawValue(rawValue, operatorsAndPrefixes, columnFilterCfg);
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
					if (!this.multiFiltering || clearAllOther)
						filteringAfter = new Map<string, Map<Enums.Operator, string[]>>();
					filteringAfter.set(columnId, filterValues);
				}
			}
			if (filterRemoving) {
				if (clearAllOther) {
					filteringAfter = new Map<string, Map<Enums.Operator, string[]>>();
				} else {
					filteringAfter.delete(columnId);
				}
			}
			return [filterRemoving, filteringAfter];
		}
		public HandleFilterHeaderChange (columnId: string, filterRemoving: boolean, filteringBefore: Map<string, Map<Enums.Operator, string[]>>, filteringAfter: Map<string, Map<Enums.Operator, string[]>>): void {
			var filterHeader = this.grid.GetFilterHeaders().get(columnId),
				filterMenu = this.grid.GetFilterMenus().get(columnId),
				filteringItem: Map<Enums.Operator, string[]>;
			if (filterRemoving) {
				filterHeader?.SetText(null);
				filterMenu?.SetUpControls(null);
			} else {
				filteringItem = filteringAfter.get(columnId);
				filterHeader?.SetText(filteringItem);
				filterMenu?.SetUpControls(filteringItem);
			}
			this.firefiltering(filteringBefore, filteringAfter);
		}
		public GetNewSorting (columnId: string, direction: AgGrids.Types.SortDirNullable): AgGrids.Types.SortItem[] {
			var sortRemoving = direction == null,
				newSorting: AgGrids.Types.SortItem[] = [],
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
			return newSorting;
		}
		public HandleSortChange (sortingBefore: AgGrids.Types.SortItem[], sortingAfter: AgGrids.Types.SortItem[]): void {
			var sortHeaders = this.grid.GetSortHeaders(),
				columnId: string;
			for (var i = 0, sortColId = '', l = sortingAfter.length; i < l; i++) {
				var [sortColId] = sortingAfter[i];
				if (sortColId === columnId) continue;
				sortHeaders.get(sortColId).SetSequence(i);
			}
			this.grid.SetSorting(sortingAfter);
			var pageMode = this.grid.GetPageMode();
			if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				var gridOptionsManager = this.grid.GetOptionsManager().GetAgOptions();
				gridOptionsManager.api.onSortChanged();
			} else if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				var dataSourceMp: AgGrids.DataSources.MultiplePagesMode = this.grid.GetDataSource() as any;
				dataSourceMp.Load();
			}
			this.FireHandlers("sortChange", new EventsManagers.Events.SortChange(
				sortingBefore, sortingAfter
			));
		}
		public HandleGridSizeChanged (viewPort: boolean, event: agGrid.ViewportChangedEvent<any> | agGrid.GridSizeChangedEvent<any>): void {
			// get the current grids width
			var gridElm = this.grid.GetOptionsManager().GetElements().agGridElement,
				gridElmParent = gridElm.parentNode as HTMLElement,
				gridWidth = gridElmParent.offsetWidth,
				gridHeight = gridElmParent.offsetHeight,
				gridSizeChange = this.gridWidth !== gridWidth || this.gridHeight !== gridHeight;
			/*if (this.gridWidth == null && this.gridHeight == null) {
				this.gridWidth = gridWidth;
				this.gridHeight = gridHeight;
				return;
			}*/
			if (!gridSizeChange) return;
			this.gridWidth = gridWidth;
			this.gridHeight = gridHeight;
			// keep track of which columns to hide/show
			var columnsToShow: string[] = [],
				columnsToHide: string[] = [],
				totalColsWidth = 0,
				allColumns = event.columnApi.getColumns(),
				column: agGrid.Column,
				columnId: string;
				// iterate over all columns (visible or not) and work out
				// now many columns can fit (based on their minWidth)
			this.columnsActualWidths = new Map<string, number>();
			if (allColumns && allColumns.length > 0) {
				for (var i = 0; i < allColumns.length; i++) {
					column = allColumns[i];
					columnId = column.getColId();
					this.columnsActualWidths.set(columnId, column.getActualWidth());
					totalColsWidth += column.getMinWidth() || 0;
					if (totalColsWidth > this.gridWidth) {
						columnsToHide.push(columnId);
					} else {
						columnsToShow.push(columnId);
					}
				}
			}
			// show/hide columns based on current grid width
			event.columnApi.setColumnsVisible(columnsToShow, true);
			event.columnApi.setColumnsVisible(columnsToHide, false);
			// fill out any available space to ensure there are no gaps
			event.api.sizeColumnsToFit();
			this.grid.GetColumnsVisibilityMenu().ResizeControls();
			this.FireHandlers("gridSizeChange", new EventsManagers.Events.GridSizeChange(
				gridWidth, gridHeight, event
			));
		}
		public AddRefreshEvent (): this {
			if (!this.grid.GetServerConfig().renderConfig.renderControlRefresh) return this;
			var optsMgr = this.grid.GetOptionsManager(),
				refreshAnchor = optsMgr.GetElements().refreshAnchor,
				loadingCls = optsMgr.Static.SELECTORS.BOTTOM_CONTROLS.REFRESH_ANCHOR_LOADING_CLS;
			refreshAnchor.addEventListener('click', e => {this.handleRefreshClick(refreshAnchor, loadingCls, e);});
			return this;
		}
		public AddUrlChangeEvent (): this {
			window.addEventListener('popstate', (e: PopStateEvent): void => {
				if (this.grid.GetHelpers().IsInstanceOfIServerRequestRaw(e.state))
					this.HandleUrlChange(e);
			}, true);
			return this;
		}
		public HandleExecChange (offset: number | false | null = null, sorting: Types.SortItem[] | false | null = null, filtering: Map<string, Map<Enums.Operator, string[]>> | false | null = null): void {
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSource,
				sortingBefore = this.grid.GetSorting(),
				sortingAfter: Types.SortItem[],
				filteringBefore = this.grid.GetFiltering(),
				filteringAfter: Map<string, Map<Enums.Operator, string[]>>;
			if (offset === false) {
				offset = 0;
			} else if (offset == null) {
				offset = this.grid.GetOffset();
			}
			if (sorting == false) {
				sortingAfter = [];
			} else if (sorting == null) {
				sortingAfter = [].slice.apply(sortingBefore) as Types.SortItem[];
			} else {
				sortingAfter = sorting;
			}
			if (filtering === false) {
				filteringAfter = new Map<string, Map<Enums.Operator, string[]>>();
			} else if (filtering == null) {
				filteringAfter = this.helpers.CloneFiltering(filteringBefore);
			} else {
				filteringAfter = filtering;
			}
			var reqData = <Interfaces.Ajax.IRequest>{
					offset: offset,
					limit: this.grid.GetLimit(),
					sorting: sortingAfter,
					filtering: filteringAfter,
				},
				reqDataRaw = this.helpers.RetypeRequestMaps2Objects(reqData),
				offsetBefore = this.grid.GetOffset(),
				oldFilteringStr = JSON.stringify(this.helpers.RetypeFilteringMap2Obj(filteringBefore)),
				oldSortingStr = JSON.stringify(sortingBefore),
				newFilteringStr = JSON.stringify(reqDataRaw.filtering),
				newSortingStr = JSON.stringify(sortingAfter),
				offsetChange = offsetBefore !== offset,
				filteringChange = oldFilteringStr !== newFilteringStr,
				sortingChange = oldSortingStr !== newSortingStr;

			if (offsetChange) {
				var pagingAnchorsMaps = this.grid.GetOptionsManager().GetElements().pagingAnchorsMaps;
				var offsetPagingAnchor = pagingAnchorsMaps.has(offset)
					? pagingAnchorsMaps.get(offset)[0]
					: null;
				var continueToNextEvents = this.FireHandlers(
					"beforePageChange", new EventsManagers.Events.PageChange(
						offsetBefore, offset, offsetPagingAnchor
					)
				);
				if (continueToNextEvents === false) return;
			}
			if (filteringChange) {
				var continueToNextEvents = this.FireHandlers(
					"beforeFilterChange", new EventsManagers.Events.FilterChange(
						filteringBefore, filteringAfter
					)
				);
				if (continueToNextEvents === false) return;
			}
			if (sortingChange) {
				var continueToNextEvents = this.FireHandlers(
					"beforeSortChange", new EventsManagers.Events.SortChange(
						sortingBefore, sortingAfter
					)
				);
				if (continueToNextEvents === false) return;
			}

			this.grid
				.SetOffset(offset)
				.SetSorting(sortingAfter)
				.SetFiltering(filteringAfter);

			this.handleUrlChangeSortsFilters(reqData);
			dataSource.ExecRequest(reqDataRaw, true);

			if (offsetChange)
				this.FireHandlers("pageChange", new EventsManagers.Events.PageChange(
					offsetBefore, offset, offsetPagingAnchor
				));
			if (filteringChange)
				this.FireHandlers("filterChange", new EventsManagers.Events.FilterChange(
					filteringBefore, filteringAfter
				));
			if (sortingChange)
				this.FireHandlers("sortChange", new EventsManagers.Events.SortChange(
					sortingBefore, sortingAfter
				));
		}
		public HandleUrlChange (e: PopStateEvent): void {
			var dataSource = this.grid.GetDataSource() as AgGrids.DataSource,
				sortingBefore = this.grid.GetSorting(),
				filteringBefore = this.grid.GetFiltering(),
				reqDataRaw = e.state as Interfaces.Ajax.IReqRawObj,
				reqData = this.helpers.RetypeRequestObjects2Maps(reqDataRaw),
				offsetBefore = this.grid.GetOffset(),
				offsetAfter = reqData.offset,
				oldFilteringStr = JSON.stringify(this.helpers.RetypeFilteringMap2Obj(filteringBefore)),
				oldSortingStr = JSON.stringify(sortingBefore),
				sortingAfter = reqData.sorting,
				filteringAfter = reqData.filtering,
				newFilteringStr = JSON.stringify(reqDataRaw.filtering),
				newSortingStr = JSON.stringify(sortingAfter),
				offsetChange = offsetBefore !== offsetAfter,
				filteringChange = oldFilteringStr !== newFilteringStr,
				sortingChange = oldSortingStr !== newSortingStr;
			
			var continueToNextEvents = this.FireHandlers(
				"beforeHistoryChange", new EventsManagers.Events.HistoryChange(
					offsetBefore, offsetAfter, 
					sortingBefore, sortingAfter,
					filteringBefore, filteringAfter
				)
			);
			if (continueToNextEvents === false) {
				var dataSource = this.grid.GetDataSource();
				var [stateData, url, page, count] = dataSource.GetLastHistory();
				dataSource.BrowserHistoryPush(stateData, url, page, count);
				e.preventDefault();
				e.stopPropagation();
				return;
			}

			if (this.docTitleChange)
				document.title = reqDataRaw.title;
			
			if (offsetChange) {
				var pagingAnchorsMaps = this.grid.GetOptionsManager().GetElements().pagingAnchorsMaps;
				var offsetPagingAnchor = pagingAnchorsMaps.has(offsetAfter)
					? pagingAnchorsMaps.get(offsetAfter)[0]
					: null;
				var continueToNextEvents = this.FireHandlers(
					"beforePageChange", new EventsManagers.Events.PageChange(
						offsetBefore, offsetAfter, offsetPagingAnchor
					)
				);
				if (continueToNextEvents === false) return;
			}
			if (filteringChange) {
				var continueToNextEvents = this.FireHandlers(
					"beforeFilterChange", new EventsManagers.Events.FilterChange(
						filteringBefore, filteringAfter
					)
				);
				if (continueToNextEvents === false) return;
			}
			if (sortingChange) {
				var continueToNextEvents = this.FireHandlers(
					"beforeSortChange", new EventsManagers.Events.SortChange(
						sortingBefore, sortingAfter
					)
				);
				if (continueToNextEvents === false) return;
			}

			this.grid
				.SetOffset(offsetAfter)
				.SetSorting(sortingAfter)
				.SetFiltering(filteringAfter);

			this.handleUrlChangeSortsFilters(reqData);
			dataSource.ExecRequest(reqDataRaw, false);
			this.grid.GetColumnsVisibilityMenu().UpdateFormAction(reqDataRaw.path);

			var continueToNextEvents = this.FireHandlers(
				"historyChange", new EventsManagers.Events.HistoryChange(
					offsetBefore, offsetAfter, 
					sortingBefore, sortingAfter,
					filteringBefore, filteringAfter
				)
			);
			if (continueToNextEvents === false) return;

			if (offsetChange)
				this.FireHandlers("pageChange", new EventsManagers.Events.PageChange(
					offsetBefore, offsetAfter, offsetPagingAnchor
				));
			if (filteringChange)
				this.FireHandlers("filterChange", new EventsManagers.Events.FilterChange(
					filteringBefore, filteringAfter
				));
			if (sortingChange)
				this.FireHandlers("sortChange", new EventsManagers.Events.SortChange(
					sortingBefore, sortingAfter
				));
		}
		public HandleResponseLoaded (response: AgGrids.Interfaces.Ajax.IResponse, selectFirstRow: boolean = false): void {
			this.grid
				.SetGridPath(response.path)
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
						.SetDirection(sortDir)
						.SetSequence(index);
				}
				index++;
			}

			if (selectFirstRow)
				this.SelectRowByIndex(0);
		}

		protected firefiltering (filteringBefore: Map<string, Map<Enums.Operator, string[]>>, filteringAfter: Map<string, Map<Enums.Operator, string[]>>): this {
			this.grid
				.SetOffset(0)
				.SetFiltering(filteringAfter)
				.SetTotalCount(null);
			var pageMode = this.grid.GetPageMode();
			if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				var dataSource = this.grid.GetDataSource() as AgGrids.DataSources.SinglePageMode;
				dataSource.SetBodyScrolled(false);
				var gridOptionsManager = this.grid.GetOptionsManager().GetAgOptions();
				gridOptionsManager.api.onFilterChanged();
			} else if ((pageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				var dataSourceMp: AgGrids.DataSources.MultiplePagesMode = this.grid.GetDataSource() as any;
				dataSourceMp.Load();
			}
			this.FireHandlers("filterChange", new EventsManagers.Events.FilterChange(
				filteringBefore, filteringAfter
			));
			return this;
		}
		protected handleRefreshClick (refreshAnchor: HTMLAnchorElement, loadingCls: string, e: MouseEvent): boolean {
			e.cancelBubble = true;
			e.preventDefault();
			e.stopPropagation();
			var cssClasses = refreshAnchor.className.replace(/\s+/g, ' ').split(' ');
			if (cssClasses.indexOf(loadingCls) !== -1) return false;
			cssClasses.push(loadingCls);
			refreshAnchor.className = cssClasses.join(' ');
			return true;
		}
		protected handleRefreshResponse (): void {
			var optsMgr = this.grid.GetOptionsManager(),
				refreshAnchor = optsMgr.GetElements().refreshAnchor,
				loadingCls = optsMgr.Static.SELECTORS.BOTTOM_CONTROLS.REFRESH_ANCHOR_LOADING_CLS,
				cssClasses = refreshAnchor.className.replace(/\s+/g, ' ').split(' '),
				cssClassIndex = cssClasses.indexOf(loadingCls);
			if (cssClassIndex !== -1)
				cssClasses.splice(cssClassIndex, 1);
			refreshAnchor.className = cssClasses.join(' ');
		}
		protected handleColumnChangesSent (): void {
			if (this.columnsChangesSending) return;
			var plainObj = AgGrids.Tools.Helpers.ConvertMap2Object(this.columnsChanges);
			this.columnsChanges = new Map<string, Interfaces.EventArgs.IColumnChange>();
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
		protected handleUrlChangeSortsFilters (reqData: Interfaces.Ajax.IRequest): this {
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
	}
}