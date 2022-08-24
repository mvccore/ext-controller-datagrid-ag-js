namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class Options {
		public static readonly SELECTORS = {
			AG_GRID_SEL: 'div.grid-table-component',
			BOTTOM_CONTROLS: {
				CONT_SEL: '.grid-controls-bottom',
				COUNT_SCALES_SEL: '.grid-control-count-scales',
				STATUS_SEL: '.grid-control-status',
				PAGING_SEL: '.grid-control-paging',
				PAGING_ANCHOR_SEL: '.grid-page a',
			}
		}
		public static readonly SINGLE_PAGE_MODE = {
			MAX_ROWS_2_SUPPRESS_ROW_VIRTUALIZATION: 500
		};

		public Static: typeof Options;
		protected grid: AgGrid;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Helpers;
		
		protected bases: AgOptions.Bases;
		protected columns: AgGrids.AgOptions.Columns;

		protected elements: AgGrids.Interfaces.IElements;
		protected agOptions: agGrid.GridOptions<any>;
		protected agColumns: AgGrids.Types.GridColumn[];
		protected agDataSource: agGrid.IDatasource;
		
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
		}

		public SetElements (elements: AgGrids.Interfaces.IElements): this {
			this.elements = elements;
			return this;
		}
		public GetElements (): AgGrids.Interfaces.IElements {
			return this.elements;
		}
		public SetAgOptions (options: agGrid.GridOptions<any>): this {
			this.agOptions = options;
			return this;
		}
		public GetAgOptions (): agGrid.GridOptions<any> {
			return this.agOptions;
		}
		public SetAgColumns (gridColumns: AgGrids.Types.GridColumn[]): this {
			this.agColumns = gridColumns;
			return this;
		}
		public GetAgColumns (): AgGrids.Types.GridColumn[] {
			return this.agColumns;
		}
		
		public InitElements (): this {
			var contElementSelector = this.grid.GetServerConfig().contElementSelector,
				contElement = document.querySelector<HTMLDivElement>(contElementSelector);
			if (contElement == null) throw new Error(
				`Element with selector '${contElementSelector}' not found.`
			);
			var sels = this.Static.SELECTORS,
				bcSels = sels.BOTTOM_CONTROLS,
				agGridElement = contElement.querySelector<HTMLDivElement>(sels.AG_GRID_SEL),
				bottomControlsElement = contElement.querySelector<HTMLDivElement>(sels.BOTTOM_CONTROLS.CONT_SEL);
			this.elements = <AgGrids.Interfaces.IElements>{
				contElement: contElement,
				agGridElement: agGridElement,
				bottomControlsElement: bottomControlsElement,
				countScalesControl: null,
				pagingControl: null,
				statusControl: null,
				pagingAnchors: []
			}
			if (bottomControlsElement != null) 
				this.InitBottomControls();
			return this;
		}
		public InitBottomControls (): this {
			var bcSels = this.Static.SELECTORS.BOTTOM_CONTROLS,
				bottomControlsElement = this.elements.bottomControlsElement;
			this.elements.countScalesControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.COUNT_SCALES_SEL);
			this.elements.pagingControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.PAGING_SEL);
			this.elements.statusControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.STATUS_SEL);
			if (this.elements.pagingControl != null) {
				var paginationAnchors = this.elements.pagingControl.querySelectorAll<HTMLAnchorElement>(
					this.Static.SELECTORS.BOTTOM_CONTROLS.PAGING_ANCHOR_SEL
				);
				this.elements.pagingAnchors = (paginationAnchors.length > 0)
					? [].slice.apply(paginationAnchors)
					: [];
			}
			return this;
		}
		public InitAgBases (): this {
			this.bases = new AgGrids.AgOptions.Bases(this.grid);
			this.bases.Init();
			this.agOptions = this.bases.GetAgOptions();
			return this;
		}
		public InitAgColumns (): this {
			this.columns = new AgGrids.AgOptions.Columns(this.grid);
			this.columns.Init();
			this.agOptions.columnDefs = this.columns.GetAgColumns();
			this.agOptions.defaultColDef = this.columns.GetDefaultColDef();
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
			this.agOptions.cacheBlockSize = serverConfig.itemsPerPage;
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
			this.agOptions.maxBlocksInCache = Math.round(10000 / serverConfig.clientRowBuffer);
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