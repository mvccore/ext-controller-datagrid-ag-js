namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources.MultiplePagesModes {
	export class Cache {
		public Static: typeof Cache;

		protected maxRows: number;
		protected enabled: boolean;
		protected store: Map<string, Interfaces.IServerResponse>;
		protected keys: string[];
		protected rowsCount: number;
		public constructor (grid: AgGrid) {
			var serverConfig = grid.GetServerConfig();
			this.maxRows = serverConfig.clientMaxRowsInCache;
			this.enabled = serverConfig.clientMaxRowsInCache > 0;
			this.store = new Map<string, Interfaces.IServerResponse>();
			this.keys = [];
			this.rowsCount = 0;
		}
		public Key (obj: any): string {
			if (!this.enabled) return '';
			return MD5(JSON.stringify(obj));
		}
		public Has (key: string): boolean {
			if (!this.enabled) return false;
			return this.store.has(key);
		}
		public Get (key: string): Interfaces.IServerResponse {
			return this.store.get(key);
		}
		public Add (key: string, response: Interfaces.IServerResponse): this {
			this.store.set(key, response);
			this.keys.push(key);
			this.rowsCount += response.dataCount;
			while (this.rowsCount > this.maxRows)
				this.removeOldestRecord();
			return this;
		}
		protected removeOldestRecord (): this {
			var oldestKey = this.keys.shift();
			var dataCount = this.store.get(oldestKey).dataCount;
			this.store.delete(oldestKey);
			this.rowsCount -= dataCount;
			return this;
		}
	}
}