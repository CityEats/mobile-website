define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',    
    'views/account/reservations/details'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout) {
    return app.module('ConfirmReservation', function (CompleteReservation) {
        _.extend(CompleteReservation, {
            topBar: new TopBar({
                rightText: 'Done',
                rightUrl: 'back',                
                rightCss: 'blue',
                title: 'Reservation Confirmed'
            }),
            ContentLayout: ContentLayout,
            TopBarView: TopBarView
        });
    });
});