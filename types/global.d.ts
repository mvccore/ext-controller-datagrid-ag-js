import * as AgGridAll from "ag-grid-community";

import * as MomentAll from "moment";

export {};

declare global {
	MomentAll.default
	namespace agGrid {
		declare var moment: MomentAll.default;
		class Grid extends AgGridAll.Grid {}
		interface IHeaderComp extends AgGridAll.IHeaderComp {}
		interface IHeaderParams extends AgGridAll.IHeaderParams {}
		interface ValueFormatterParams<TData = any, TValue = any> extends AgGridAll.ValueFormatterParams<TData, TValue> {}
		interface GridOptions<TData = any> extends AgGridAll.GridOptions<TData> {}
		interface GridApi<TData = any> extends AgGridAll.GridApi<TData> {}
		interface ColDef<TData = any> extends AgGridAll.ColDef<TData> {}
		interface ColGroupDef<TData = any> extends AgGridAll.ColGroupDef<TData> {}
		interface ColumnResizedEvent <TData = any>extends AgGridAll.ColumnResizedEvent<TData> {}
		interface ColumnMovedEvent<TData = any> extends AgGridAll.ColumnMovedEvent<TData> {}
		interface FilterChangedEvent<TData = any> extends AgGridAll.FilterChangedEvent<TData> {}
		interface SortChangedEvent<TData = any> extends AgGridAll.SortChangedEvent<TData> {}
		interface FirstDataRenderedEvent<TData = any> extends AgGridAll.FirstDataRenderedEvent<TData> {}
		interface GridReadyEvent<TData = any> extends AgGridAll.GridReadyEvent<TData> {}
		interface GridSizeChangedEvent<TData = any> extends AgGridAll.GridSizeChangedEvent<TData> {}
		interface ViewportChangedEvent<TData = any> extends AgGridAll.ViewportChangedEvent<TData> {}
		interface IDatasource extends AgGridAll.IDatasource {}
		interface IGetRowsParams extends AgGridAll.IGetRowsParams {}
		interface SortModelItem extends AgGridAll.SortModelItem {}
		interface IFilterDef extends AgGridAll.IFilterDef {}
		interface PaginationNumberFormatterParams extends AgGridAll.PaginationNumberFormatterParams {}
		interface FilterModelItem {
			type: 'empty' | 'equals' | 'notEqual' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual' | 'inRange' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'blank' | 'notBlank';
			filter: string;
			filterType: string | 'scalar' | 'number' | 'text' | 'date';
		}
		class RowNode<TData = any> extends AgGridAll.RowNode<TData> {}
	}
}

