define([
	'jquery',
	'underscore',
	'backbone',
	'app',	
    'models/topBar',
    'models/searchBar',
    'views/shared/topBar',
    'views/shared/calendar',
    'views/searchResults/searchResults',
    'views/searchResults/restaurant',
    'views/searchResults/restaurants',
    'views/searchResults/searchBar'
],

function ($, _, Backbone, app, TopBar, SearchBar, TopBarView, CalendarView, ContentLayout, RestaurantView, RestaurantsView, SearchBarView) {
    return app.module('SearchResults', function (SearchResults) {
        _.extend(SearchResults, {            
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '',
                rightText: 'Filter',
                subTitle: 'Search for a restaurant in:',
                title: ''
            }),
            calendarTopBar: new TopBar({
                leftText: 'Cancel',
                leftUrl: '',
                title: 'Date'
            }),
            getSearchModel: function (party, date, time, query) {
                if (typeof date == 'string') {
                    date = new Date(date);
                }

                return new SearchBar({
                    showTimingBar: true,
                    showSearchBar: true,
                    showTimes: true,
                    party: party,
                    date: date,
                    time: time,
                    query: query
                });
            },
            ContentLayout: ContentLayout,
            RestaurantView: RestaurantView,
            RestaurantsView: RestaurantsView,
            SearchBarView: SearchBarView,
            TopBarView: TopBarView,
            CalendarView: CalendarView
        });
    });
});