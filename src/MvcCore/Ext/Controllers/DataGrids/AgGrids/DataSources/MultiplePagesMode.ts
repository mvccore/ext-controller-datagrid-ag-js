namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class MultiplePagesMode extends MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSource {
		public Static: typeof MultiplePagesMode;

		protected eventsManager: AgGrids.EventsManagers.MultiplePagesMode;

		public constructor (grid: AgGrid) {
			super(grid);
			this.eventsManager = grid.GetEvents() as AgGrids.EventsManagers.MultiplePagesMode;
			var reqData: Interfaces.IServerRequestRaw = this.helpers.RetypeRequest2RawRequest({
				offset: this.grid.GetOffset(),
				limit: this.grid.GetServerConfig().count,
				sorting: this.grid.GetSorting(),
				filtering: this.grid.GetFiltering(),
			});
			history.replaceState(reqData, document.title, location.href);
		}

		public Load (): this {
			var reqData: Interfaces.IServerRequestRaw = this.helpers.RetypeRequest2RawRequest({
				offset: this.grid.GetOffset(),
				limit: this.grid.GetServerConfig().count,
				sorting: this.grid.GetSorting(),
				filtering: this.grid.GetFiltering(),
			});
			return this.ExecRequest(reqData, true);
		}
		public ExecRequest (reqData: Interfaces.IServerRequestRaw, changeUrl: boolean = true): this {
			var agGridApi: agGrid.GridApi<any> = this.options.GetAgOptions().api;
			agGridApi.showLoadingOverlay();
			var [reqDataUrl, reqMethod, reqType] = this.getReqUrlMethodAndType();
			Ajax.load(<Ajax.LoadConfig>{
				url: reqDataUrl,
				method: reqMethod,
				data: reqData,
				type: reqType,
				success: this.handleResponse.bind(this, reqData, changeUrl)
			});
			return this;
		}
		protected handleResponse (reqData: Interfaces.IServerRequestRaw, changeUrl: boolean, response: AgGrids.Interfaces.IServerResponse): void {
			var agGridApi: agGrid.GridApi<any> = this.options.GetAgOptions().api;
			agGridApi.setRowData(response.data);

			if (response.controls != null) {
				var elms = this.options.GetElements(),
					controls = response.controls;
				if (elms.countScalesControl != null && controls.countScales != null) {
					elms.countScalesControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.countScales),
						elms.countScalesControl
					);
				}
				if (elms.statusControl != null && controls.status != null) {
					elms.statusControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.status),
						elms.statusControl
					);
				}
				if (elms.pagingControl != null && controls.paging != null) {
					this.eventsManager.RemovePagingEvents();
					elms.pagingControl.parentNode.replaceChild(
						this.helpers.GetHtmlElementFromString(controls.paging),
						elms.pagingControl
					);
					this.options.InitBottomControls();
					this.eventsManager.AddPagingEvents();
				}
			}
			
			if (changeUrl)
				history.pushState(reqData, document.title, response.url);

			// TODO: set up sorting and filtering from server
			
			// TODO: change url
		}

	}
}