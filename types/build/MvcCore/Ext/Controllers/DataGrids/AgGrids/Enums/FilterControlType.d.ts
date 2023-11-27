declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Enums {
    enum FilterControlType {
        UNKNOWN = 0,
        EQUAL = 1,
        NOT_EQUAL = 2,
        IS_NULL = 4,
        IS_NOT_NULL = 8,
        CONTAINS = 16,
        NOT_CONTAINS = 32,
        STARTS_WITH = 64,
        ENDS_WITH = 128,
        NOT_STARTS_WITH = 256,
        NOT_ENDS_WITH = 512,
        LOWER = 1024,
        LOWER_EQUAL = 2048,
        GREATER = 4096,
        GREATER_EQUAL = 8192,
        IS_TRUE = 16384,
        IS_FALSE = 32768
    }
}
