define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'modules/helper',
    'models/topBar',
    'models/searchBar',
    'views/shared/topBar',
    'views/shared/calendar',
    'views/findTable/findTable',
    'views/searchResults/searchBar'
],

function ($, _, Backbone, app, Helper, TopBar, SearchBar, TopBarView, CalendarView, ContentLayout, SearchBarView) {
    return app.module('FindTable', function (FindTable) {
        _.extend(FindTable, {
            topBar: new TopBar({ title: 'Find a Table' }),
            calendarTopBar: new TopBar({
                leftText: 'Cancel',
                leftUrl: '',
                title: 'Date'
            }),
            getSearchModel: function (party, date, time) {
                if (typeof date == 'string') date = Helper.parseDate(date, time);

                return new SearchBar({
                    showTimingBar: true,
                    showTimes: true,
                    party: party,
                    date: date,
                    time: time
                });
            },
            ContentLayout: ContentLayout,
            TopBarView: TopBarView,
            SearchBarView: SearchBarView,
            CalendarView: CalendarView,            
        });
    });
});