namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class Helpers {
		protected grid: AgGrid;
		protected touchDevice: boolean;
		protected isChromeBrowser: boolean;
		public constructor (grid: AgGrid) {
			this.grid = grid;
		}
		public IsTouchDevice (): boolean {
			return this.touchDevice ?? (this.touchDevice = (
				('ontouchstart' in window) ||
				(navigator.maxTouchPoints > 0) ||
				///@ts-ignore
				(navigator['msMaxTouchPoints'] > 0)
			));
		}
		public IsChromeBrowser (): boolean {
			return this.isChromeBrowser ?? (this.isChromeBrowser = (
				/Chrome/.test(navigator.userAgent) && 
				/Google Inc/.test(navigator.vendor)
			));
		}
		public GetHtmlElementFromString (htmlCode: string): HTMLElement {
			var contDiv = document.createElement('div');
			contDiv.innerHTML = htmlCode.trim();
			return contDiv.firstChild as HTMLElement;
		}
		public RetypeRawServerConfig (serverConfig: Interfaces.IServerConfig): Interfaces.IServerConfig {
			serverConfig.urlSegments.urlFilterOperators = this.convertObject2Map<Enums.Operator, string>(
				serverConfig.urlSegments.urlFilterOperators
			);
			serverConfig.ajaxParamsNames = this.convertObject2Map<Enums.AjaxParamName, string>(
				serverConfig.ajaxParamsNames
			);
			serverConfig.controlsTexts = this.convertObject2Map<Enums.ControlText, string>(
				serverConfig.controlsTexts
			);
			return serverConfig;
		}
		public RetypeRawServerResponse (serverResponse: Interfaces.IServerResponse): Interfaces.IServerResponse {
			serverResponse.filtering = this.convertObject2Map<string, Map<Enums.Operator, string[]>>(
				serverResponse.filtering
			);
			return serverResponse;
		}
		public RetypeRequest2RawRequest (serverRequest: Interfaces.IServerRequest): Interfaces.IServerRequestRaw {
			var result: Interfaces.IServerRequestRaw = serverRequest as any;
			result.filtering = this.convertMap2Object<string, Map<Enums.Operator, string[]>>(
				serverRequest.filtering
			) as any;
			var serverConfig = this.grid.GetServerConfig();
			result.id = serverConfig.id;
			result.mode = serverConfig.clientPageMode;
			if (serverConfig.clientPageMode & Enums.ClientPageMode.CLIENT_PAGE_MODE_MULTI) {
				result.gridPath = serverConfig.gridPath;
			}
			return result;
		}
		public IsInstanceOfIServerRequestRaw (obj: any): boolean {
			return (
				obj != null &&
				'id' in obj && 'mode' in obj &&
				'offset' in obj && 'limit' in obj &&
				'sorting' in obj && 'filtering' in obj
			);
		}
		protected convertObject2Map<TKey, TValue> (obj: any): Map<TKey, TValue> {
			var data: any[][] = [];
			for (var key in obj)
				data.push([key, obj[key]]);
			return new Map<TKey, TValue>(data as Iterable<readonly [TKey, TValue]>);
		}
		protected convertMap2Object<TKey, TValue> (map: Map<TKey, TValue>): object {
			var obj: any = {};
			for (var [key, value] of map)
				obj[key] = value;
			return obj;
		}
	}
}