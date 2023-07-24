namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export abstract class DataSource {
		public Static: typeof DataSource;

		protected grid: AgGrid;
		protected optionsManager: AgGrids.Options.Manager;
		protected eventsManager: AgGrids.EventsManager;
		protected helpers: AgGrids.Tools.Helpers;

		protected initialData: Interfaces.Ajax.IResponse;
		protected cache: DataSources.Cache;
		protected pageReqData?: Interfaces.Ajax.IReqRawObj;
		protected serverConfig: Interfaces.IServerConfig;
		protected docTitleChange: boolean;
		protected docTitlePattern: string;
		protected lastHistory: [Interfaces.Ajax.IReqRawObj, string, number, number] = [null, null, null, null];

		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			this.optionsManager = grid.GetOptionsManager();
			this.eventsManager = grid.GetEvents();
			this.helpers = grid.GetHelpers();
			this.initialData = grid.GetInitialData();
			this.serverConfig = grid.GetServerConfig();
			this.docTitleChange = this.serverConfig.clientTitleTemplate != null;
			this.docTitlePattern = `<${this.serverConfig.gridUrlParamName}>`;
		}

		public abstract ExecRequest (reqData: Interfaces.Ajax.IReqRawObj, changeUrl: boolean): this;

		public SetLastHistory (lastHistory: [Interfaces.Ajax.IReqRawObj, string, number, number]): this {
			this.lastHistory = lastHistory;
			return this;
		}
		public GetLastHistory (): [Interfaces.Ajax.IReqRawObj, string, number, number] {
			return this.lastHistory;
		}
		public BrowserHistoryReplace (stateData: Interfaces.Ajax.IReqRawObj, url: string, page: number, count: number): this {
			if (this.serverConfig.clientChangeHistory) {
				var title = this.docTitleChange
					? this.CompleteDocumentTitle(stateData, page, count)
					: document.title;
				stateData.title = title;
				history.replaceState(stateData, title, url);
				this.SetLastHistory([stateData, url, page, count]);
				if (this.docTitleChange)
					document.title = title;
			}
			return this;
		}
		public BrowserHistoryPush (stateData: Interfaces.Ajax.IReqRawObj, url: string, page: number, count: number): this {
			if (this.serverConfig.clientChangeHistory) {
				var title = this.docTitleChange
					? this.CompleteDocumentTitle(stateData, page, count)
					: document.title;
				stateData.title = title;
				history.pushState(stateData, title, url);
				this.SetLastHistory([stateData, url, page, count]);
				if (this.docTitleChange)
					document.title = title;
			}
			return this;
		}
		public AjaxLoad (url: string, method: string, data: Interfaces.Ajax.IReqRawObj, type: string, success: (rawResponse: AgGrids.Interfaces.Ajax.IResponse) => void): void {
			Ajax.load(<Ajax.LoadConfig>{
				url: url,
				method: method,
				data: data,
				type: type,
				success: success
			});
		}
		public CompleteDocumentTitle (stateData: Interfaces.Ajax.IReqRawObj, page: number, count: number): string {
			var controlsTexts = this.serverConfig.controlsTexts,
				docTitleReplacements = [
					controlsTexts.get(Enums.ControlText.TITLE_PAGE)
						.replace('{0}', page.toString()),
					controlsTexts.get(Enums.ControlText.TITLE_SCALE)
						.replace('{0}', count.toString())
				];
			
			this.completeDocumentTitleSorting(
				stateData.sorting as Types.SortItem[],
				docTitleReplacements
			);
			this.completeDocumentTitleFiltering(
				stateData.filtering,
				docTitleReplacements
			);
			return this.serverConfig.clientTitleTemplate.replace(
				this.docTitlePattern,
				docTitleReplacements.join(', ')
			);
		}
		protected completeDocumentTitleSorting (
			sorting: Types.SortItem[], 
			docTitleReplacements: string[]
		): this {
			if (sorting.length > 0) {
				var sortingStrItems: string[] = [],
					columns = this.serverConfig.columns,
					controlsTexts = this.serverConfig.controlsTexts;
				for (var [columnUrlName, sortDir] of sorting)
				sortingStrItems.push(
						columns[columnUrlName].headingName + ' ' + 
						(sortDir ? '\u2193' : '\u2191')
					);
				docTitleReplacements.push(
					controlsTexts.get(Enums.ControlText.TITLE_SORT)
						.replace('{0}', sortingStrItems.join(', '))
				);
			}
			return this;
		}
		protected completeDocumentTitleFiltering (
			stateDataFiltering: any, 
			docTitleReplacements: string[]
		): this {
			var filteringColumnsUrlNames = Object.keys(stateDataFiltering),
				filteringStrItems: string[] = [],
				columns = this.serverConfig.columns,
				controlsTexts = this.serverConfig.controlsTexts,
				translator = this.grid.GetTranslator(),
				urlDelimiterValues = this.serverConfig.urlSegments.urlDelimiterValues,
				filteringValuesByControlType: Map<Enums.FilterControlType, string[]>,
				controlText: string;
			if (filteringColumnsUrlNames.length > 0) {
				for (var columnUrlName of filteringColumnsUrlNames) {
					filteringValuesByControlType = this.completeDocumentTitleFilteringItem(
						columnUrlName, stateDataFiltering[columnUrlName]
					);
					for (var [controlType, values] of filteringValuesByControlType.entries()) {
						controlText = AgGrids.Columns.FilterOperatorsCfg.CONTROL_TYPES_TEXTS.get(
							controlType
						);
						controlText = translator.Translate(controlText);
						controlText = controlText.substring(0, 1).toLocaleLowerCase() + controlText.substring(1);
						filteringStrItems.push(
							columns[columnUrlName].headingName + ' - ' + 
							controlText + ': ' + 
							values.join(urlDelimiterValues + ' ')
						);
					}
				}
				docTitleReplacements.push(
					controlsTexts.get(Enums.ControlText.TITLE_FILTER)
						.replace('{0}', filteringStrItems.join(', '))
				);
			}
			return this;
		}
		protected completeDocumentTitleFilteringItem (columnUrlName: string, filteringItem: any): Map<Enums.FilterControlType, string[]> {
			var result = new Map<Enums.FilterControlType, string[]>(),
				columns = this.serverConfig.columns,
				operator: Enums.Operator,
				filteringValues: string[],
				serverColumnCfg: Interfaces.IServerConfigs.IColumn,
				serverType: Enums.ServerType,
				allServerTypesControlTypesOrders: Map<Enums.ServerType, Enums.FilterControlType[]>,
				allControlTypes: Enums.FilterControlType[],
				currentControlType: Enums.FilterControlType;
			for (var operatorRaw in filteringItem) {
				operator = operatorRaw as Enums.Operator;
				filteringValues = filteringItem[operatorRaw];
				for (var filteringValue of filteringValues) {
					serverColumnCfg = columns[columnUrlName];
					serverType = serverColumnCfg.types[serverColumnCfg.types.length - 1] as any;
					allServerTypesControlTypesOrders = AgGrids.Columns.FilterOperatorsCfg.SERVER_TYPES_CONTROL_TYPES_ORDERS;
					allControlTypes = allServerTypesControlTypesOrders.has(serverType)
							? allServerTypesControlTypesOrders.get(serverType)
							: allServerTypesControlTypesOrders.get(Enums.ServerType.STRING);
					currentControlType = this.helpers.GetControlTypeByOperatorAndValue(
						operator, 
						filteringValue, 
						allControlTypes.length > 0
							? allControlTypes[0]
							: Enums.FilterControlType.UNKNOWN,
						serverType
					);
					if (result.has(currentControlType)) {
						result.get(currentControlType).push(filteringValue);
					} else {
						result.set(currentControlType, [filteringValue]);
					}
				}
			}
			return result;
		}

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
			var grid = this.grid;
			this.cache = new grid.Static.Classes.DataSources.Cache(grid);
			this.pageReqData = this.helpers.RetypeRequestMaps2Objects({
				offset: grid.GetOffset(),
				limit: grid.GetLimit(),
				sorting: grid.GetSorting(),
				filtering: grid.GetFiltering(),
			});
		}
		protected getReqUrlMethodAndType (): [string, string, string] {
			var serverCfg = this.grid.GetServerConfig(),
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
	}
}