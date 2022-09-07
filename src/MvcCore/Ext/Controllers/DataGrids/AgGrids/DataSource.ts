namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export abstract class DataSource {
		public Static: typeof DataSource;

		protected static grid: AgGrid;
		protected grid: AgGrid;
		protected options: AgGrids.Options;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Helpers;

		protected initialData: Interfaces.IServerResponse;
		protected cache: DataSources.Cache;
		protected pageReqData?: Interfaces.IServerRequestRaw;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.Static.grid = grid;
			this.grid = grid;
			this.options = grid.GetOptions();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
			this.initialData = grid.GetInitialData();
		}

		public abstract ExecRequest (reqData: Interfaces.IServerRequestRaw, changeUrl: boolean): this;

		protected initPageReqDataAndCache (): void {
			var grid = this.Static.grid;
			this.cache = new DataSources.Cache(grid);
			this.pageReqData = this.Static.retypeRequestMaps2Objects({
				offset: grid.GetOffset(),
				limit: grid.GetServerConfig().itemsPerPage,
				sorting: grid.GetSorting(),
				filtering: grid.GetFiltering(),
			});
		}
		protected getReqUrlMethodAndType (): [string, string, string] {
			var serverCfg = this.Static.grid.GetServerConfig(),
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
		public static RetypeRawServerResponse (serverResponse: Interfaces.IServerResponse): Interfaces.IServerResponse {
			serverResponse.filtering = this.retypeFilteringObj2Map(serverResponse.filtering);
			return serverResponse;
		}
		public static RetypeRequestObjects2Maps (serverRequest: Interfaces.IServerRequestRaw): Interfaces.IServerRequest {
			var result: Interfaces.IServerRequest = { ...serverRequest } as any;
			result.filtering = this.retypeFilteringObj2Map(serverRequest.filtering);
			return result;
		}
		protected static retypeFilteringObj2Map (filtering: any): Map<string, Map<Enums.Operator, string[]>> {
			var columnsIds = Object.keys(filtering);
			if (columnsIds.length > 0) {
				var filtering = filtering;
				var newFiltering = new Map<string, Map<Enums.Operator, string[]>>();
				for (var idColumn of columnsIds) {
					newFiltering.set(idColumn, Helpers.ConvertObject2Map<Enums.Operator, string[]>(
						filtering[idColumn] as any
					));
				}
				return newFiltering;
			} else {
				return new Map<string, Map<Enums.Operator, string[]>>();
			}
		}
		public static RetypeFilteringMap2Obj (filtering: Map<string, Map<Enums.Operator, string[]>>): any {
			var newFiltering: any = {};
			for (var [idColumn, filterValues] of filtering.entries()) {
				newFiltering[idColumn] = Helpers.ConvertMap2Object<Enums.Operator, string[]>(
					filterValues
				) as any;
			}
			return newFiltering;
		}
		protected static retypeRequestMaps2Objects (serverRequest: Interfaces.IServerRequest): Interfaces.IServerRequestRaw {
			var result: Interfaces.IServerRequestRaw = serverRequest as any;
			if (serverRequest.filtering instanceof Map) {
				result.filtering = this.RetypeFilteringMap2Obj(serverRequest.filtering);
			}
			return this.addRequestSystemData(result);
		}
		protected static addRequestSystemData (serverRequest: Interfaces.IServerRequestRaw): Interfaces.IServerRequestRaw {
			var serverConfig = this.grid.GetServerConfig();
			serverRequest.id = serverConfig.id;
			serverRequest.mode = serverConfig.clientPageMode;
			serverRequest.path = this.grid.GetGridPath();
			return serverRequest;
		}
	}
}