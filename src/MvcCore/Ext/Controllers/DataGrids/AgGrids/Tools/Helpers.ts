namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Tools {
	export class Helpers {
		public Static: typeof Helpers;
		protected grid: AgGrid;
		protected touchDevice: boolean;
		protected isChromeBrowser: boolean;
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
		}
		public IsTouchDevice (): boolean {
			return this.touchDevice ?? (this.touchDevice = (
				('ontouchstart' in window) ||
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
		public IsInstanceOfIServerRequestRaw (obj: any): boolean {
			return (
				obj != null &&
				'id' in obj && 'mode' in obj &&
				'offset' in obj && 'limit' in obj &&
				'sorting' in obj && 'filtering' in obj &&
				obj.id === this.grid.GetServerConfig().id
			);
		}
		public RetypeRawServerConfig (serverConfig: Interfaces.IServerConfig): Interfaces.IServerConfig {
			serverConfig.urlSegments.urlFilterOperators = this.Static.ConvertObject2Map<Enums.Operator, string>(
				serverConfig.urlSegments.urlFilterOperators
			);
			serverConfig.ajaxParamsNames = this.Static.ConvertObject2Map<Enums.AjaxParamName, string>(
				serverConfig.ajaxParamsNames
			);
			serverConfig.filterOperatorPrefixes = this.Static.ConvertObject2Map<Enums.Operator, string>(
				serverConfig.filterOperatorPrefixes
			);
			serverConfig.controlsTexts = this.Static.ConvertObject2Map<Enums.ControlText, string>(
				serverConfig.controlsTexts
			);
			return serverConfig;
		}
		public GetAllowedOperators (columnFilterFlags: Enums.FilteringMode): Map<Enums.Operator, AgGrids.Interfaces.SortHeaders.IAllowedOperator> {
			var urlFilterOperators 	= this.grid.GetServerConfig().urlSegments.urlFilterOperators,
				allowedOperators 	= new Map<Enums.Operator, AgGrids.Interfaces.SortHeaders.IAllowedOperator>(),
				allowRanges			= (columnFilterFlags & Enums.FilteringMode.ALLOW_RANGES) != 0,
				allowLikeRight		= (columnFilterFlags & Enums.FilteringMode.ALLOW_LIKE_RIGHT_SIDE) != 0,
				allowLikeLeft		= (columnFilterFlags & Enums.FilteringMode.ALLOW_LIKE_LEFT_SIDE)  != 0,
				allowLikeAnywhere	= (columnFilterFlags & Enums.FilteringMode.ALLOW_LIKE_ANYWHERE) != 0,
				operators: Enums.Operator[] = [
					Enums.Operator.EQUAL, Enums.Operator.NOT_EQUAL
				]; // equal and not equal are allowed for filtering by default
			if (allowRanges)
				operators = [...operators, ...[
					Enums.Operator.LOWER,
					Enums.Operator.GREATER,
					Enums.Operator.LOWER_EQUAL,
					Enums.Operator.GREATER_EQUAL
				]];
			if (allowLikeRight || allowLikeLeft || allowLikeAnywhere) 
				operators = [...operators, ...[
					Enums.Operator.LIKE,
					Enums.Operator.NOT_LIKE
				]];
			var urlSegment: string,
				multipleValues: boolean,
				likeOperator: boolean,
				regex: RegExp | null;
			for (var operator of operators) {
				urlSegment = urlFilterOperators.get(operator);
				multipleValues = operator.indexOf('<') === -1 && operator.indexOf('>') === -1;
				likeOperator = operator.indexOf('LIKE') !== -1;
				regex = null;
				if (likeOperator && !allowLikeAnywhere) {
					if (allowLikeRight && !allowLikeLeft) {
						regex = /^([^%_]).*$/g;
					} else if (allowLikeLeft && !allowLikeRight) {
						regex = /.*([^%_])$/g;
					} else if (allowLikeLeft && allowLikeRight) {
						regex = /^.([^%_]+).$/g;
					}
				}
				allowedOperators.set(operator, <Interfaces.SortHeaders.IAllowedOperator>{
					operator: 	operator,
					multiple: 	multipleValues,
					regex: 		regex
				});
			}
			return allowedOperators;
		}
		public SortConfigColumns (serverColumns: {[columnUrlName: string]: AgGrids.Interfaces.IServerConfigs.IColumn }): AgGrids.Interfaces.IServerConfigs.IColumn[] {
			var indexedMap = new Map<number, AgGrids.Interfaces.IServerConfigs.IColumn[]>(),
				notIndexedSet = new Set<AgGrids.Interfaces.IServerConfigs.IColumn>(),
				serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn,
				columnIndex: number | null;
			for (var columnUrlName in serverColumns) {
				serverColumnCfg = serverColumns[columnUrlName];
				columnIndex = serverColumnCfg.columnIndex;
				if (columnIndex == null) {
					notIndexedSet.add(serverColumnCfg);
				} else {
					if (indexedMap.has(columnIndex)) {
						indexedMap.get(columnIndex).push(serverColumnCfg);
					} else {
						indexedMap.set(columnIndex, [serverColumnCfg]);
					}
				}
			}
			var result: AgGrids.Interfaces.IServerConfigs.IColumn[] = [],
				index: number = 0,
				indexedMapKeys = Array.from(indexedMap.keys()).sort();
			for (var indexedMapKey of indexedMapKeys) {
				for (var serverColumnCfg of indexedMap.get(indexedMapKey)) {
					serverColumnCfg.columnIndex = index++;
					result.push(serverColumnCfg);
				}
			}
			for (var serverColumnCfg of notIndexedSet) {
				serverColumnCfg.columnIndex = index++;
				result.push(serverColumnCfg);
			}
			return result;
		}
		/**
		 * Check if given value contains any LIKE/NOT LIKE special 
		 * character: `%` or `_` or escaped like this: `[%]` or `[_]`.
		 * Returns `0` if no special char `%` or `_` matched.
		 * Returns `1` if special char `%` or `_` matched in raw form only, not escaped.
		 * Returns `2` if special char `%` or `_` matched in escaped form only.
		 * Returns `1 | 2` if special char `%` or `_` matched in both forms.
		 */
		public CheckFilterValueForLikeChar (rawValue: string, specialLikeChar: '_' | '%'): number {
			var containsSpecialChar = 0,
				index = 0,
				length = rawValue.length,
				specialCharPos: number,
				escapedSpecialCharPos: number,
				matchedEscapedChar = 0;
			while (index < length) {
				specialCharPos = rawValue.indexOf(specialLikeChar, index);
				if (specialCharPos === -1) break;
				escapedSpecialCharPos = rawValue.indexOf('[' + specialLikeChar + ']', Math.max(0, index - 1));
				if (escapedSpecialCharPos !== -1 && specialCharPos - 1 === escapedSpecialCharPos) {
					index = specialCharPos + specialLikeChar.length + 1;
					matchedEscapedChar = 2;
					continue;
				}
				index = specialCharPos + 1;
				containsSpecialChar = 1;
				break;
			}
			return containsSpecialChar | matchedEscapedChar;
		}
		public static ConvertObject2Map<TKey, TValue> (obj: any): Map<TKey, TValue> {
			var data: any[][] = [];
			for (var key in obj)
				data.push([key, obj[key]]);
			return new Map<TKey, TValue>(data as Iterable<readonly [TKey, TValue]>);
		}
		public static ConvertMap2Object<TKey, TValue> (map: Map<TKey, TValue>): object {
			var obj: any = {};
			for (var [key, value] of map)
				obj[key] = value;
			return obj;
		}
		public MergeObjectsRecursively (target: any, ...sources: any[]): any {
			if (!sources.length) 
				return target;
			var source = sources.shift();
			if (this.isObject(target) && this.isObject(source)) {
				for (var key in source) {
					if (this.isObject(source[key])) {
						if (!target[key]) 
							Object.assign(target, { [key]: {} });
						this.MergeObjectsRecursively(target[key], source[key]);
					} else {
						Object.assign(target, { [key]: source[key] });
					}
				}
			}
			return this.MergeObjectsRecursively(target, ...sources);
		}
		protected isObject (item: any): boolean {
			return (item && typeof item === 'object' && !Array.isArray(item));
		}
	}
}