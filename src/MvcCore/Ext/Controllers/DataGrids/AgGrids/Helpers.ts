namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class Helpers {
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			this.grid = grid;
		}
		public RetypeServerConfigObjects2Maps (serverConfig: Interfaces.IServerConfig): Interfaces.IServerConfig {
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
		public RetypeServerResponseObjects2Maps (serverResponse: Interfaces.IServerResponse): Interfaces.IServerResponse {
			serverResponse.filtering = this.convertObject2Map<string, Map<Enums.Operator, string[]>>(
				serverResponse.filtering
			);
			return serverResponse;
		}
		public RetypeServerRequestMaps2Objects (serverRequest: Interfaces.IServerRequest): Interfaces.IServerRequest {
			serverRequest.filtering = this.convertMap2Object<string, Map<Enums.Operator, string[]>>(
				serverRequest.filtering
			) as any;
			return serverRequest;
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