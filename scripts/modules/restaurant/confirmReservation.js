define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',    
    'views/restaurant/bookIt/complete/confirmed'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout) {
    return app.module('ConfirmReservation', function (CompleteReservation) {
        _.extend(CompleteReservation, {
            topBar: new TopBar({
                leftText: 'Back',
                leftUrl: '',
                title: 'Book It'
            }),
            ContentLayout: ContentLayout,
            TopBarView: TopBarView
        });
    });
});