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
		public static readonly MULTI_PAGES_MODE = {
			
		};

		public Static: typeof Options;
		protected grid: AgGrid;
		protected events: AgGrids.Events;
		protected helpers: AgGrids.Helpers;
		
		protected bases: SubOptions.Bases;
		protected columns: AgGrids.SubOptions.Columns;
		protected dataSource: AgGrids.SubOptions.DataSource | agGrid.IDatasource;

		protected elements: AgGrids.Interfaces.IElements;
		protected agOptions: agGrid.GridOptions<any>;
		protected agColumns: AgGrids.Types.GridColumn[];
		protected agDataSource: agGrid.IDatasource;
		
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.events = grid.GetEvents();
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
		public SetAgDataSource (dataSource: agGrid.IDatasource): this {
			this.dataSource = dataSource;
			return this;
		}
		public GetAgDataSource (): agGrid.IDatasource {
			return this.dataSource;
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
				bottomControlsElement = contElement.querySelector<HTMLDivElement>(sels.BOTTOM_CONTROLS.CONT_SEL),
				countScalesControl = null,
				paginationControl = null,
				statusControl = null;
			if (bottomControlsElement != null) {
				countScalesControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.COUNT_SCALES_SEL);
				paginationControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.PAGING_SEL);
				statusControl = bottomControlsElement.querySelector<HTMLElement>(bcSels.STATUS_SEL);
			}
			this.elements = <AgGrids.Interfaces.IElements>{
				contElement: contElement,
				agGridElement: agGridElement,
				bottomControlsElement: bottomControlsElement,
				countScalesControl: countScalesControl,
				paginationControl: paginationControl,
				statusControl: statusControl,
				paginationAnchors: []
			}
			if (bottomControlsElement != null) 
				this.InitPagingAnchors();
			return this;
		}
		public InitPagingAnchors (): this {
			this.elements.paginationAnchors = [];
			var paginationAnchors = this.elements.paginationControl.querySelectorAll<HTMLAnchorElement>(
				this.Static.SELECTORS.BOTTOM_CONTROLS.PAGING_ANCHOR_SEL
			);
			if (paginationAnchors.length > 0) {
				this.elements.paginationAnchors = [].slice.apply(paginationAnchors);
			}
			return this;
		}
		public InitAgBases (): this {
			this.bases = new AgGrids.SubOptions.Bases(this.grid);
			this.bases.Init();
			this.agOptions = this.bases.GetAgOptions();
			return this;
		}
		public InitAgColumns (): this {
			this.columns = new AgGrids.SubOptions.Columns(this.grid);
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
			this.agOptions.cacheBlockSize = serverConfig.clientRowBuffer * 10;
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
			
			this.dataSource = new AgGrids.SubOptions.DataSource(this.grid);
			return this;
		}
		protected initMultiplePagesSpecifics (): this {
			var serverConfig = this.grid.GetServerConfig(),
				initialData = this.grid.GetInitialData();
			this.agOptions.rowModelType = 'clientSide';
			this.agOptions.rowData = initialData.data;
			var spm = this.Static.SINGLE_PAGE_MODE;
			console.log(initialData);
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