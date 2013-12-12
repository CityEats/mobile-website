﻿define([
	'underscore',
	'app',
    'modules/helper',
    'BaseController',
    'models/keyValue',
	'models/restaurant',
    'models/topBar',
    'models/searchBar',
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
],

function (_, app, Helper, BaseController, KeyValue, Restaurant, TopBar, SearchBar, TopBarView, Restaurants, Dictionary,
    RestaurantsContentLayout, SearchBarView, RestaurantsPagesView, CalendarView, RestaurantView, RestaurantsView, TopMenuView,
    ContentLayout, InfoView, ReviewsView, MenusView, ChooseTimeView, NextDaysView, ScheduleItemsView, CalendarView, BookItContentLayout) {

    var Controller = BaseController.extend({
        info: function (id, party, date, time, fromRestaurants) {
            var that = this;
            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, 0, function (restaurant) {
                var infoView = new InfoView({
                    model: restaurant,
                    id: id,
                    party: party,
                    date: date,
                    time: time,
                    fromRestaurants: fromRestaurants
                });
                
                that.contentLayout.currentView.restaurantContent.show(infoView);
            });
        },

        reviews: function (id, party, date, time, fromRestaurants) {
            var that = this;
            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, 1, function (restaurant) {
                var reviewsView = new ReviewsView({ collection: restaurant.getReviewCollection() });
                that.contentLayout.currentView.restaurantContent.show(reviewsView);
            });
        },

        menus: function (id, party, date, time, fromRestaurants) {
            var that = this;
            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, 2, function (restaurant) {
                var menusView = new MenusView({ model: new KeyValue({ value: restaurant.get('locu_url') }) });
                that.contentLayout.currentView.restaurantContent.show(menusView);
            });
        },

        bookIt: function (id, party, date, time, mealId, code, reservationId, fromRestaurants, newParty, newDate) {
            var that = this;
            this.buildRestaurantBaseInfo(id, newParty || party, newDate || date, time, fromRestaurants, 3, function (restaurant) {                

                var chooseTimeView = new ChooseTimeView({ model: that.getSearchModel(newParty || party, newDate || date, restaurant.get('special_meals')), specialMealId: mealId });
                var nextDaysView = new NextDaysView({ collection: that.getNextDays(newDate || date) });
                var scheduleItemsView = new ScheduleItemsView({
                    collection: restaurant.getFullSlots(),
                    completeUrlTemplate: [
                        'restaurants/',
                        id,
                        '/party/', (newParty || party),
                        '/date/', (newDate || date),
                        '/time/', time,
                        '/', (fromRestaurants ? 'book-it' : 'book-it-ext'),
                        '/complete-reservation/##time##',
                        (code ? ('/modify/' + code) : '')
                    ].join('')
                });

                that.contentLayout.currentView.chooseTime.show(chooseTimeView);
                that.contentLayout.currentView.schedule.show(scheduleItemsView);
                that.contentLayout.currentView.nextDays.show(nextDaysView);

                var calendarView = new CalendarView({ date: newDate || date });

                var calendarTopBarView = that.getCalendarTopBarView();

                chooseTimeView.on('datePickerClicked', function () {
                    calendarTopBarView.on('btnLeftClick', function () {
                        that.bookIt(id, party, date, time, mealId, code, reservationId, fromRestaurants, chooseTimeView.model.get('party'), newDate ? Helper.formatDate(newDate) : null);
                    });

                    that.topBarLayout.show(calendarTopBarView);
                    that.contentLayout.show(calendarView);

                    calendarView.on('dateSelected', function (selectedDate) {
                        chooseTimeView.model.set('date', selectedDate);
                        that.bookIt(id, party, date, time, mealId, code, reservationId, fromRestaurants, chooseTimeView.model.get('party'), Helper.formatDate(selectedDate));
                    });
                });

                nextDaysView.on('newDayView:dateSelected', function (sender, selectedDate) {
                    chooseTimeView.model.set('date', selectedDate);
                    that.bookIt(id, party, date, time, mealId, code, reservationId, fromRestaurants, chooseTimeView.model.get('party'), Helper.formatDate(selectedDate));
                });

                chooseTimeView.on('partySizeChanged', function (partySize) {
                    that.bookIt(id, party, date, time, mealId, code, reservationId, fromRestaurants, partySize, newDate);
                });
            });
        },

        buildRestaurantBaseInfo: function (id, party, date, time, fromRestaurants, menu, callback) {
            var that = this, start, cityId;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            start = Helper.parseDate(date, time);

            app.execute('GetRestaurant', id, start, party, time, function (err, restaurant) {
                if (err) return that.errorPartial();

                var topBarView = that.getTopBarView({
                    title: restaurant.get('name'),
                    leftUrl: fromRestaurants === true ?
                        ('restaurants') :
                        ('search-results/party/' + party + '/date/' + date + '/time/' + time)
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

        getTopBarView: function(options){
            var topBar = new TopBar(_.extend({
                leftText: 'Back',
                leftUrl: 'back',
                title: ''
            }, options));

            return new TopBarView({ model: topBar });
        },

        getCalendarTopBarView: function () {
            var topBar = new TopBar({
                leftText: 'Cancel',
                leftUrl: '',
                title: 'Date'
            });

            return new TopBarView({
                model: topBar,
                leftClickEvent: 'btnLeftClick'
            });
        }
    });

    return Controller;
});