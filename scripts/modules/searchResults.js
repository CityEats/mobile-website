define([
	'jquery',
	'underscore',
	'backbone',
	'app',
	'models/restaurant',
    'models/topBar',
    'models/searchBar',
    'views/shared/topBar',
	'collections/restaurants',
    'views/searchResults/searchResults',
    'views/searchResults/restaurant',
    'views/searchResults/restaurants',
    'views/searchResults/searchBar'
],

function ($, _, Backbone, app, Restaurant, TopBar, SearchBar, TopBarView, Restaurants, ContentLayout, RestaurantView, RestaurantsView, SearchBarView) {
    return app.module('SearchResults', function (SearchResults) {
        _.extend(SearchResults, {
            collection: new Restaurants([new Restaurant({ name: '111', id: 1 }), new Restaurant({ name: '2222', id: 2 })]),
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '',
                rightText: 'Filter',
                rightUrl: 'filter',
                title: 'Choose Your City'
            }),
            getSearchModel: function (party, date, time) {
                return new SearchBar({
                    showTimingBar: true,
                    showSearchBar: true,
                    party: party,
                    date: date,
                    time: time
                });
            },
            ContentLayout: ContentLayout,
            RestaurantView: RestaurantView,
            RestaurantsView: RestaurantsView,
            SearchBarView: SearchBarView,
            TopBarView: TopBarView
        });
    });
});