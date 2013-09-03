define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/restaurant/exclusiveEats/exclusiveEats',
    'views/restaurant/exclusiveEats/about',
    'views/restaurant/exclusiveEats/book',
    'views/restaurant/exclusiveEats/select',
    'views/restaurant/exclusiveEats/faq',
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout, AboutView, BookView, SelectView, FaqView) {
    return app.module('RestaurantExclusiveEats', function (RestaurantExclusiveEats) {
        _.extend(RestaurantExclusiveEats, {
            topBar: new TopBar({
                leftText: 'Back',
                leftUrl: '',
                title: 'Exclusive Eats'
            }),
            faqTopBar: new TopBar({
                leftText: 'Back',
                leftUrl: '',
                title: 'Exclusive Eats FAQ'
            }),
            ContentLayout: ContentLayout,
            TopBarView: TopBarView,
            AboutView: AboutView,
            BookView: BookView,
            SelectView: SelectView,
            FaqView: FaqView
        });
    });
});