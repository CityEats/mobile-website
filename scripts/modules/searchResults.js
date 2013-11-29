define([
	'jquery',
	'underscore',
	'backbone',
	'app',	
    'models/topBar',
    'models/searchBar',
    'models/keyValue',
    'collections/dictionary',
    'views/shared/topBar',
    'views/shared/calendar',
    'views/searchResults/searchResults',
    'views/searchResults/restaurant',
    'views/searchResults/restaurants',
    'views/searchResults/searchBar',
    'views/searchResults/restaurantsPages'
],

function ($, _, Backbone, app, TopBar, SearchBar, KeyValue, Dictionary, TopBarView, CalendarView, ContentLayout, RestaurantView, RestaurantsView, SearchBarView, RestaurantsPagesView) {
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

            getRestaurantSet: function (restaurants) {
                 return new Dictionary([{ key: null, value: restaurants }]);
            },
            getSearchModel: function (party, date, time, query) {
                if (typeof date == 'string') date = new Date(date);

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
            CalendarView: CalendarView,
            RestaurantsPagesView: RestaurantsPagesView
        });
    });
});