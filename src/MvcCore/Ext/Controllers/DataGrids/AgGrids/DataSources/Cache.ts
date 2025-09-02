namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.DataSources {
	export class Cache {
		public Static: typeof Cache;

		protected helpers: AgGrids.Tools.Helpers;
		protected enabled: boolean;
		protected maxRows: number;
		protected store: Map<string, [number, Interfaces.Ajax.IResponse]>;
		protected reqDataKeys: string[];
		protected rowsCount: number;;
		protected agBaseOptions: Options.AgBases;
		protected rowIds2StoreIds: Map<string, [number, number]>;
		protected storeIds2Keys: Map<number, string>;
		protected storeIdsCounter: number;
		protected rowsIniquelyIdentified: boolean;
		protected cacheBlockSize: number;
		public constructor (grid: AgGrid) {
			this.helpers = grid.GetHelpers();
			var serverConfig = grid.GetServerConfig();
			this.enabled = serverConfig.clientCache;
			this.maxRows = serverConfig.clientMaxRowsInCache ?? 0;
			this.store = new Map<string, [number, Interfaces.Ajax.IResponse]>();
			this.agBaseOptions = grid.GetOptionsManager().GetAgBases();
			this.cacheBlockSize = this.agBaseOptions.GetAgOptions().cacheBlockSize;
			this.rowsIniquelyIdentified = this.agBaseOptions.GetRowsIniquelyIdentified();
			if (this.rowsIniquelyIdentified) {
				this.rowIds2StoreIds = new Map<string, [number, number]>();
				this.storeIds2Keys = new Map<number, string>();
			}
			this.storeIdsCounter = 0;
			this.reqDataKeys = [];
			this.rowsCount = 0;
		}
		public Purge (): this {
			this.store = new Map<string, [number, Interfaces.Ajax.IResponse]>();
			if (this.rowsIniquelyIdentified) {
				this.rowIds2StoreIds = new Map<string, [number, number]>();
				this.storeIds2Keys = new Map<number, string>();
				this.storeIdsCounter = 0;
			}
			this.reqDataKeys = [];
			this.rowsCount = 0;
			return this;
		}
		public GetEnabled (): boolean {
			return this.enabled;
		}
		public SetEnabled (enabled: boolean): this {
			this.enabled = enabled;
			return this;
		}
		public Key (reqData: Interfaces.Ajax.IReqRawObj): string {
			return MD5(JSON.stringify(reqData));
		}
		public Has (reqDataKey: string): boolean {
			if (!this.enabled) return false;
			return this.store.has(reqDataKey);
		}
		public Get (reqDataKey: string): Interfaces.Ajax.IResponse {
			var [, response] = this.store.get(reqDataKey);
			return response;
		}
		public Add (reqDataKey: string, response: Interfaces.Ajax.IResponse): this {
			if (!this.enabled)
				return this;
			var storeId = this.storeIdsCounter++;
			if (this.rowsIniquelyIdentified) {
				this.storeIds2Keys.set(storeId, reqDataKey);
				var row: any,
					rowId: string;
				for (var i = 0, l = response.data.length; i < l; i++) {
					row = response.data[i];
					rowId = this.agBaseOptions.GetRowId(row);
					this.rowIds2StoreIds.set(rowId, [storeId, i]);
				}
			}
			this.store.set(reqDataKey, [storeId, response]);
			this.reqDataKeys.push(reqDataKey);
			this.rowsCount += response.dataCount;
			while (this.rowsCount + this.cacheBlockSize >= this.maxRows && this.maxRows > 0)
				this.removeOldestRecord();
			return this;
		}
		public Update (rowsData: any[]): this {
			if (this.rowsIniquelyIdentified) {
				var newRow: any,
					oldRow: any,
					rowId: string,
					storeId: number,
					index: number,
					storeKey: string,
					response: Interfaces.Ajax.IResponse;
				for (var i = 0, l = rowsData.length; i < l; i++) {
					newRow = rowsData[i];
					rowId = this.agBaseOptions.GetRowId(newRow);
					if (!this.rowIds2StoreIds.has(rowId)) 
						continue;
					[storeId, index] = this.rowIds2StoreIds.get(rowId);
					if (!this.storeIds2Keys.has(storeId)) 
						continue;
					storeKey = this.storeIds2Keys.get(storeId);
					if (!this.store.has(storeKey)) 
						continue;
					[, response] = this.store.get(storeKey);
					if (index >= response.data.length) 
						continue;
					oldRow = response.data[index];
					if (oldRow != null)
						Object.assign(oldRow, newRow);
				}
			}
			return this;
		}
		protected removeOldestRecord (): this {
			var oldestKey = this.reqDataKeys.shift();
			if (this.store.has(oldestKey)) {
				var [storeId, response] = this.store.get(oldestKey);
				
				if (this.rowsIniquelyIdentified) {
					if (this.storeIds2Keys.has(storeId))
						this.storeIds2Keys.delete(storeId);
					var rowId: string,
						row: any;
					for (var i = 0, l = response.data.length; i < l; i++) {
						row = response.data[i];
						rowId = this.agBaseOptions.GetRowId(row);
						if (this.rowIds2StoreIds.has(rowId))
							this.rowIds2StoreIds.delete(rowId);
					}
				}
				var dataCount = response.dataCount;
				this.store.delete(oldestKey);
				this.rowsCount -= dataCount;
			}
			return this;
		}
	}
}