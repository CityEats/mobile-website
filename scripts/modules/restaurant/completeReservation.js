define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/restaurant/bookIt/complete/complete',
    'views/restaurant/bookIt/complete/restaurantInfo',
    'views/restaurant/bookIt/complete/userInfo',
    'views/restaurant/bookIt/complete/additionalInfo',
    //'views/restaurant/bookIt/complete/cardInfo',
    //'views/restaurant/bookIt/complete/confirmed',
    //'views/restaurant/bookIt/complete/canceled',
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout, RestaurantInfoView, UserInfoView, AdditionalInfoView) {
    return app.module('CompleteReservation', function (CompleteReservation) {
        _.extend(CompleteReservation, {
            topBar: new TopBar({
                leftText: 'Back',
                leftUrl: '',
                title: 'Book It'
            }),
            ContentLayout: ContentLayout,
            TopBarView: TopBarView,
            RestaurantInfoView: RestaurantInfoView,
            UserInfoView: UserInfoView,
            AdditionalInfoView: AdditionalInfoView
            //CardInfoView: CardInfoView,
            //ConfirmedView: ConfirmedView,
            //CanceledView: CanceledView
        });
    });
});