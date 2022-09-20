namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Columns {
	var stringAndDateFilteringModeOrder = [
		Enums.FilterControlType.STARTS_WITH, 
		Enums.FilterControlType.CONTAINS, 
		Enums.FilterControlType.EQUAL,
		Enums.FilterControlType.ENDS_WITH, 

		Enums.FilterControlType.GREATER,
		Enums.FilterControlType.LOWER,
		Enums.FilterControlType.GREATER_EQUAL,
		Enums.FilterControlType.LOWER_EQUAL,

		Enums.FilterControlType.IS_NULL,
		Enums.FilterControlType.IS_NOT_NULL,

		Enums.FilterControlType.NOT_STARTS_WITH, 
		Enums.FilterControlType.NOT_CONTAINS, 
		Enums.FilterControlType.NOT_EQUAL,
		Enums.FilterControlType.NOT_ENDS_WITH,
	];
	var intAndFloatFilteringModeOrder = [
		Enums.FilterControlType.EQUAL,
		Enums.FilterControlType.NOT_EQUAL,

		Enums.FilterControlType.GREATER,
		Enums.FilterControlType.LOWER,
		Enums.FilterControlType.GREATER_EQUAL,
		Enums.FilterControlType.LOWER_EQUAL,

		Enums.FilterControlType.STARTS_WITH, 
		Enums.FilterControlType.CONTAINS, 
		Enums.FilterControlType.ENDS_WITH, 

		Enums.FilterControlType.IS_NULL,
		Enums.FilterControlType.IS_NOT_NULL,

		Enums.FilterControlType.NOT_STARTS_WITH, 
		Enums.FilterControlType.NOT_CONTAINS, 
		Enums.FilterControlType.NOT_ENDS_WITH,
	];
	export class FilterOperatorsCfg {
		public static FILTERING_CONTROL_TYPES = new Map<Enums.FilteringMode, Enums.FilterControlType[]>([
			[Enums.FilteringMode.ALLOW_EQUALS, 			[
				Enums.FilterControlType.EQUAL,
				Enums.FilterControlType.NOT_EQUAL,
				Enums.FilterControlType.IS_TRUE,
				Enums.FilterControlType.IS_FALSE,
			]],
			[Enums.FilteringMode.ALLOW_NULL, 			[
				Enums.FilterControlType.IS_NULL,
				Enums.FilterControlType.IS_NOT_NULL
			]],
			[Enums.FilteringMode.ALLOW_RANGES, 			[
				Enums.FilterControlType.LOWER,
				Enums.FilterControlType.GREATER,
				Enums.FilterControlType.LOWER_EQUAL,
				Enums.FilterControlType.GREATER_EQUAL
			]],
			[Enums.FilteringMode.ALLOW_LIKE_RIGHT_SIDE, [
				Enums.FilterControlType.STARTS_WITH,
				Enums.FilterControlType.NOT_STARTS_WITH
			]],
			[Enums.FilteringMode.ALLOW_LIKE_LEFT_SIDE, 	[
				Enums.FilterControlType.ENDS_WITH,
				Enums.FilterControlType.NOT_ENDS_WITH
			]],
			[Enums.FilteringMode.ALLOW_LIKE_ANYWHERE, 	[
				Enums.FilterControlType.CONTAINS,
				Enums.FilterControlType.NOT_CONTAINS,
				Enums.FilterControlType.STARTS_WITH,
				Enums.FilterControlType.ENDS_WITH,
				Enums.FilterControlType.NOT_STARTS_WITH,
				Enums.FilterControlType.NOT_ENDS_WITH,
			]],
		]);
		public static SERVER_TYPES_CONTROL_TYPES_ORDERS = new Map<Enums.ServerType, Enums.FilterControlType[]>([
			[Enums.ServerType.STRING, 		stringAndDateFilteringModeOrder],
			[Enums.ServerType.BOOL, 		[
				Enums.FilterControlType.IS_TRUE,
				Enums.FilterControlType.IS_FALSE,
				Enums.FilterControlType.IS_NULL,
				Enums.FilterControlType.IS_NOT_NULL,
			]],
			[Enums.ServerType.INT, 			intAndFloatFilteringModeOrder],
			[Enums.ServerType.FLOAT, 		intAndFloatFilteringModeOrder],
			[Enums.ServerType.MONEY, 		intAndFloatFilteringModeOrder],
			[Enums.ServerType.DATE,			stringAndDateFilteringModeOrder],
			[Enums.ServerType.DATE_TIME,	stringAndDateFilteringModeOrder],
			[Enums.ServerType.TIME,			stringAndDateFilteringModeOrder]
		]);
		public static SERVER_TYPES_EXTENDED_FILTER_MENUS = new Map<Enums.ServerType, typeof Columns.FilterMenu>([
			[Enums.ServerType.STRING, 		Columns.FilterMenu],
			[Enums.ServerType.BOOL, 		Columns.FilterMenu],
			[Enums.ServerType.INT, 			Columns.FilterMenus.Int],
			[Enums.ServerType.FLOAT, 		Columns.FilterMenus.Float],
			[Enums.ServerType.MONEY, 		Columns.FilterMenus.Money],
			[Enums.ServerType.DATE,			Columns.FilterMenus.Date],
			[Enums.ServerType.DATE_TIME,	Columns.FilterMenus.DateTime],
			[Enums.ServerType.TIME,			Columns.FilterMenus.Time],
		]);
		public static CONTROL_TYPES_OPERATORS = new Map<Enums.FilterControlType, Enums.Operator>([
			[Enums.FilterControlType.EQUAL,				Enums.Operator.EQUAL],			// column = value
			[Enums.FilterControlType.NOT_EQUAL,			Enums.Operator.NOT_EQUAL],		// column != value
			[Enums.FilterControlType.IS_NULL,			Enums.Operator.EQUAL],			// column IS NULL
			[Enums.FilterControlType.IS_NOT_NULL,		Enums.Operator.NOT_EQUAL],		// column IS NOT NULL
			
			[Enums.FilterControlType.LOWER,				Enums.Operator.LOWER],			// column < value
			[Enums.FilterControlType.GREATER,			Enums.Operator.GREATER],		// column > value
			[Enums.FilterControlType.LOWER_EQUAL,		Enums.Operator.LOWER_EQUAL],	// column <= value
			[Enums.FilterControlType.GREATER_EQUAL,		Enums.Operator.GREATER_EQUAL],	// column >= value
		
			[Enums.FilterControlType.CONTAINS,			Enums.Operator.LIKE],			// column LIKE %value%
			[Enums.FilterControlType.NOT_CONTAINS,		Enums.Operator.NOT_LIKE],		// column NOT LIKE %value%
			[Enums.FilterControlType.STARTS_WITH,		Enums.Operator.LIKE],			// column LIKE value%
			[Enums.FilterControlType.ENDS_WITH,			Enums.Operator.LIKE],			// column LIKE %value
			[Enums.FilterControlType.NOT_STARTS_WITH,	Enums.Operator.NOT_LIKE],		// column NOT LIKE value%
			[Enums.FilterControlType.NOT_ENDS_WITH,		Enums.Operator.NOT_LIKE],		// column NOT LIKE %value
			
			[Enums.FilterControlType.IS_TRUE,			Enums.Operator.EQUAL],			// column = 1
			[Enums.FilterControlType.IS_FALSE,			Enums.Operator.EQUAL],			// column = 0
		]);
		public static CONTROL_TYPES_TEXTS = new Map<Enums.FilterControlType, string>([
			[Enums.FilterControlType.EQUAL,				'equals'],				// column = value
			[Enums.FilterControlType.NOT_EQUAL,			'notEqual'],			// column != value
			[Enums.FilterControlType.IS_NULL,			'blank'],				// column IS NULL
			[Enums.FilterControlType.IS_NOT_NULL,		'notBlank'],			// column IS NOT NULL
			
			[Enums.FilterControlType.LOWER,				'lessThan'],			// column < value
			[Enums.FilterControlType.GREATER,			'greaterThan'],			// column > value
			[Enums.FilterControlType.LOWER_EQUAL,		'lessThanOrEqual'],		// column <= value
			[Enums.FilterControlType.GREATER_EQUAL,		'greaterThanOrEqual'],	// column >= value
		
			[Enums.FilterControlType.CONTAINS,			'contains'],			// column LIKE %value%
			[Enums.FilterControlType.NOT_CONTAINS,		'notContains'],			// column NOT LIKE %value%
			[Enums.FilterControlType.STARTS_WITH,		'startsWith'],			// column LIKE value%
			[Enums.FilterControlType.ENDS_WITH,			'endsWith'],			// column LIKE %value
			[Enums.FilterControlType.NOT_STARTS_WITH,	'notStartsWith'],		// column NOT LIKE value%
			[Enums.FilterControlType.NOT_ENDS_WITH,		'notEndsWith'],			// column NOT LIKE %value
			
			[Enums.FilterControlType.IS_TRUE,			'yes'],					// column = 1
			[Enums.FilterControlType.IS_FALSE,			'no'],					// column = 0
		]);
		public static CONTROL_TYPES_VALUE_PATTERNS = new Map<Enums.FilterControlType, string>([
			[Enums.FilterControlType.EQUAL,				'<value>'],		// column = value
			[Enums.FilterControlType.NOT_EQUAL,			'<value>'],		// column != value
			[Enums.FilterControlType.IS_NULL,			'null'],		// column IS NULL
			[Enums.FilterControlType.IS_NOT_NULL,		'null'],		// column IS NOT NULL
			
			[Enums.FilterControlType.LOWER,				'<value>'],		// column < value
			[Enums.FilterControlType.GREATER,			'<value>'],		// column > value
			[Enums.FilterControlType.LOWER_EQUAL,		'<value>'],		// column <= value
			[Enums.FilterControlType.GREATER_EQUAL,		'<value>'],		// column >= value
		
			[Enums.FilterControlType.CONTAINS,			'%<value>%'],	// column LIKE %value%
			[Enums.FilterControlType.NOT_CONTAINS,		'%<value>%'],	// column NOT LIKE %value%
			[Enums.FilterControlType.STARTS_WITH,		'<value>%'],	// column LIKE value%
			[Enums.FilterControlType.ENDS_WITH,			'%<value>'],	// column LIKE %value
			[Enums.FilterControlType.NOT_STARTS_WITH,	'<value>%'],	// column NOT LIKE value%
			[Enums.FilterControlType.NOT_ENDS_WITH,		'%<value>'],	// column NOT LIKE %value
			
			[Enums.FilterControlType.IS_TRUE,			'1'],			// column = 1
			[Enums.FilterControlType.IS_FALSE,			'0'],			// column = 0
		]);
	}
}