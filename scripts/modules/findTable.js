define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/findTable/findTable'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout) {
    return app.module('FindTable', function (FindTable) {
        _.extend(FindTable, {
            topBar: new TopBar({ title: 'Find a Table' }),
            ContentLayout: ContentLayout,
            TopBarView: TopBarView
        });
    });
});