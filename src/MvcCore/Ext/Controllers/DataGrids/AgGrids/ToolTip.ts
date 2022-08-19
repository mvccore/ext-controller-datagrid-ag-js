namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class ToolTip {
		protected eGui: HTMLDivElement;
		init (params: MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.ITooltipParams): void {
			const eGui = this.eGui = document.createElement('div');
			const color = params.color || 'white';
			const data = params.api.getDisplayedRowAtIndex(params.rowIndex)?.data;
			eGui.classList.add('custom-tooltip');
			///@ts-ignore
			eGui.style['background-color'] = color;
			eGui.innerHTML = `
				<p>
					<span class"name">${data.athlete}</span>
				</p>
				<p>
					<span>Country: </span>
					${data.country}
				</p>
				<p>
					<span>Total: </span>
					${data.total}
				</p>
			`;
		}
		getGui (): HTMLDivElement {
			return this.eGui;
		}
	}
}