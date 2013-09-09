define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'models/searchBar',
    'views/shared/topBar',
    'views/findTable/findTable',
    'views/searchResults/searchBar'
],

function ($, _, Backbone, app, TopBar, SearchBar, TopBarView, ContentLayout, SearchBarView) {
    return app.module('FindTable', function (FindTable) {
        _.extend(FindTable, {
            topBar: new TopBar({ title: 'Find a Table' }),
            getSearchModel: function (party, date, time) {                
                return new SearchBar({
                    showTimingBar: true,
                    party: party,
                    date: date,
                    time: time
                });
            },
            ContentLayout: ContentLayout,
            TopBarView: TopBarView,
            SearchBarView: SearchBarView
        });
    });
});