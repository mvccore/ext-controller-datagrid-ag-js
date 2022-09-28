namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export abstract class DataSource {
		public Static: typeof DataSource;

		protected static grid: AgGrid;
		protected grid: AgGrid;
		protected optionsManager: AgGrids.Options.Manager;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Tools.Helpers;

		protected initialData: Interfaces.Ajax.IResponse;
		protected cache: DataSources.Cache;
		protected pageReqData?: Interfaces.Ajax.IReqRawObj;

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.Static.grid = grid;
			this.grid = grid;
			this.optionsManager = grid.GetOptionsManager();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
			this.initialData = grid.GetInitialData();
		}

		public abstract ExecRequest (reqData: Interfaces.Ajax.IReqRawObj, changeUrl: boolean): this;

		protected handleResponseControls (response: AgGrids.Interfaces.Ajax.IResponse): void {
			var elms = this.optionsManager.GetElements(),
				controls = response.controls;
			if (elms.statusControl != null) {
				if (controls.status == null) {
					elms.statusControl.innerHTML = '';
				} else {
					elms.statusControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.status),
						elms.statusControl
					);
				}
			}
		}
		protected initPageReqDataAndCache (): void {
			var grid = this.Static.grid;
			this.cache = new grid.Static.Classes.DataSources.Cache(grid);
			this.pageReqData = this.Static.RetypeRequestMaps2Objects({
				offset: grid.GetOffset(),
				limit: grid.GetLimit(),
				sorting: grid.GetSorting(),
				filtering: grid.GetFiltering(),
			});
		}
		protected getReqUrlMethodAndType (): [string, string, string] {
			var serverCfg = this.Static.grid.GetServerConfig(),
				cfgReqMethod = serverCfg.dataRequestMethod,
				urlData: string = serverCfg.urlData,
				reqMethod: string = 'GET',
				reqType: string = 'json';
			if ((cfgReqMethod & Enums.AjaxDataRequestMethod.AJAX_DATA_REQUEST_METHOD_POST) != 0) {
				reqMethod = 'POST';
			} else if ((cfgReqMethod & Enums.AjaxDataRequestMethod.AJAX_DATA_REQUEST_METHOD_JSONP) != 0) {
				reqType = 'jsonp';
			}
			return [urlData, reqMethod, reqType];
		}
		public static RetypeRawServerResponse (serverResponse: Interfaces.Ajax.IResponse): Interfaces.Ajax.IResponse {
			serverResponse.filtering = this.retypeFilteringObj2Map(serverResponse.filtering);
			return serverResponse;
		}
		public static RetypeRequestObjects2Maps (serverRequest: Interfaces.Ajax.IReqRawObj): Interfaces.Ajax.IRequest {
			var result: Interfaces.Ajax.IRequest = { ...serverRequest } as any;
			result.filtering = this.retypeFilteringObj2Map(serverRequest.filtering);
			return result;
		}
		protected static retypeFilteringObj2Map (filtering: any): Map<string, Map<Enums.Operator, string[]>> {
			var columnsIds = Object.keys(filtering);
			if (columnsIds.length > 0) {
				var filtering = filtering;
				var newFiltering = new Map<string, Map<Enums.Operator, string[]>>();
				for (var idColumn of columnsIds) {
					newFiltering.set(idColumn, Tools.Helpers.ConvertObject2Map<Enums.Operator, string[]>(
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
				newFiltering[idColumn] = Tools.Helpers.ConvertMap2Object<Enums.Operator, string[]>(
					filterValues
				) as any;
			}
			return newFiltering;
		}
		public static RetypeRequestMaps2Objects (serverRequest: Interfaces.Ajax.IRequest): Interfaces.Ajax.IReqRawObj {
			var result: Interfaces.Ajax.IReqRawObj = { ...serverRequest } as any;
			if (serverRequest.filtering instanceof Map) {
				result.filtering = this.RetypeFilteringMap2Obj(serverRequest.filtering);
			}
			return this.addRequestSystemData(result);
		}
		protected static addRequestSystemData (serverRequest: Interfaces.Ajax.IReqRawObj): Interfaces.Ajax.IReqRawObj {
			var serverConfig = this.grid.GetServerConfig();
			serverRequest.id = serverConfig.id;
			serverRequest.mode = serverConfig.clientPageMode;
			serverRequest.path = this.grid.GetGridPath();
			return serverRequest;
		}
	}
}