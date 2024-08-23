declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Enums {
    enum FilteringMode {
        DISABLED = 0,
        SINGLE_COLUMN = 1,
        MULTIPLE_COLUMNS = 2,
        ALLOW_EQUALS = 4,
        ALLOW_RANGES = 8,
        ALLOW_LIKE_RIGHT_SIDE = 16,
        ALLOW_LIKE_LEFT_SIDE = 32,
        ALLOW_LIKE_ANYWHERE = 64,
        ALLOW_NULL = 128,
        ALLOW_NOT_NULL = 256,
        ALLOW_ALL_WITH_NULL = 252,// 4|8|16|32|64|128
        ALLOW_ALL_NOT_NULL = 380
    }
}
