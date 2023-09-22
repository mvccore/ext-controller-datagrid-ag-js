import * as AgGridAll from "ag-grid-community";

export {};

declare global {
	var agGridLocales: {
		[locale: string]: {
			[key: string]: string;
		}
	}
	namespace agGrid {
		class Grid extends AgGridAll.Grid {}
		type InbuiltParentType = AgGridAll.IFloatingFilterParent & AgGridAll.IFilter;
		type IFloatingFilterParentCallback<P = InbuiltParentType> = AgGridAll.IFloatingFilterParentCallback<P>;
		type ScrollDirection = AgGridAll.ScrollDirection;
		interface Column extends AgGridAll.Column {}
		interface GridApi<TData = any> extends AgGridAll.GridApi<TData> {}
		interface ColumnApi extends AgGridAll.ColumnApi {}
		interface IHeaderComp extends AgGridAll.IHeaderComp {}
		interface IHeaderParams<TData = any> extends AgGridAll.IHeaderParams<TData> {}
		interface ColumnState extends AgGridAll.ColumnState {}
		interface ColumnStateParams extends AgGridAll.ColumnStateParams {}
		interface ApplyColumnStateParams extends AgGridAll.ApplyColumnStateParams {}
		interface IFilterComp<TData = any> extends AgGridAll.IFilterComp<TData> {}
		interface IFilterParams<TData = any> extends AgGridAll.IFilterParams<TData> {}
		class AgPromise<T> extends AgGridAll.AgPromise<T> {}
		interface IDoesFilterPassParams extends AgGridAll.IDoesFilterPassParams {}
		interface IAfterGuiAttachedParams extends AgGridAll.IAfterGuiAttachedParams {}
		interface IFloatingFilterComp<P = any> extends AgGridAll.IFloatingFilterComp<P> {}
		interface IFloatingFilterParams<P = InbuiltParentType, TData = any> extends AgGridAll.IFloatingFilterParams<P, TData> {}
		interface FilterChangedEvent<TData = any> extends AgGridAll.FilterChangedEvent<TData> {}
		interface ValueFormatterParams<TData = any, TValue = any> extends AgGridAll.ValueFormatterParams<TData, TValue> {}
		interface SelectionChangedEvent<TData = any> extends AgGridAll.SelectionChangedEvent<TData> {}
		interface GridReadyEvent<TData = any> extends AgGridAll.GridReadyEvent<TData> {}
		interface BodyScrollEvent<TData = any> extends AgGridAll.BodyScrollEvent<TData> {}
		interface ModelUpdatedEvent<TData = any> extends AgGridAll.ModelUpdatedEvent<TData> {}
		interface RowDataUpdatedEvent<TData = any> extends AgGridAll.RowDataUpdatedEvent<TData> {}
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
		interface ICellRendererParams<TData = any, TValue = any> extends AgGridAll.ICellRendererParams<TData, TValue> {}
		interface CellKeyDownEvent<TData = any, TValue = any> extends AgGridAll.CellKeyDownEvent<TData, TValue> {}
		interface CellKeyPressEvent<TData = any, TValue = any> extends AgGridAll.CellKeyPressEvent<TData, TValue> {}
		interface CellClickedEvent<TData = any, TValue = any> extends AgGridAll.CellClickedEvent<TData, TValue> {}
		interface CellMouseDownEvent<TData = any, TValue = any> extends AgGridAll.CellMouseDownEvent<TData, TValue> {}
		interface CellDoubleClickedEvent<TData = any, TValue = any> extends AgGridAll.CellDoubleClickedEvent<TData, TValue> {}
		interface CellMouseOverEvent<TData = any, TValue = any> extends AgGridAll.CellMouseOverEvent<TData, TValue> {}
		interface CellMouseOutEvent<TData = any, TValue = any> extends AgGridAll.CellMouseOutEvent<TData, TValue> {}
		interface CellContextMenuEvent<TData = any, TValue = any> extends AgGridAll.CellContextMenuEvent<TData, TValue> {}
		interface CellEditingStartedEvent<TData = any, TValue = any> extends AgGridAll.CellEditingStartedEvent<TData, TValue> {}
		interface CellEditingStoppedEvent<TData = any, TValue = any> extends AgGridAll.CellEditingStoppedEvent<TData, TValue> {}
		interface CellValueChangedEvent<TData = any, TValue = any> extends AgGridAll.CellValueChangedEvent<TData, TValue> {}
		interface CellEditRequestEvent<TData = any, TValue = any> extends AgGridAll.CellEditRequestEvent<TData, TValue> {}
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