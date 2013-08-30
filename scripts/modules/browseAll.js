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
            collection: new Restaurants([new Restaurant({ name: '111', id: 1 }), new Restaurant({ name: '2222', id: 2 }), new Restaurant({ name: '3333', id: 3 })]),
            editorsPicksCollection: new Restaurants([new Restaurant({ name: '555', id: 5 }), new Restaurant({ name: '444', id: 4 })]),
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '',
                rightText: 'Filter',
                rightUrl: 'filter',
                subTitle: 'Search for a restaurant in:',
                title: 'New York'
            }),
            search: new SearchBar,
            ContentLayout: ContentLayout,
            RestaurantView: RestaurantView,
            RestaurantsView: RestaurantsView,
            SearchBarView: SearchBarView,
            TopBarView: TopBarView
        });
    });
});