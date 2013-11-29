define([
	'jquery',
	'underscore',
	'backbone',
	'app',
	'models/restaurant',
    'models/topBar',
    'models/searchBar',
    'models/keyValue',
    'views/shared/topBar',
	'collections/restaurants',
    'collections/dictionary',
    'views/searchResults/searchResults',
    'views/searchResults/restaurant',
    'views/searchResults/restaurants',
    'views/searchResults/searchBar',
    'views/searchResults/RestaurantsPages'
],

function ($, _, Backbone, app, Restaurant, TopBar, SearchBar, KeyValue, TopBarView, Restaurants, Dictionary, ContentLayout, RestaurantView, RestaurantsView, SearchBarView, RestaurantsPagesView) {
    return app.module('BrowseAll', function (BrowseAll) {
        _.extend(BrowseAll, {
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '/find-table',
                rightText: 'Filter',
                subTitle: 'Search for a restaurant in:',
                title: ''
            }),
            getRestaurantSet: function (editorsPicks, restaurants) {
                if (editorsPicks.length < 3 || restaurants.length == 0) return new Dictionary([{ key: null, value: restaurants }]);

                var result = _.map(_.range(Math.ceil(restaurants.length / 11)), function (item, index) {
                    var start = index * 11;
                    return {
                        key: new Restaurants(editorsPicks.shuffle().slice(0, 3)),
                        value: new Restaurants(restaurants.toArray().slice(start, start + 11))
                    };
                });

                return new Dictionary(result);
            },
            search: new SearchBar({ showSearchBar: true }),
            ContentLayout: ContentLayout,
            RestaurantView: RestaurantView,
            RestaurantsView: RestaurantsView,
            SearchBarView: SearchBarView,
            TopBarView: TopBarView,
            Restaurants: Restaurants,
            RestaurantsPagesView: RestaurantsPagesView
        });
    });
});