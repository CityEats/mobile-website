define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/account/reservations/all',
    'views/account/reservations/details'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout, DetailsView) {
    return app.module('Reservations', function (Profile) {
        _.extend(Profile, {
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: 'back',
                title: 'Account'
            }),
            detailsTopBar: new TopBar({
                leftText: 'Back',
                leftUrl: 'profile/reservations',
                title: ''
            }),
            ContentLayout: ContentLayout,            
            TopBarView: TopBarView,
            ContentLayout: ContentLayout,
            DetailsView: DetailsView
        });
    });
});