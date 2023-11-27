declare namespace MvcCore.Ext.Controllers.DataGrids.AgGrids.Interfaces {
    namespace ISubClasses {
        namespace Columns {
            interface FilterMenus {
                Date?: typeof AgGrids.Columns.FilterMenus.Date;
                DateTime?: typeof AgGrids.Columns.FilterMenus.DateTime;
                Time?: typeof AgGrids.Columns.FilterMenus.Time;
                Int?: typeof AgGrids.Columns.FilterMenus.Int;
                Float?: typeof AgGrids.Columns.FilterMenus.Float;
                Money?: typeof AgGrids.Columns.FilterMenus.Money;
            }
        }
        interface Columns {
            FilterMenus?: ISubClasses.Columns.FilterMenus;
            FilterHeader?: typeof AgGrids.Columns.FilterHeader;
            FilterMenu?: typeof AgGrids.Columns.FilterMenu;
            Manager?: typeof AgGrids.Columns.Manager;
            SortHeader?: typeof AgGrids.Columns.SortHeader;
            ViewHelper?: typeof AgGrids.Columns.ViewHelper;
            VisibilityMenu?: typeof AgGrids.Columns.VisibilityMenu;
        }
        interface DataSources {
            MultiplePagesMode?: typeof AgGrids.DataSources.MultiplePagesMode;
            SinglePageMode?: typeof AgGrids.DataSources.SinglePageMode;
            Cache?: typeof AgGrids.DataSources.Cache;
        }
        interface EventsManagers {
            MultiplePagesMode?: typeof AgGrids.EventsManagers.MultiplePagesMode;
            SinglePageMode?: typeof AgGrids.EventsManagers.SinglePageMode;
        }
        interface Options {
            AgBases?: typeof AgGrids.Options.AgBases;
            Manager?: typeof AgGrids.Options.Manager;
        }
        interface Tools {
            Helpers?: typeof AgGrids.Tools.Helpers;
            Translator?: typeof AgGrids.Tools.Translator;
        }
    }
    interface IClasses {
        Columns?: ISubClasses.Columns;
        DataSources?: ISubClasses.DataSources;
        EventsManager?: ISubClasses.EventsManagers;
        Options?: ISubClasses.Options;
        Tools?: ISubClasses.Tools;
    }
}
