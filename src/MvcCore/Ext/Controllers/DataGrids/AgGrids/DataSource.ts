namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class DataSource {
		public Static: typeof DataSource;

		protected grid: AgGrid;
		protected options: AgGrids.Options;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Helpers;

		protected initialData: Interfaces.IServerResponse;
		protected cache: DataSources.Cache;
		protected pageReqData?: Interfaces.IServerRequestRaw;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.options = grid.GetOptions();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
			this.initialData = grid.GetInitialData();
		}

		protected initPageReqDataAndCache (): void {
			this.cache = new DataSources.Cache(this.grid);
			this.pageReqData = this.helpers.RetypeRequest2RawRequest({
				offset: this.grid.GetOffset(),
				limit: this.grid.GetServerConfig().itemsPerPage,
				sorting: this.grid.GetSorting(),
				filtering: this.grid.GetFiltering(),
			});
		}
		protected getReqUrlMethodAndType (): [string, string, string] {
			var serverCfg = this.grid.GetServerConfig(),
				cfgReqMethod = serverCfg.dataRequestMethod,
				dataUrl: string = serverCfg.dataUrl,
				reqMethod: string = 'GET',
				reqType: string = 'json';
			if ((cfgReqMethod & Enums.AjaxDataRequestMethod.AJAX_DATA_REQUEST_METHOD_POST) != 0) {
				reqMethod = 'POST';
			} else if ((cfgReqMethod & Enums.AjaxDataRequestMethod.AJAX_DATA_REQUEST_METHOD_JSONP) != 0) {
				reqType = 'jsonp';
			}
			return [dataUrl, reqMethod, reqType];
		}
	}
}