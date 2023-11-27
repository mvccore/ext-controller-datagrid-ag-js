declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces.IServerConfigs {
    interface IUrlSegment {
        urlDelimiterPrefix: string;
        urlDelimiterSections: string;
        urlDelimiterSubjectValue: string;
        urlDelimiterSubjects: string;
        urlDelimiterValues: string;
        urlFilterOperators: Map<Enums.Operator, string>;
        urlPrefixCount: string;
        urlPrefixFilter: string;
        urlPrefixPage: string;
        urlPrefixSort: string;
        urlSuffixSortAsc: string;
        urlSuffixSortDesc: string;
    }
}
