﻿define([
	'jquery',
	'underscore',
	'backbone',
	'app',	
    'models/topBar',
    'models/searchBar',
    'views/shared/topBar',	
    'views/searchResults/searchResults',
    'views/searchResults/restaurant',
    'views/searchResults/restaurants',
    'views/searchResults/searchBar'
],

function ($, _, Backbone, app, TopBar, SearchBar, TopBarView, ContentLayout, RestaurantView, RestaurantsView, SearchBarView) {
    return app.module('SearchResults', function (SearchResults) {
        _.extend(SearchResults, {            
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '',
                rightText: 'Filter',
                subTitle: 'Search for a restaurant in:',
                title: ''
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