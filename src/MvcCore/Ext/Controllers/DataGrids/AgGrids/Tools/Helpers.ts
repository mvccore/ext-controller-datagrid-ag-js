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
		public CloneFiltering (filtering: Map<string, Map<Enums.Operator, string[]>>): Map<string, Map<Enums.Operator, string[]>> {
			var result = new Map<string, Map<Enums.Operator, string[]>>(),
				resultItem: Map<Enums.Operator, string[]>;
			for (var [columnId, filteringItem] of filtering) {
				resultItem = new Map<Enums.Operator, string[]>();
				for (var [operator, filteringValues] of filteringItem)
					resultItem.set(operator, [].slice.apply(filteringValues));
				result.set(columnId, resultItem);
			}
			return result;
		}
		public GetControlTypeByOperatorAndValue (
			operator: Enums.Operator | null, 
			value: string | null, 
			defaultResult: Enums.FilterControlType, 
			serverType: Enums.ServerType
		): Enums.FilterControlType {
			var result = Enums.FilterControlType.UNKNOWN;
			if (operator == null || value == null) return defaultResult;
			var isEqual = operator === Enums.Operator.EQUAL,
				isNotEqual = operator === Enums.Operator.NOT_EQUAL,
				isLike = operator === Enums.Operator.LIKE,
				isNotLike = operator === Enums.Operator.NOT_LIKE;
			if (isEqual || isNotEqual) {
				if (isEqual && serverType === Enums.ServerType.BOOL) {
					result = value === '1'
						? Enums.FilterControlType.IS_TRUE
						: Enums.FilterControlType.IS_FALSE;
				} else if (value === 'null') {
					result = isEqual
						? Enums.FilterControlType.IS_NULL
						: Enums.FilterControlType.IS_NOT_NULL;
				} else {
					result = isEqual
						? Enums.FilterControlType.EQUAL
						: Enums.FilterControlType.NOT_EQUAL;
				}
			} else if (operator === Enums.Operator.LOWER) {
				result = Enums.FilterControlType.LOWER;
			} else if (operator === Enums.Operator.GREATER) {
				result = Enums.FilterControlType.GREATER;
			} else if (operator === Enums.Operator.LOWER_EQUAL) {
				result = Enums.FilterControlType.LOWER_EQUAL;
			} else if (operator === Enums.Operator.GREATER_EQUAL) {
				result = Enums.FilterControlType.GREATER_EQUAL;
			} else if (isLike || isNotLike) {
				var startsAndEndsRegExp = /^%(.*)%$/g,
					startsWithRegExp = /([^%_]+)%$/g,
					endsWithRegExp = /^%([^%_]+)/g;
				if (value.match(startsAndEndsRegExp)) {
					result = isLike
						? Enums.FilterControlType.CONTAINS
						: Enums.FilterControlType.NOT_CONTAINS;
				} else if (value.match(startsWithRegExp)) {
					result = isLike
						? Enums.FilterControlType.STARTS_WITH
						: Enums.FilterControlType.NOT_STARTS_WITH;
				} else if (value.match(endsWithRegExp)) {
					result = isLike
						? Enums.FilterControlType.ENDS_WITH
						: Enums.FilterControlType.NOT_ENDS_WITH;
				} else {
					result = isLike
						? Enums.FilterControlType.CONTAINS
						: Enums.FilterControlType.NOT_CONTAINS;
				}
			}
			if (result === Enums.FilterControlType.UNKNOWN)
				result = defaultResult;
			return result;
		}
		public RetypeFilteringMap2Obj (filtering: Map<string, Map<Enums.Operator, string[]>>): any {
			var newFiltering: any = {};
			for (var [idColumn, filterValues] of filtering.entries()) {
				newFiltering[idColumn] = Tools.Helpers.ConvertMap2Object<Enums.Operator, string[]>(
					filterValues
				) as any;
			}
			return newFiltering;
		}
		public RetypeRequestMaps2Objects (serverRequest: Interfaces.Ajax.IRequest): Interfaces.Ajax.IReqRawObj {
			var result: Interfaces.Ajax.IReqRawObj = { ...serverRequest } as any;
			if (serverRequest.filtering instanceof Map) {
				result.filtering = this.RetypeFilteringMap2Obj(serverRequest.filtering);
			}
			return this.addRequestSystemData(result);
		}
		protected addRequestSystemData (serverRequest: Interfaces.Ajax.IReqRawObj): Interfaces.Ajax.IReqRawObj {
			var serverConfig = this.grid.GetServerConfig();
			serverRequest.id = serverConfig.id;
			serverRequest.mode = serverConfig.clientPageMode;
			serverRequest.path = this.grid.GetGridPath();
			return serverRequest;
		}
		public RetypeRawServerResponse (serverResponse: Interfaces.Ajax.IResponse): Interfaces.Ajax.IResponse {
			serverResponse.filtering = this.retypeFilteringObj2Map(serverResponse.filtering);
			return serverResponse;
		}
		public RetypeRequestObjects2Maps (serverRequest: Interfaces.Ajax.IReqRawObj): Interfaces.Ajax.IRequest {
			var result: Interfaces.Ajax.IRequest = { ...serverRequest } as any;
			result.filtering = this.retypeFilteringObj2Map(serverRequest.filtering);
			return result;
		}
		protected retypeFilteringObj2Map (filtering: any): Map<string, Map<Enums.Operator, string[]>> {
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
			for (var columnName in serverConfig.columns)
				this.normalizeColumnParserArgs(serverConfig.columns[columnName]);
			var ampRe = /&amp;/g;
			serverConfig.urlData = serverConfig.urlData.replace(ampRe, '&');
			serverConfig.urlColumnsChanges = serverConfig.urlColumnsChanges.replace(ampRe, '&');
			serverConfig.urlColumnsStates = serverConfig.urlColumnsStates.replace(ampRe, '&');
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
		public SortConfigColumns (
			serverColumns: AgGrids.Interfaces.IServerConfigs.IColumn[], 
			columnIndexPropName: keyof AgGrids.Interfaces.IServerConfigs.IColumnIndexes
		): AgGrids.Interfaces.IServerConfigs.IColumn[] {
			var indexedMap = new Map<number, AgGrids.Interfaces.IServerConfigs.IColumn[]>(),
				notIndexedSet = new Set<AgGrids.Interfaces.IServerConfigs.IColumn>(),
				serverColumnCfg: AgGrids.Interfaces.IServerConfigs.IColumn,
				columnIndex: number | null;
			for (var serverColumnCfg of serverColumns) {
				columnIndex = serverColumnCfg[columnIndexPropName];
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
				indexedMapKeys = Array.from(indexedMap.keys());
			indexedMapKeys.sort((a, b) => a - b);
			for (var indexedMapKey of indexedMapKeys) {
				for (var serverColumnCfg of indexedMap.get(indexedMapKey)) {
					serverColumnCfg[columnIndexPropName] = index++;
					result.push(serverColumnCfg);
				}
			}
			for (var serverColumnCfg of notIndexedSet) {
				serverColumnCfg[columnIndexPropName] = index++;
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
		public static Trim (str: string, charlist: string): string {
			var whitespace = '',
				l = 0,
				i = 0;
			if (!charlist) {
				// default list
				whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
			} else {
				// preg_quote custom list
				charlist += '';
				whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
			}
			l = str.length;
			for (i = 0; i < l; i++) {
				if (whitespace.indexOf(str.charAt(i)) === -1) {
					str = str.substring(i);
					break;
				}
			}
			l = str.length;
			for (i = l - 1; i >= 0; i--) {
				if (whitespace.indexOf(str.charAt(i)) === -1) {
					str = str.substring(0, i + 1);
					break;
				}
			}
			return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
		}
		public MergeObjectsRecursively (target: any, ...sources: any[]): any {
			if (!sources.length) 
				return target;
			var source = sources.shift();
			if (this.isObjectAndNotArray(target) && this.isObjectAndNotArray(source)) {
				for (var key in source) {
					if (this.isObjectAndNotArray(source[key])) {
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
		protected normalizeColumnParserArgs (configColumn: Interfaces.IServerConfigs.IColumn): void {
			if (configColumn.parserArgs == null || Array.isArray(configColumn.parserArgs)) return;
			if (typeof configColumn.parserArgs == 'object') {
				var parserArgsObj: any = configColumn.parserArgs,
					parserArgsArr: string[] = [];
				for (var key in parserArgsObj)
					if (Number.isSafeInteger(parseInt(key, 10)))
						parserArgsArr.push(parserArgsObj[key]);
				configColumn.parserArgs = parserArgsArr;
			}
		}
		protected isObjectAndNotArray (item: any): boolean {
			return this.isObject(item) && !this.isArray(item);
		}
		protected isObject (obj: any): boolean {
			return obj != null && typeof(obj) == 'object';
		}
		protected isArray (obj: any): boolean {
			if (Array.isArray != null) 
				return Array.isArray(obj);
			return Object.prototype.toString.apply(obj).match(/^\[object ([a-zA-Z0-9]*)Array\]$/g) != null;
		}
	}
}