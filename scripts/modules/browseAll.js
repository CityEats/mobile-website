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
    return app.module('BrowseAll', function (BrowseAll) {
        _.extend(BrowseAll, {            
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '/find-table',
                rightText: 'Filter',
                subTitle: 'Search for a restaurant in:',
                title: ''
            }),
            search: new SearchBar({ showSearchBar: true }),
            ContentLayout: ContentLayout,
            RestaurantView: RestaurantView,
            RestaurantsView: RestaurantsView,
            SearchBarView: SearchBarView,
            TopBarView: TopBarView,
            Restaurants: Restaurants
        });
    });
});