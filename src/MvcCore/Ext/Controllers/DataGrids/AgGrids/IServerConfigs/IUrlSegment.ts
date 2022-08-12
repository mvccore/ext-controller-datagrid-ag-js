declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.IServerConfigs {
	interface IUrlSegment {
		urlDelimiterPrefix: string;
		urlDelimiterSections: string;
		urlDelimiterSubjectValue: string;
		urlDelimiterSubjects: string;
		urlDelimiterValues: string;
		urlFilterOperators: {
			"!=": string;
			"<": string;
			"<=": string;
			"=": string;
			">": string;
			">=": string;
			"LIKE": string;
			"NOT LIKE": string;
		};
		urlPrefixCount: string;
		urlPrefixFilter: string;
		urlPrefixPage: string;
		urlPrefixSort: string;
		urlSuffixSortAsc: string;
		urlSuffixSortDesc: string;
	}
}