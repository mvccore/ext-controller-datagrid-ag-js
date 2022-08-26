declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IServerResponse {
		totalCount: number;
		offset: number;
		limit: number;
		sorting: [string, 0 | 1][];
		filtering: Map<string, Map<Enums.Operator, string[]>>;
		controls: {
			countScales?: string;
			status?: string;
			paging?: string;
		};
		url: string;
		path: string;
		dataCount: number;
		data: any[];
	}
}