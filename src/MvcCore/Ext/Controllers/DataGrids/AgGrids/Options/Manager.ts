namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Options {
	export class Manager {
		public static readonly SELECTORS = {
			AG_GRID_SEL: 'div.grid-table-component',
			BOTTOM_CONTROLS: {
				CONT_SEL: '.grid-controls-bottom',
				COUNT_SCALES_SEL: '.grid-control-count-scales',
				REFRESH_SEL: '.grid-control-refresh',
				STATUS_SEL: '.grid-control-status',
				PAGING_SEL: '.grid-control-paging',
				COUNT_SCALES_ANCHOR_SEL: '.grid-count a',
				REFRESH_ANCHOR_SEL: '.grid-control-refresh a',
				REFRESH_ANCHOR_LOADING_CLS: 'grid-refresh-link-loading',
				PAGING_ANCHOR_SEL: '.grid-page a',
			}
		}
		public static readonly SYSTEM_LOCALE_SEPARATOR: string = '-';
		public static readonly SINGLE_PAGE_MODE = {
			MAX_ROWS_2_SUPPRESS_ROW_VIRTUALIZATION: 500
		};

		public Static: typeof Manager;
		protected grid: AgGrid;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Tools.Helpers;
		
		protected agBases: AgGrids.Options.AgBases;
		protected columnManager: AgGrids.Columns.Manager;

		protected elements: AgGrids.Interfaces.SortHeaders.IElements;
		protected agOptions: agGrid.GridOptions<any>;
		protected agDataSource: agGrid.IDatasource;
		
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
		}

		public SetElements (elements: AgGrids.Interfaces.SortHeaders.IElements): this {
			this.elements = elements;
			return this;
		}
		public GetElements (): AgGrids.Interfaces.SortHeaders.IElements {
			return this.elements;
		}
		public SetAgBases (agBases: AgGrids.Options.AgBases): this {
			this.agBases = agBases;
			return this;
		}
		public GetAgBases (): AgGrids.Options.AgBases {
			return this.agBases;
		}
		public SetAgOptions (options: agGrid.GridOptions<any>): this {
			this.agOptions = options;
			return this;
		}
		public GetAgOptions (): agGrid.GridOptions<any> {
			return this.agOptions;
		}
		public SetColumnManager (columnManager: AgGrids.Columns.Manager): this {
			this.columnManager = columnManager;
			return this;
		}
		public GetColumnManager (): AgGrids.Columns.Manager {
			return this.columnManager;
		}
		
		public InitElements (): this {
			var contElementSelector = this.grid.GetServerConfig().contElementSelector,
				contElement = document.querySelector<HTMLDivElement>(contElementSelector);
			if (contElement == null) throw new Error(
				`Element with selector '${contElementSelector}' not found.`
			);
			var sels = this.Static.SELECTORS,
				agGridElement = contElement.querySelector<HTMLDivElement>(sels.AG_GRID_SEL),
				bottomControlsElement = contElement.querySelector<HTMLDivElement>(sels.BOTTOM_CONTROLS.CONT_SEL);
			this.elements = <AgGrids.Interfaces.SortHeaders.IElements>{
				contElement: contElement,
				agGridElement: agGridElement,
				bottomControlsElement: bottomControlsElement,
				countScalesControl: null,
				pagingControl: null,
				statusControl: null,
				pagingAnchors: [],
				pagingAnchorsMaps: new Map<number, HTMLAnchorElement[]>(),
				countScalesAnchors: []
			}
			this.InitBottomControls();
			return this;
		}
		public InitBottomControls (): this {
			var bcSels = this.Static.SELECTORS.BOTTOM_CONTROLS,
				bottomControlsElement = this.elements.bottomControlsElement;
			if (bottomControlsElement == null) return this;
			this.elements.statusControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.STATUS_SEL);
			this
				.InitBottomControlsCountScales()
				.InitBottomControlsRefresh()
				.InitBottomControlsPaging();
			return this;
		}
		public InitBottomControlsCountScales (): this {
			var bcSels = this.Static.SELECTORS.BOTTOM_CONTROLS,
				bottomControlsElement = this.elements.bottomControlsElement;
			if (bottomControlsElement == null) return this;
			this.elements.countScalesControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.COUNT_SCALES_SEL);
			if (this.elements.countScalesControl != null) {
				var countScalesAnchors = this.elements.countScalesControl.querySelectorAll<HTMLAnchorElement>(
					bcSels.COUNT_SCALES_ANCHOR_SEL
				);
				this.elements.countScalesAnchors = (countScalesAnchors.length > 0)
					? [].slice.apply(countScalesAnchors)
					: [];
			}
			return this;
		}
		public InitBottomControlsRefresh (): this {
			if (
				!this.grid.GetServerConfig().renderConfig.renderControlRefresh ||
				this.elements.refreshControl != null
			) return this;
			var bcSels = this.Static.SELECTORS.BOTTOM_CONTROLS,
				bottomControlsElement = this.elements.bottomControlsElement;
			if (bottomControlsElement == null) return this;
			this.elements.refreshControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.REFRESH_SEL);
			if (this.elements.refreshControl != null) {
				this.elements.refreshAnchor = this.elements.refreshControl.querySelector<HTMLAnchorElement>(
					bcSels.REFRESH_ANCHOR_SEL
				);
			}
			return this;
		}
		public InitBottomControlsPaging (): this {
			var bcSels = this.Static.SELECTORS.BOTTOM_CONTROLS,
				bottomControlsElement = this.elements.bottomControlsElement;
			if (bottomControlsElement == null) return this;
			this.elements.pagingControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.PAGING_SEL);
			if (this.elements.pagingControl != null) {
				var paginationAnchors = this.elements.pagingControl.querySelectorAll<HTMLAnchorElement>(
					bcSels.PAGING_ANCHOR_SEL
				);
				if (paginationAnchors.length > 0) {
					this.elements.pagingAnchors = [].slice.apply(paginationAnchors);
					var paginationAnchorsMaps = new Map<number, HTMLAnchorElement[]>(),
						pagingAnchorOffset: number;
					for (var paginationAnchor of paginationAnchors) {
						pagingAnchorOffset = parseInt(paginationAnchor.dataset.offset, 10);
						if (paginationAnchorsMaps.has(pagingAnchorOffset)) {
							paginationAnchorsMaps.get(pagingAnchorOffset).push(paginationAnchor);
						} else {
							paginationAnchorsMaps.set(pagingAnchorOffset, [paginationAnchor]);
						}
					}
					this.elements.pagingAnchorsMaps = paginationAnchorsMaps;
				}
			}
			return this;
		}
		public InitAgBases (): this {
			this.agBases = new this.grid.Static.Classes.Options.AgBases(this.grid);
			this.agBases.Init();
			this.agOptions = this.agBases.GetAgOptions();
			return this;
		}
		public InitAgColumns (): this {
			this.columnManager = new this.grid.Static.Classes.Columns.Manager(this.grid);
			this.columnManager.Init();
			this.agOptions.columnDefs = Array.from(this.columnManager.GetAgColumnsConfigs().values());
			this.agOptions.defaultColDef = this.columnManager.GetAgColumnDefaults();
			return this;
		}
		public InitAgPageModeSpecifics (): this {
			var clientPageMode = this.grid.GetServerConfig().clientPageMode;
			if ((clientPageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_SINGLE) != 0) {
				this.initSinglePageSpecifics();
			} else if ((clientPageMode & AgGrids.Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) != 0) {
				this.initMultiplePagesSpecifics();
			}
			return this;
		}
		protected initSinglePageSpecifics (): this {
			var serverConfig = this.grid.GetServerConfig();
			// server inifinite loading:
			this.agOptions.rowBuffer = serverConfig.clientRowBuffer;
			// tell grid we want virtual row model type
			this.agOptions.rowModelType = 'infinite';
			// how big each page in our page cache will be, default is 100
			this.agOptions.cacheBlockSize = serverConfig.clientRequestBlockSize;
			// how many extra blank rows to display to the user at the end of the dataset,
			// which sets the vertical scroll and then allows the grid to request viewing more rows of data.
			// default is 1, ie show 1 row.
			this.agOptions.cacheOverflowSize = 1;
			// how many server side requests to send at a time. if user is scrolling lots, then the requests
			// are throttled down
			this.agOptions.maxConcurrentDatasourceRequests = 2;
			// how many rows to initially show in the grid. having 1 shows a blank row, so it looks like
			// the grid is loading from the users perspective (as we have a spinner in the first col)
			this.agOptions.infiniteInitialRowCount = Math.round(serverConfig.clientRowBuffer / 2);
			// how many pages to store in cache. default is undefined, which allows an infinite sized cache,
			// pages are never purged. this should be set for large data to stop your browser from getting
			// full of data
			if (serverConfig.clientCache && serverConfig.clientMaxRowsInCache > 0) {
				this.agOptions.maxBlocksInCache = Math.round(serverConfig.clientMaxRowsInCache / serverConfig.clientRequestBlockSize);
			} else {
				this.agOptions.maxBlocksInCache = 1;
			}
			return this;
		}
		protected initMultiplePagesSpecifics (): this {
			var serverConfig = this.grid.GetServerConfig(),
				initialData = this.grid.GetInitialData();
			this.agOptions.rowModelType = 'clientSide';
			this.agOptions.rowData = initialData.data;
			var spm = this.Static.SINGLE_PAGE_MODE;
			//console.log(initialData);
			if (initialData.dataCount >= serverConfig.clientRowBufferMax) {
				// large single page - enable row buffer with 10 by default:
				this.agOptions.rowBuffer = serverConfig.clientRowBuffer;
				this.agOptions.suppressRowVirtualisation = false;
			} else {
				// small single page - fill row buffer with all rows:
				this.agOptions.rowBuffer = initialData.dataCount;
				if (initialData.dataCount > spm.MAX_ROWS_2_SUPPRESS_ROW_VIRTUALIZATION) {
					// disable row virtualization if necessary:
					this.agOptions.suppressRowVirtualisation = true;
				}
			}
			return this;
		}
	}
}