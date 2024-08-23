declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Enums {
    enum FilterControlType {
        UNKNOWN = 0,
        EQUAL = 1,// value		=> column = value
        NOT_EQUAL = 2,// !value		=> column != value
        IS_NULL = 4,// null			=> column IS NULL
        IS_NOT_NULL = 8,// !null		=> column IS NOT NULL
        CONTAINS = 16,// %value%		=> column LIKE %value%
        NOT_CONTAINS = 32,// !%value%		=> column NOT LIKE %value%
        STARTS_WITH = 64,// value%		=> column LIKE value%
        ENDS_WITH = 128,// %value		=> column LIKE %value
        NOT_STARTS_WITH = 256,// !value%		=> column NOT LIKE value%
        NOT_ENDS_WITH = 512,// !%value		=> column NOT LIKE %value
        LOWER = 1024,// <value		=> column < value
        LOWER_EQUAL = 2048,// <=value		=> column <= value
        GREATER = 4096,// >value		=> column > value
        GREATER_EQUAL = 8192,// >=value		=> column >= value
        IS_TRUE = 16384,// value = 1
        IS_FALSE = 32768
    }
}
