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
            //cuisines: new Dictionary([new KeyValue({ key: 1, value: 'ccc1' }), new KeyValue({ key: 2, value: 'ccc2' }), new KeyValue({ key: 3, value: 'ccc3' })]),
            //neighborhoods: new Dictionary([new KeyValue({ key: 1, value: 'nnn1' }), new KeyValue({ key: 2, value: 'nnn2' }), new KeyValue({ key: 3, value: 'nnn3' })]),
            topBar: new TopBar({
                leftText: 'Cancel',
                leftUrl: '',
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
            //filter: new FilterItem({
            //    sortBy: 2,
            //    price: 3,
            //    cuisines: ['test c1', 'test c2'],
            //    neighborhoods: ['test n1', 'test n2']
            //}),
            ContentLayout: ContentLayout,
            FavoriteItemsView: FavoriteItemsView,
            TopBarView: TopBarView
        });
    });
});