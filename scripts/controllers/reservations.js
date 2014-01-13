define([
	'underscore',
	'app',
    'modules/helper',
    'BaseController',
	'models/topBar',
    'views/shared/topBar',
    'views/restaurant/bookIt/complete/complete',
    'views/restaurant/bookIt/complete/restaurantInfo',
    'views/restaurant/bookIt/complete/userInfo',
    'views/restaurant/bookIt/complete/additionalInfo',
    'views/account/reservations/all',
    'views/account/reservations/details',
    'views/restaurant/bookIt/complete/canceled'
],

function (_, app, Helper, BaseController, TopBar, TopBarView, CompleteReservationContentLayout, RestaurantInfoView, UserInfoView,
    AdditionalInfoView, ReservationsContentLayout, ReservationContentLayout, CanceledReservationContentLayout) {

    var Controller = BaseController.extend({
        completeReservation: function (id, party, date, filterTime, from, time, mealId, code) {
            var that = this,
                slotDate = Helper.parseDate(date, time),
                returnUrl, bookItUrl;

            bookItUrl = 'restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/book-it';
            switch (from) {
                case 'search': returnUrl = 'search-results/party/' + party + '/date/' + date + '/time/' + time;
                    break;
                case 'info': returnUrl = 'restaurants/' + id + '/info';
                    break;
                case 'info-ext': returnUrl = 'restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/info';
                    break;
                case 'book-it-ext': returnUrl = bookItUrl;
                    break;
                case 'book-it': returnUrl = 'restaurants/' + id + '/book-it';
            }

            var topBarView = getCompleteReservationTopBarView({ leftUrl: returnUrl });

            app.execute('GetRestaurant', id, slotDate, party, time, function (err, restaurant) {
                if (err) return that.errorPartial();

                app.execute('GetCurrentUser', function (err, currentUser) {
                    if ((mealId && restaurant.get('special_meals_slots').length == 0) || (mealId == null && restaurant.get('slots').length == 0))
                        return app.router.navigate(returnUrl, { trigger: true });

                    var contentView = new CompleteReservationContentLayout;

                    var restaurantInfoView = new RestaurantInfoView({
                        model: restaurant,
                        bookItUrl: bookItUrl,
                        specialMealId: mealId
                    });

                    var showViews = function () {
                        that.topBarLayout.show(topBarView);
                        that.contentLayout.show(contentView);

                        contentView.restaurantInfo.show(restaurantInfoView);
                        contentView.userInfo.show(contentView.userInfoView);
                        contentView.additionalInfo.show(contentView.additionalInfoView);

                        contentView.on('completeClicked', function () {
                            if (contentView.userInfoView.validate()) {
                                that.toggleLoading(true);
                                var lock = {
                                    user: contentView.userInfoView.getModel(),
                                    additionalInfo: contentView.additionalInfoView.getModel(),
                                    party: party,
                                    slotDate: slotDate,
                                    timeOffset: restaurant.get('current_time_offset'),
                                    restaurantId: id,
                                    specialMealId: mealId ? parseInt(mealId, 10) : null,
                                };

                                //create or update reservation
                                app.execute(code ? 'UpdateReservation' : 'ConfirmReservation', code ? code : id, lock, function (err, reservationResponse) {
                                    if (err == null) {
                                        app.router.navigate('restaurants/' + id + '/confirmed-reservation/' + reservationResponse.get('confirmation_code'), { trigger: true });
                                    }
                                    else {
                                        var error = Helper.getErrorMessage(err);
                                        if (error) that.errorPartial(error);
                                        else that.errorPartial();
                                    }
                                });
                            }
                        });
                    };

                    if (code) {
                        app.execute('GetReservation', code, function (err, reservation) {
                            if (err) return that.errorPartial(err);
                            if (reservation == null) return app.router.navigate('profile/reservations', { trigger: true });

                            contentView.userInfoView = new UserInfoView({ model: currentUser, reservation: reservation });//new
                            contentView.additionalInfoView = new AdditionalInfoView({ reservation: reservation });//new
                            showViews();
                        });
                    } else {
                        contentView.userInfoView = new UserInfoView({ model: currentUser });
                        contentView.additionalInfoView = new AdditionalInfoView;
                        showViews();
                    }
                });
            });
        },

        reservationConfirmed: function (restaurantId, code) {
            var that = this,
                changing = 0,
                contentView;

            app.execute('GetCurrentUser', function (err, currentUser) {
                app.execute('GetReservation', code, function (err, reservation) {
                    if (err) return that.errorPartial(err);
                    if (reservation == null) return app.router.navigate('profile/reservations', { trigger: true });

                    app.execute('GetRestaurant', restaurantId, function (err, restaurant) {
                        topBarView = getReservationConfirmedTopBarView();

                        var showViews = function (orderId) {
                            app.topBar.show(topBarView);
                            app.content.show(contentView);
                            that.toggleLoading();

                            contentView.on('btnCancelClicked', function () {
                                app.execute('CancelReservation', orderId, function (err) {
                                    if (err) return that.errorPartial();
                                    app.router.navigate('profile/reservations/' + code + '/canceled', { trigger: true });
                                });
                            });

                            contentView.on('btnModifyClicked', function (code, reservationId, party, date, time) {
                                app.router.navigate('restaurants/' + restaurantId + '/party/' + party + '/date/' + date + '/time/' + time + '/book-it/modify/' + code, { trigger: true });
                            });

                            contentView.on('reminderChanged', function (smsReminder, emailReminder) {
                                changing++;
                                that.toggleLoading(true);
                                app.execute('UpdateReservationReminders', code, smsReminder, emailReminder, function (err, reservation) {
                                    if (err) {
                                        changing = 0;
                                        that.toggleLoading();
                                        return that.errorPartial(err);
                                    }
                                    changing--;

                                    if (changing <= 0) that.toggleLoading();
                                });
                            });
                        };

                        if (currentUser == null) {
                            contentView = new ReservationContentLayout({ model: reservation, isConfirmedView: true, phoneNumber: restaurant.get('phone_number') });
                            showViews(reservation.get('order_id'));

                        } else {
                            contentView = new ReservationContentLayout({ model: reservation, user: currentUser, isConfirmedView: true, phoneNumber: restaurant.get('phone_number'), points: 200 });
                            showViews(reservation.get('order_id'));

                        }
                    });
                });
            });
        },

        reservations: function () {
            var that = this;
            app.execute('GetReservations', function (err, reservations) {
                if (err) return that.errorPartial(err);
                that.toggleLoading();

                if (reservations.error) {
                    that.errorPartial(reservations.error);
                } else {
                    topBarView = getReservationsTopBarView();
                    var contentView = new ReservationsContentLayout({ collection: reservations });

                    that.topBarLayout.show(topBarView);
                    that.contentLayout.show(contentView);
                }
            });
        },

        reservation: function (code) {
            var that = this,
                changing = 0;

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (currentUser == null) return app.router.navigate('login', { trigger: true });

                app.execute('GetReservation', code, function (err, reservation) {
                    if (err) return that.errorPartial();
                    if (reservation == null) return app.router.navigate('profile/reservations', { trigger: true });

                    app.execute('GetRestaurant', reservation.get('restaurant_id'), function (err, restaurant) {
                        if (err) return that.errorPartial();

                        var title;
                        if (reservation.isUpcoming()) title = 'Upcoming Reservation';
                        else if (reservation.isPast()) title = 'Past Reservation';
                        else if (reservation.isCanceled()) title = 'Canceled Reservation';

                        var contentView = new ReservationContentLayout({ model: reservation, user: currentUser, phoneNumber: restaurant.get('phone_number'), minTimeToCancel: restaurant.get('min_time_to_cancel_reservation') });
                        var topBarView = getReservationTopBarView({ title: title });

                        that.topBarLayout.show(topBarView);
                        that.contentLayout.show(contentView);

                        contentView.on('btnCancelClicked', function () {
                            app.execute('CancelReservation', reservation.get('order_id'), function (err) {
                                if (err) return that.errorPartial();
                                app.router.navigate('profile/reservations/' + code + '/canceled', { trigger: true });
                            });
                        });

                        contentView.on('btnModifyClicked', function (code, reservationId, party, date, time) {
                            app.router.navigate('restaurants/' + restaurant.get('id') + '/party/' + party + '/date/' + date + '/time/' + time + '/book-it/modify/' + code, { trigger: true });
                        });

                        contentView.on('reminderChanged', function (smsReminder, emailReminder) {
                            changing++;
                            that.toggleLoading(true);
                            app.execute('UpdateReservationReminders', code, smsReminder, emailReminder, function (err, reservation) {
                                if (err) {
                                    changing = 0;
                                    that.toggleLoading();
                                    return that.errorPartial(err);
                                }
                                changing--;

                                if (changing <= 0) that.toggleLoading();
                            });
                        });
                    });
                });
            });
        },

        reservationCanceled: function (code) {
            var that = this,
                changing = 0;

            app.execute('GetCurrentUser', function (err, currentUser) {
                app.execute('GetReservation', code, function (err, reservation) {
                    if (err) return that.errorPartial();
                    if (reservation == null || !reservation.isCanceled()) return app.router.navigate('profile/reservations', { trigger: true });

                    var contentView = new CanceledReservationContentLayout({ model: reservation, user: currentUser });
                    var topBarView = getCanceledReservationTopBarView();

                    that.topBarLayout.show(topBarView);
                    that.contentLayout.show(contentView);
                });
            });
        }
    });

    var getCompleteReservationTopBarView = function (options) {
        var topBar = new TopBar(_.extend({
            leftText: 'Back',
            title: 'Book It'
        }, options));

        return new TopBarView({ model: topBar });
    };

    var getReservationConfirmedTopBarView = function (options) {
        var topBar = new TopBar(_.extend({
            rightText: 'Done',
            rightUrl: 'back',
            rightCss: 'blue',
            title: 'Reservation Confirmed'
        }, options));

        return new TopBarView({ model: topBar });
    };

    var getReservationsTopBarView = function () {
        var topBar = new TopBar({
            leftText: 'Home',
            leftUrl: 'back',
            title: 'Account'
        });

        return new TopBarView({ model: topBar });
    };

    var getReservationTopBarView = function (options) {
        var topBar = new TopBar(_.extend({
            leftText: 'Back',
            leftUrl: 'profile/reservations'
        }, options));

        return new TopBarView({ model: topBar });
    };

    var getCanceledReservationTopBarView = function () {
        var topBar = new TopBar({ title: 'Reservation Canceled' });

        return new TopBarView({ model: topBar });
    };

    return Controller;
});