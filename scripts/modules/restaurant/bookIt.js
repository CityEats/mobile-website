﻿define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'modules/helper',
    'models/topBar',
    'models/searchBar',
    'collections/dictionary',
    'views/shared/topBar',
    'views/restaurant/bookIt/bookIt',
    'views/searchResults/searchBar',
    'views/restaurant/bookIt/nextDays',
    'views/restaurant/bookIt/scheduleItems',
    'views/shared/calendar'
],

function ($, _, Backbone, app, Helper, TopBar, SearchBar, Dictionary, TopBarView, ContentLayout, ChooseTimeView, NextDaysView, ScheduleItemsView, CalendarView) {
    return app.module('RestaurantBookIt', function (RestaurantBookIt) {
        _.extend(RestaurantBookIt, {
            topBar: new TopBar({
                leftText: 'Cancel',
                leftUrl: '',
                title: 'Station Grill'
            }),

            calendarTopBar: new TopBar({
                leftText: 'Cancel',
                leftUrl: '',
                title: 'Date'
            }),

            getSearchModel: function (party, date, special_meals) {
                if (typeof date == 'string') date = Helper.parseDate(date);

                return new SearchBar({
                    showTimingBar: true,
                    showTimes: false,
                    party: party,
                    date: date,
                    special_meals: special_meals
                });
            },

            getNextDays: function (date) {
                var first = Helper.parseDate(date),
                    second = new Date(first),
                    third = new Date(first);

                first.setDate(first.getDate() + 1);
                second.setDate(second.getDate() + 2);
                third.setDate(third.getDate() + 3);

                return new Dictionary(_.map([first, second, third], function (item) { return { key: item, value: Helper.formatDateShort(item) }; }));
            },

            ContentLayout: ContentLayout,
            ChooseTimeView: ChooseTimeView,
            NextDaysView: NextDaysView,
            ScheduleItemsView: ScheduleItemsView,
            TopBarView: TopBarView,
            CalendarView: CalendarView
        });
    });
});