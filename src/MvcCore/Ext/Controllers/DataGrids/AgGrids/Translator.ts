namespace MvcCore.Ext.Controllers.DataGrids.AgGrids {
	export class Translator {
		public static LOCALE_DEFAULT = 'en-US';
		public Static: typeof Translator;
		protected store: { [key: string]: string; };
		protected grid: AgGrid;
		public constructor (grid: AgGrid) {
			this.Static = new.target;
			this.grid = grid;
			var globalLocale = this.grid.GetServerConfig().locales.locale.join(
				AgGrids.Options.SYSTEM_LOCALE_SEPARATOR
			);
			if (window.agGridLocales != null) {
				if (window.agGridLocales[globalLocale] != null) {
					this.store = window.agGridLocales[globalLocale];
				} else {
					this.store = window.agGridLocales[this.Static.LOCALE_DEFAULT];
				}
			}
		}
		public GetStore (): { [key: string]: string; } | null {
			return this.store;
		}
		public Translate (translationKey: string): string {
			if (!this.store) return translationKey;
			return this.store[translationKey];
		}
	}
}