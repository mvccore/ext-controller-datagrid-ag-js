namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class Cache {
		public Static: typeof Cache;

		protected enabled: boolean;
		protected maxRows: number;
		protected store: Map<string, Interfaces.Ajax.IResponse>;
		protected keys: string[];
		protected rowsCount: number;;
		protected agBaseOptions: Options.AgBases;
		protected rows: Map<string, any>;
		protected rowsIniquelyIdentified: boolean
		public constructor (grid: AgGrid) {
			var serverConfig = grid.GetServerConfig();
			this.enabled = serverConfig.clientCache;
			this.maxRows = serverConfig.clientMaxRowsInCache ?? 0;
			this.store = new Map<string, Interfaces.Ajax.IResponse>();
			this.agBaseOptions = grid.GetOptionsManager().GetAgBases();
			this.rowsIniquelyIdentified = this.agBaseOptions.GetRowsIniquelyIdentified();
			if (this.rowsIniquelyIdentified)
				this.rows = new Map<string, any>();
			this.keys = [];
			this.rowsCount = 0;
		}
		public GetEnabled (): boolean {
			return this.enabled;
		}
		public SetEnabled (enabled: boolean): this {
			this.enabled = enabled;
			return this;
		}
		public Key (obj: any): string {
			return MD5(JSON.stringify(obj));
		}
		public Has (key: string): boolean {
			if (!this.enabled) return false;
			return this.store.has(key);
		}
		public Get (key: string): Interfaces.Ajax.IResponse {
			var response = this.store.get(key);
			if (this.rowsIniquelyIdentified) {
				// replace ids with real records
				var rowId: string,
					data: any[] = [];
				for (var i = 0, l = response.data.length; i < l; i++) {
					rowId = response.data[i];
					data.push(this.rows.get(rowId));
				}
				response.data = data;
			}
			return response;
		}
		public Add (key: string, response: Interfaces.Ajax.IResponse): this {
			if (!this.enabled)
				return this;
			if (this.rowsIniquelyIdentified) {
				// replace real records with ids
				var row: any,
					rowId: string,
					data: string[] = [];
				for (var i = 0, l = response.data.length; i < l; i++) {
					row = response.data[i];
					rowId = this.agBaseOptions.GetRowId(row);
					data.push(rowId);
					this.rows.set(rowId, row);
				}
				response.data = data;
			}
			this.store.set(key, response);
			this.keys.push(key);
			this.rowsCount += response.dataCount;
			while (this.rowsCount > this.maxRows && this.maxRows > 0)
				this.removeOldestRecord();
			return this;
		}
		public Update (rowsData: any[]): this {
			if (this.rowsIniquelyIdentified) {
				var newRow: any,
					oldRow: any,
					rowId: string;
				for (var i = 0, l = rowsData.length; i < l; i++) {
					newRow = rowsData[i];
					rowId = this.agBaseOptions.GetRowId(newRow);
					oldRow = this.rows.get(rowId);
					if (oldRow != null)
						Object.assign(oldRow, newRow);
				}
			}
			return this;
		}
		protected removeOldestRecord (): this {
			var oldestKey = this.keys.shift();
			if (this.store.has(oldestKey)) {
				if (this.rowsIniquelyIdentified) {
					// remove real row records
					var storeRecord = this.store.get(oldestKey),
						rowId: string;
					for (var i = 0, l = storeRecord.data.length; i < l; i++) {
						rowId = storeRecord.data[i];
						if (this.rows.has(rowId))
							this.rows.delete(rowId);
					}
				}
				var dataCount = this.store.get(oldestKey).dataCount;
				this.store.delete(oldestKey);
				this.rowsCount -= dataCount;
			}
			return this;
		}
	}
}