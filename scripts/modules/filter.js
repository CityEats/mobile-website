define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'models/filter',
    'models/keyValue',
    'collections/dictionary',
    'views/shared/topBar',
    'views/filter/filter',
    'views/filter/favoriteItems'
],

function ($, _, Backbone, app, TopBar, FilterItem, KeyValue, Dictionary, TopBarView, ContentLayout, FavoriteItemsView) {    
    return app.module('Filter', function (Filter) {
        _.extend(Filter, {
            topBar: new TopBar({
                leftText: 'Cancel',
                rightText: 'Reset',
                rightCss: 'hide red',
                rightUrl: '',
                title: 'Filter'
            }),
            topBarCuisines: new TopBar({
                leftText: 'Cancel',
                rightText: 'Done',
                rightCss: 'blue',                
                title: 'Cuisines'
            }),
            topBarNeighborhoods: new TopBar({
                leftText: 'Cancel',                
                rightText: 'Done',
                rightCss: 'blue',                
                title: 'Neighborhoods'
            }),
            ContentLayout: ContentLayout,
            FavoriteItemsView: FavoriteItemsView,
            TopBarView: TopBarView
        });
    });
});