define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/account/reservations/all',
    'views/account/reservations/canceled',
    'views/account/reservations/past',
    'views/account/reservations/upcoming',
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout, CanceledView, PastView, UpcomingView) {
    return app.module('Profile', function (Profile) {
        _.extend(Profile, {
            topBar: new TopBar({
                leftText: 'Profile',
                leftUrl: '',
                title: 'Account'
            }),
            ContentLayout: ContentLayout,            
            TopBarView: TopBarView,
            ContentLayout: ContentLayout,
            CanceledView: CanceledView,
            PastView: PastView,
            UpcomingView: UpcomingView
        });
    });
});