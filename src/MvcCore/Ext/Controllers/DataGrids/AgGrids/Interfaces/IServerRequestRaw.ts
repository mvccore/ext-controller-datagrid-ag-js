declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
	interface IServerRequestRaw extends Omit<IServerRequest, 'sorting' | 'filtering'> {
		id: string;
		mode: number;
		path: string;
		sorting: object;
		filtering: object;
	}
}