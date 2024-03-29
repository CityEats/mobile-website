﻿define([
	'underscore',
	'app',
    'modules/helper',
    'BaseController',
    'models/keyValue',
	'models/restaurant',
    'models/topBar',
    'models/searchBar',
    'models/exclusiveEatsItem',
    'views/shared/topBar',
	'collections/restaurants',
    'collections/dictionary',
    'views/searchResults/searchResults',
    'views/searchResults/searchBar',
    'views/searchResults/restaurantsPages',
    'views/shared/calendar',
    'views/searchResults/restaurant',
    'views/searchResults/restaurants',
    'views/restaurant/topMenu',
    'views/restaurant/content',
    'views/restaurant/info/info',
    'views/restaurant/reviews/reviews',
    'views/restaurant/menus/menus',
    'views/searchResults/searchBar',
    'views/restaurant/bookIt/nextDays',
    'views/restaurant/bookIt/scheduleItems',
    'views/shared/calendar',
    'views/restaurant/bookIt/bookIt',
    'views/restaurant/exclusiveEats/exclusiveEats',
],

function (_, app, Helper, BaseController, KeyValue, Restaurant, TopBar, SearchBar, ExclusiveEatsItem, TopBarView, Restaurants, Dictionary,
    RestaurantsContentLayout, SearchBarView, RestaurantsPagesView, CalendarView, RestaurantView, RestaurantsView, TopMenuView,
    ContentLayout, InfoView, ReviewsView, MenusView, ChooseTimeView, NextDaysView, ScheduleItemsView, CalendarView, BookItContentLayout, ExclusiveEatsContentLayout) {

    var Controller = BaseController.extend({

        info: function (id, party, date, time, fromRestaurants, url) {
            var that = this;
            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, 0, url, function (restaurant) {
                app.execute('GetCurrentUser', function (err, user) {
                    if (err) return that.errorPartial();

                    var infoView = new InfoView({
                        model: restaurant,
                        id: id,
                        party: party,
                        date: date,
                        time: time,
                        fromRestaurants: fromRestaurants,
                        user: user
                    });

                    that.contentLayout.currentView.restaurantContent.show(infoView);
                });
            });
        },

        reviews: function (id, party, date, time, fromRestaurants) {
            var that = this;
            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, 1, null, function (restaurant) {
                var reviewsView = new ReviewsView({ collection: restaurant.getReviewCollection() });
                that.contentLayout.currentView.restaurantContent.show(reviewsView);
            });
        },

        menus: function (id, party, date, time, fromRestaurants) {
            var that = this;
            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, 2, null, function (restaurant) {
                var menusView = new MenusView({ model: new KeyValue({ value: restaurant.get('locu_url') }) });
                that.contentLayout.currentView.restaurantContent.show(menusView);
            });
        },

        bookIt: function (id, party, date, time, mealId, code, fromRestaurants, newParty, newDate) {
            var that = this;
            this.buildRestaurantBaseInfo(id, newParty || party, newDate || date, time, fromRestaurants, 3, null, function (restaurant) {
                if (mealId == null && restaurant.get('has_special_meals') && restaurant.get('special_meals_slots') && restaurant.get('special_meals_slots').length > 0) {
                    mealId = restaurant.get('special_meals_slots')[0].id;
                }
                var chooseTimeView = new ChooseTimeView({ model: getSearchModel(newParty || party, newDate || date, restaurant.get('special_meals'), restaurant.get('current_time_offset')), specialMealId: mealId });
                var nextDaysView = new NextDaysView({ collection: getNextDays(newDate || date) });
                var scheduleItemsView = new ScheduleItemsView({
                    collection: restaurant.getFullSlots(mealId, newDate || date),
                    completeUrlTemplate: [
                        'restaurants/',
                        id,
                        '/party/', (newParty || party),
                        '/date/', (newDate || date),
                        '/time/', time,
                        '/', (fromRestaurants ? 'book-it' : 'book-it-ext'),
                        '/complete-reservation/##time##',
                        (code ? ('/modify/' + code) : ''),
                        (mealId ? ('/meal/' + mealId) : '')
                    ].join('')
                });

                that.contentLayout.currentView.chooseTime.show(chooseTimeView);
                that.contentLayout.currentView.schedule.show(scheduleItemsView);
                that.contentLayout.currentView.nextDays.show(nextDaysView);

                var calendarView = new CalendarView({ date: newDate || date });

                var calendarTopBarView = getCalendarTopBarView();

                chooseTimeView.on('datePickerClicked', function () {
                    calendarTopBarView.on('btnLeftClick', function () {
                        that.bookIt(id, party, date, time, mealId, code, fromRestaurants, chooseTimeView.model.get('party'), newDate ? Helper.formatDate(newDate) : null);
                    });

                    that.topBarLayout.show(calendarTopBarView);
                    that.contentLayout.show(calendarView);

                    calendarView.on('dateSelected', function (selectedDate) {
                        that.bookIt(id, party, date, time, mealId, code, fromRestaurants, chooseTimeView.model.get('party'), Helper.formatDate(selectedDate));
                    });
                }).on('partySizeChanged', function (partySize) {
                    that.bookIt(id, party, date, time, mealId, code, fromRestaurants, partySize, newDate);
                }).on('specialMealsChanged', function (specialMealId) {
                    that.bookIt(id, party, date, time, specialMealId, code, fromRestaurants, newParty, newDate);
                });

                nextDaysView.on('newDayView:dateSelected', function (sender, selectedDate) {
                    that.bookIt(id, party, date, time, mealId, code, fromRestaurants, chooseTimeView.model.get('party'), Helper.formatDate(selectedDate));
                });
            });
        },

        exclusiveEats: function (restaurantId, id, backUrl) {
            var that = this,
               changing = 0;

            app.execute('GetRestaurant', restaurantId, function (err, restaurant) {
                if (err) return that.errorPartial();
                id = parseInt(id, 10);

                var offer = _.findWhere(restaurant.get('offers'), { id: id });
                if (offer == null) return app.router.navigate(backUrl, { trigger: true });

                var model = new ExclusiveEatsItem(offer);

                var contentView = new ExclusiveEatsContentLayout({ model: model, timeOffset: restaurant.get('current_time_offset') });
                var topBarView = getExclusiveEatsTopBarView();

                that.topBarLayout.show(topBarView);
                that.contentLayout.show(contentView);
            });
        },

        buildRestaurantBaseInfo: function (id, party, date, time, fromRestaurants, menu, url, callback) {
            var that = this, start, cityId;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            start = Helper.parseDate(date, time);

            app.execute('GetRestaurant', id, start, party, time, function (err, restaurant) {
                if (err) return that.errorPartial();

                var leftMenuUrl;
                if (menu == 3) {
                    leftMenuUrl = fromRestaurants === true ?
                        ('restaurants/' + id + '/info') :
                        ('restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/info');
                } else {
                    leftMenuUrl = fromRestaurants === true ?
                       (url ? url : 'restaurants') :
                       ('search-results/party/' + party + '/date/' + date + '/time/' + time)
                }
                var topBarView = getTopBarView({
                    leftText: menu == 3 ? 'Cancel' : 'Back',
                    title: restaurant.get('name'),
                    leftUrl: leftMenuUrl
                });

                if (menu != 3) {
                    var topMenuView = new TopMenuView({
                        model: new KeyValue({ key: menu }),
                        urlBase: fromRestaurants === true ?
                        ('restaurants/' + id + '/') :
                        ('restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/')
                    });
                }

                var contentView = menu == 3 ? new BookItContentLayout : new ContentLayout;
                that.topBarLayout.show(topBarView);
                that.contentLayout.show(contentView);

                if (topMenuView) contentView.topMenu.show(topMenuView);

                callback(restaurant);
            });
        },
    });

    var getNextDays = function (date) {
        var first = Helper.parseDate(date),
            second = new Date(first),
            third = new Date(first);

        first.setDate(first.getDate() + 1);
        second.setDate(second.getDate() + 2);
        third.setDate(third.getDate() + 3);

        return new Dictionary(_.map([first, second, third], function (item) { return { key: item, value: Helper.formatDateShort(item) }; }));
    };

    var getSearchModel = function (party, date, special_meals, timeOffset) {
        if (typeof date == 'string') date = Helper.parseDate(date);

        return new SearchBar({
            showTimingBar: true,
            showTimes: false,
            party: party,
            date: date,
            special_meals: special_meals,
            timeOffset: timeOffset
        });
    };

    var getTopBarView = function (options) {
        var topBar = new TopBar(_.extend({
            leftText: 'Back',
            leftUrl: 'back',
            title: ''
        }, options));

        return new TopBarView({ model: topBar });
    };

    var getCalendarTopBarView = function () {
        var topBar = new TopBar({
            leftText: 'Cancel',
            leftUrl: '',
            title: 'Date'
        });

        return new TopBarView({
            model: topBar,
            leftClickEvent: 'btnLeftClick'
        });
    };

    var getExclusiveEatsTopBarView = function () {
        var topBar = new TopBar({
            leftText: 'Back',
            leftUrl: '',
            title: 'Exclusive Eats'
        });

        return new TopBarView({ model: topBar });
    };

    var getExclusiveEatsFaqTopBarView = function () {
        var topBar = new TopBar({
            leftText: 'Back',
            leftUrl: '',
            title: 'Exclusive Eats FAQ'
        });

        return new TopBarView({ model: topBar });
    };

    return Controller;
});