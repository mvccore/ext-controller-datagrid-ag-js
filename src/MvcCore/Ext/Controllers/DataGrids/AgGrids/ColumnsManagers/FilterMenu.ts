namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers {
	export class FilterMenu implements agGrid.IFilterComp<any> {
		getGui(): HTMLElement {
			return null;
		}
		destroy?(): void {
			
		}
		isFilterActive(): boolean {
			return true;
		}
		getModel() {
			
		}
		onNewRowsLoaded?(): void {
			
		}
		onAnyFilterChanged?(): void {
			
		}
		doesFilterPass(params: agGrid.IDoesFilterPassParams): boolean {
			return false;
		}
		getModelAsString?(model: any): string {
			return '';
		}
		setModel() {
		}
	}
}