namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	
	export class Initializations {
		public Static: typeof Initializations;
		protected static types: Map<string, string> = new Map<string, string>([
			["string",		"textColumn"],
			["int",			"numericColumn"],
			["float",		"numericColumn"],
			["\\Date",		"dateColumn"],
			["\\DateTime",	"dateColumn"],
		]);
		protected grid: AgGrid;
		protected events: AgGrids.Events;
		public constructor (grid: AgGrid, events: AgGrids.Events) {
			this.Static = new.target;
			this.grid = grid;
			this.events = events;
			document.addEventListener('DOMContentLoaded', this.init.bind(this));
		}
		protected init (): void {
			var elmSelector = this.grid.GetServerConfig().ElementSelector,
				gridElement = document.querySelector<HTMLDivElement>(elmSelector);
			if (gridElement == null) throw new Error(
				`Element with selector '${elmSelector}' not found.`
			);
			this.grid.SetGridElement(gridElement);
			this.initGridColumns();
			this.initGridOptions();
			this.initGrid();
			this.initGridDataSource();
		}
		protected initGridColumns (): void {
			var serverColumns = this.grid.GetServerConfig().Columns;
			var gridColumns = <AgGrids.Types.GridColumn[]>[];
			var gridColumn: AgGrids.Types.GridColumn;
			var serverColumnCfg: AgGrids.IServerConfigs.IColumn;
			for (var urlName in serverColumns) {
				serverColumnCfg = serverColumns[urlName];
				if (serverColumnCfg.disabled === true) continue;
				gridColumn = this.initGridColumn(urlName, serverColumnCfg);
				gridColumns.push(gridColumn);
			}
			console.log(gridColumns);
			this.grid.SetGridColumns(gridColumns);
		}
		protected initGridColumn (urlName: string, serverColumnCfg: AgGrids.IServerConfigs.IColumn): AgGrids.Types.GridColumn {
			var column = <agGrid.ColDef>{
				colId: serverColumnCfg.propName,
				field: serverColumnCfg.propName,
				headerName: serverColumnCfg.headingName,
				tooltipField: serverColumnCfg.propName,
				resizable: true
			};
			var serverType = serverColumnCfg.types[0];
			if (this.Static.types.has(serverType))
				column.type = this.Static.types.get(serverType);
			column.filter = !(serverColumnCfg.filter === false);
			column.sortable = !(serverColumnCfg.sort === false);
			if (serverColumnCfg.width != null && typeof(serverColumnCfg.width) == 'number')
				column.width = serverColumnCfg.width;
			if (serverColumnCfg.minWidth != null && typeof(serverColumnCfg.minWidth) == 'number')
				column.minWidth = serverColumnCfg.minWidth;
			if (serverColumnCfg.maxWidth != null && typeof(serverColumnCfg.maxWidth) == 'number')
				column.maxWidth = serverColumnCfg.maxWidth;
			return column;
		}
		protected initGridOptions (): void {
			var gridOptions = <agGrid.GridOptions<any>>{
				columnDefs: this.grid.GetGridColumns(),
				defaultColDef: <agGrid.ColDef>{
					flex: 1,
					//minWidth: 200,
					filter: true,
					resizable: true,
					sortable: true,
					floatingFilter: true,
					suppressMenu: true,
			
					editable: true,
					
					tooltipComponent: AgGrids.ToolTip
				},
			
				tooltipShowDelay: 0,
				tooltipHideDelay: 2000,
			
				animateRows: false,
			
				alwaysShowVerticalScroll: true,
				
				suppressColumnVirtualisation: true,
			
				// suppressRowVirtualisation: true, // this will disable dynamic loading and renders all rows
			
				suppressAnimationFrame: true, // pouze pro chrome prohlížeče!
			
			
				// server inifinite loading:
				rowBuffer: 10,
				// tell grid we want virtual row model type
				rowModelType: 'infinite',
				// how big each page in our page cache will be, default is 100
				cacheBlockSize: 100,
				// how many extra blank rows to display to the user at the end of the dataset,
				// which sets the vertical scroll and then allows the grid to request viewing more rows of data.
				// default is 1, ie show 1 row.
				cacheOverflowSize: 1,
				// how many server side requests to send at a time. if user is scrolling lots, then the requests
				// are throttled down
				maxConcurrentDatasourceRequests: 2,
				// how many rows to initially show in the grid. having 1 shows a blank row, so it looks like
				// the grid is loading from the users perspective (as we have a spinner in the first col)
				infiniteInitialRowCount: 50,
				// how many pages to store in cache. default is undefined, which allows an infinite sized cache,
				// pages are never purged. this should be set for large data to stop your browser from getting
				// full of data
				maxBlocksInCache: 100,
			
				debounceVerticalScrollbar: true,
				//debug: true,
			
				
				// localizations:
				//localeText: agGridLocales['cs-CZ']
			};
			this.initGridOptionsRowSelection(gridOptions);
			this.initGridOptionsEvents(gridOptions);
			this.grid.SetGridOptions(gridOptions);
		}
		protected initGridOptionsRowSelection (gridOptions: agGrid.GridOptions<any>): void {
			var rowSel = this.grid.GetServerConfig().RowSelection;
			var rowSelectionNone = (rowSel & Enums.RowSelection.ROW_SELECTION_NONE) != 0;
			if (
				rowSelectionNone ||
				(rowSel & Enums.RowSelection.ROW_SELECTION_SINGLE) != 0
			) {
				gridOptions.rowSelection = 'single';
				if (rowSelectionNone)
					gridOptions.suppressRowClickSelection = true;
			} else if ((rowSel & Enums.RowSelection.ROW_SELECTION_MULTIPLE) != 0) {
				gridOptions.rowSelection = 'multiple';
				if (this.isTouchDevice())
					gridOptions.rowMultiSelectWithClick = true;
			}
			if ((rowSel & Enums.RowSelection.ROW_SELECTION_NOT_DESELECT) != 0)
				gridOptions.suppressRowDeselection = true;
		}
		protected initGridOptionsEvents (gridOptions: agGrid.GridOptions<any>): void {
			gridOptions.onColumnResized = this.events.HandleColumnResized.bind(this.events);
			gridOptions.onColumnMoved = this.events.HandleColumnMoved.bind(this.events);
			gridOptions.onFilterChanged = this.events.HandleFilterChanged.bind(this.events);
			gridOptions.onSortChanged = this.events.HandleSortChanged.bind(this.events);
			/*gridOptions.onFirstDataRendered = (params: agGrid.FirstDataRenderedEvent) => {
				params.api.sizeColumnsToFit();
			},*/
			gridOptions.onViewportChanged = this.events.HandleGridSizeChanged.bind(this.events);
			/*gridOptions.onGridReady = (params: agGrid.GridReadyEvent): void => {
				params.api.sizeColumnsToFit();
			},*/
			gridOptions.onGridSizeChanged = this.events.HandleGridSizeChanged.bind(this.events);
		}
		protected initGrid () {
			var grid = new agGrid.Grid(this.grid.GetGridElement(), this.grid.GetGridOptions());
			this.grid.SetGrid(grid);
		}
		protected initGridDataSource () {
			var firstData = this.grid.GetInitialData();
			var dataSource = <agGrid.IDatasource>{
				rowCount: undefined,
				getRows: (params: agGrid.IGetRowsParams): void => {
		
					console.log('asking for ' + params.startRow + ' to ' + params.endRow);
					
					if (params.endRow <= firstData.RowCount) {
						return params.successCallback(
							firstData.Data.slice(params.startRow, params.endRow), 
							firstData.TotalCount
						);
					}
		
					var startTime = +new Date;
		
					Ajax.get(
						this.grid.GetServerConfig().DataUrl, {
							startRow: params.startRow,
							endRow: params.endRow
						},
						(response: AgGrids.IServerResponse) => {
							var responseTime = +new Date;
							params.successCallback(response.Data, response.TotalCount);
							var renderedTime = +new Date;
		
							console.log(
								responseTime - startTime,
								renderedTime - responseTime,
								renderedTime - startTime
							);
						},
						'jsonp'
					);
				}
			};
			this.grid.GetGridOptions().api.setDatasource(dataSource);
			this.grid.SetGridDataSource(dataSource);
		}
		protected isTouchDevice (): boolean {
			return (
				('ontouchstart' in window) ||
				(navigator.maxTouchPoints > 0) ||
				///@ts-ignore
				(navigator['msMaxTouchPoints'] > 0)
			);
		}
	}
}