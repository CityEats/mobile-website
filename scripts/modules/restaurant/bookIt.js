define([
	'jquery',
	'underscore',
	'backbone',
	'app',	
    'models/topBar',
    'views/shared/topBar',
    'views/restaurant/bookIt/bookIt',
    'views/restaurant/bookIt/chooseTime',
    'views/restaurant/bookIt/nextDays',
    'views/restaurant/bookIt/scheduleItems'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout, ChooseTimeView, NextDaysView, ScheduleItemsView) {
    return app.module('RestaurantBookIt', function (RestaurantBookIt) {
        _.extend(RestaurantBookIt, {
            topBar: new TopBar({
                leftText: 'Cancel',
                leftUrl: '',                
                title: 'Station Grill'
            }),
            ContentLayout: ContentLayout,            
            ChooseTimeView: ChooseTimeView,
            NextDaysView: NextDaysView,
            ScheduleItemsView: ScheduleItemsView,
            TopBarView: TopBarView
        });
    });
});