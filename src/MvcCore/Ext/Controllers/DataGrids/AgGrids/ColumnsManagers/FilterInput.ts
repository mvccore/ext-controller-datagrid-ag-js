namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.ColumnsManagers {
	export class FilterInput implements agGrid.IFloatingFilterComp<any> {
		eGui: HTMLDivElement;
		currentValue: any;
		eFilterInput: HTMLInputElement;
		init (params: agGrid.IFloatingFilterParams<any>): void {
			this.eGui = document.createElement('div');
			this.eGui.innerHTML = '<input type="text" style="width:calc(100% - 10px)" />';
			this.currentValue = null;
			this.eFilterInput = this.eGui.querySelector('input');
			///@ts-ignore
			this.eFilterInput.style.color = params.color;
	 
			const onInputBoxChanged = () => {
				if (this.eFilterInput.value === '') {
					// clear the filter
					params.parentFilterInstance(instance => {
						instance.onFloatingFilterChanged(null, null);
					});
					return;
				}
	 
				this.currentValue = Number(this.eFilterInput.value);
				params.parentFilterInstance(instance => {
					// TODO: tohle tady nebude, prostě se pošle to co tam je do gridu a provede se AJAX request
					instance.onFloatingFilterChanged('greaterThan', this.currentValue);
				});
			}
	 
			this.eFilterInput.addEventListener('input', onInputBoxChanged);
		}
	 
		onParentModelChanged (parentModel: any, event: agGrid.FilterChangedEvent<any>): void {
			// When the filter is empty we will receive a null message her
			if (!parentModel) {
				this.eFilterInput.value = '';
				this.currentValue = null;
			} else {
				this.eFilterInput.value = parentModel.filter + '';
				this.currentValue = parentModel.filter;
			}
		}
	 
		getGui () {
			return this.eGui;
		}

		// Optional methods

		// Gets called every time the popup is shown, after the GUI returned in
		// getGui is attached to the DOM. If the filter popup is closed and re-opened, this method is
		// called each time the filter is shown. This is useful for any logic that requires attachment
		// before executing, such as putting focus on a particular DOM element. 
		afterGuiAttached (params?: agGrid.IAfterGuiAttachedParams): void {

		}

		// Gets called when the floating filter is destroyed. Like column headers,
		// the floating filter lifespan is only when the column is visible,
		// so they are destroyed if the column is made not visible or when a user
		// scrolls the column out of view with horizontal scrolling.
		destroy (): void {

		}
	}
}