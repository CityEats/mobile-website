define([
	'app',
	'marionette',
    'views/shared/footer',
    'views/shared/error',
    'views/shared/404',
    'views/shared/loading',
    'modules/helper',
	'modules/cities',
    'modules/login',
    'modules/signUp',
    'modules/forgotPassword',
    'modules/contactUs',
    'modules/findTable',
    'modules/searchResults',
    'modules/browseAll',
    'modules/filter',
    'modules/restaurant/info',
    'modules/restaurant/bookIt',
    'modules/restaurant/exclusiveEats',
    'modules/restaurant/completeReservation',
    'modules/restaurant/confirmReservation',
    'modules/profile',
    'modules/reservations',
    'modules/messages',
],

function (app, Marionette, FooterView, ErrorView, NotFoundView, LoadingView, Helper) {
    var fbAppId = '488317004581923',
        fbRedirectUri = 'https://qa-beta.cityeats.com/api/v2/facebook_auth';

    var Router = Marionette.AppRouter.extend({
        routes: {
            '': 'index',
            'index.html': 'index',
            'back': 'back',
            'login': 'login',
            'login?:url': 'loginReturnUrl',
            'signup': 'signUp',
            //'contact-us': 'contactUs',
            //'forgot-password': 'forgotPassword',
            'find-table': 'findTable',
            'search-results/party/:num/date/:num/time/:num': 'searchResults',
            'restaurants': 'browseAll',
            'restaurants/filter': 'restaurantsFilter',
            'search-results/party/:num/date/:num/time/:num/filter': 'searchResultsFilter',
            'restaurants/filter/cuisines': 'restaurantsFilterCuisines',
            'search-results/party/:num/date/:num/time/:num/filter/cuisines': 'searchResultsFilterCuisines',
            'restaurants/filter/neighborhoods': 'restaurantsFilterNeighborhoods',
            'search-results/party/:num/date/:num/time/:num/filter/neighborhoods': 'searchResultsFilterNeighborhoods',
            'restaurants/:num/info': 'restauranInfoShort',
            'restaurants/:num/party/:num/date/:num/time/:num/info': 'restauranInfo',
            'restaurants/:num/reviews': 'restauranReviewsShort',
            'restaurants/:num/party/:num/date/:num/time/:num/reviews': 'restauranReviews',
            'restaurants/:num/menus': 'restauranMenushort',
            'restaurants/:num/party/:num/date/:num/time/:num/menus': 'restauranMenus',
            'restaurants/:num/book-it(/meal/:meal)': 'restauranBookItShort',
            'restaurants/:num/party/:num/date/:num/time/:num/book-it(/meal/:meal)': 'restauranBookIt',
            'restaurants/:num/party/:num/date/:num/time/:num/book-it/modify/:code/:reservationId': 'restauranBookItEdit',
            //'restaurants/:num/exclusive-eats': 'restaurantExclusiveEats',
            //'restaurants/:num/exclusive-eats-faq': 'restaurantExclusiveEatsFaq',
            'restaurants/:num/party/:num/date/:num/time/:num/:from/complete-reservation/:num': 'completeReservation',
            'restaurants/:num/party/:num/date/:num/time/:num/:from/complete-reservation/:num/meal/:meal': 'completeReservation',
            'restaurants/:num/party/:num/date/:num/time/:num/:from/complete-reservation/:num/modify/:code': 'completeReservationEdit',
            //'restaurants/:num/:num/party/:num/date/:num/time/:num/:from/confirmed-reservation/:num/:num': 'reservationConfirmed',
            'restaurants/:num/confirmed-reservation/:num': 'reservationConfirmed',
            //'restaurants/:num/:num/complete-reservation/:num': 'completeReservation',
            //'restaurants/:num/reservation-card-info': 'reservationCardInfo',
            //'restaurants/:num/reservation-confirmed': 'reservationConfirmed',
            //'restaurants/:num/reservation-canceled': 'reservationCanceled',
            'profile': 'profile',
            //'profile/edit': 'profileEdit',
            'profile/reservations': 'profileReservations',
            'profile/reservations/:num': 'profileReservation',
            '*path': '404'
        },

        setup: function () {
            if (app.footer) return true;

            var that = this;
            app.footerView = new FooterView;
            app.loadingView = new LoadingView;

            app.addRegions({ topBar: '#topBar' });
            app.addRegions({ content: '#content' });
            app.addRegions({ footer: '#footer' });
            app.addRegions({ loading: '#loading' });

            app.footer.show(app.footerView);

            app.vent
                .on('showLoading', function () { that.toggleLoading(true); })
                .on('hideLoading', function () { that.toggleLoading(false); });
        },

        index: function () {
            this.chooseCity();
        },

        chooseCity: function () {
            this.setup();
            var module = require('modules/cities'),
                that = this;

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err) return that.errorPartial();

                app.execute('GetMetros', function (err, cities, isNearestCity) {
                    if (err) return that.errorPartial();

                    module.topBarBlock = new module.TopBarView({ model: module.topBar });
                    app.topBar.show(module.topBarBlock);

                    if (currentUser) module.topBarBlock.hideRightButton();

                    var currentCity = app.request('GetCurrentCity');
                    if (currentCity) {
                        if (isNearestCity === true) {
                            app.router.navigate('find-table', { trigger: true });
                            return true;
                        }
                        module.contentLayout = new module.ContentLayout({ hasCurrentCity: !!currentCity });
                        app.content.show(module.contentLayout);
                        currentCity.set('isCurrent', true);
                        cities = new module.Cities(cities.filter(function (city) { return city.get('id') != currentCity.get('id') }));
                        module.contentLayout.currentCity.show(new module.CityView({ model: currentCity }));
                    } else {
                        module.contentLayout = new module.ContentLayout;
                        app.content.show(module.contentLayout);
                    }

                    module.citiesView = new module.CitiesView({ collection: cities });
                    module.dontSeeCityView = new module.DontSeeCityView;

                    module.dontSeeCityView.on('submitNewCity', function (email, zip) {
                        var reuquest = { email: email, zip: zip };
                        var view = this;
                        app.execute('CreateMetroEmail', reuquest, function (err, response) {
                            if (err == null) {
                                view.hideError();
                                alert("Thanks for your interest. We'll be sure to let you know when we're coming to your city!");
                                return;
                            } else {
                                var error = Helper.getErrorMessage(err);
                                if (error) {
                                    view.showError(error, null, 'main');
                                } else {
                                    that.errorPartial();
                                }
                            }
                        });
                    }, module.dontSeeCityView);

                    module.contentLayout.findYourCity.show(module.dontSeeCityView);
                    module.contentLayout.locationsButtons.show(module.citiesView);
                });
            });
        },

        back: function () {
            var currentCity = app.request('GetCurrentCity');

            if (currentCity == null) app.router.navigate('', { trigger: true });
            else app.router.navigate('find-table', { trigger: true });
        },

        loginReturnUrl: function (url) {
            this.login(url)
        },

        login: function (url) {
            this.setup();
            var that = this,
                module = require('modules/login');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout({
                appId: fbAppId,
                redirectUri: fbRedirectUri
            });

            module.contentLayout.on('loginSubmited', function (user) {
                var view = this;
                app.execute('SignIn', user, function (err, data) {
                    if (err == null) {
                        if (url) {
                            app.router.navigate(url, { trigger: true });
                        } else {
                            app.router.navigate('back', { trigger: true });
                        }
                    } else {
                        var error = Helper.getErrorMessage(err);
                        if (error) {
                            view.showError(error, null, 'main');
                        } else {
                            that.errorPartial();
                        }
                    }

                }, module.contentLayou);
            });

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        signUp: function () {
            this.setup();
            var that = this,
                module = require('modules/signUp');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout({
                appId: fbAppId,
                redirectUri: fbRedirectUri
            });

            module.contentLayout.on('loginSubmited', function (user) {
                var view = this;
                app.execute('SignUp', user, function (err, data) {
                    if (err == null) {
                        app.router.navigate('back', { trigger: true });
                    } else {
                        var error = Helper.getErrorMessage(err);
                        if (error) {
                            view.showError(error, null, 'main');
                        } else {
                            that.errorPartial();
                        }
                    }
                });
            }, module.contentLayout);

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        forgotPassword: function () {
            this.setup();
            var module = require('modules/forgotPassword');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        contactUs: function () {
            this.setup();
            var module = require('modules/contactUs');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        findTable: function (date, newParty, newDate, newTime) {
            this.setup();
            var that = this,
                cityId,
                module = require('modules/findTable');

            date = date || new Date;
            party = 2;
            time = '19:00';

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            app.execute('GetRestaurantsByMetro', cityId); //preload restaurants;
            app.execute('GetCuisines', cityId); //preload cuisines;

            var currentCity = app.request('GetCurrentCity');
            if (currentCity == null) return app.router.navigate('', { trigger: true });

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err) return that.errorPartial();

                var name;
                if (currentUser) name = currentUser.get('first_name') + ' ' + currentUser.get('last_name');

                module.contentLayout = new module.ContentLayout({
                    model: currentCity,
                    user: name
                });

                module.searchBar = new module.SearchBarView({
                    model: module.getSearchModel(newParty || party, newDate || date, newTime || time),
                    defaults: {
                        party: 2,
                        date: date,
                        time: '19:00'
                    },
                });

                module.calendarView = new module.CalendarView({ date: newDate || date });
                module.calendarTopBarView = new module.TopBarView({
                    model: module.calendarTopBar,
                    leftClickEvent: 'btnLeftClick'
                });

                app.content.show(module.contentLayout);
                module.contentLayout.search.show(module.searchBar);

                module.searchBar.on('datePickerClicked', function () {
                    module.calendarTopBarView.on('btnLeftClick', function () {
                        that.findTable(date, module.searchBar.model.get('party'), newDate, module.searchBar.model.get('time'));
                    });

                    app.topBar.show(module.calendarTopBarView);
                    app.content.show(module.calendarView);

                    module.calendarView.on('dateSelected', function (selectedDate) {
                        module.searchBar.model.set('date', selectedDate);
                        that.findTable(date, module.searchBar.model.get('party'), selectedDate, module.searchBar.model.get('time'));
                    });
                });

                module.contentLayout.on('findTableClicked', function () {
                    var date = module.searchBar.model.get('date');
                    var partySize = module.searchBar.model.get('party');
                    var time = module.searchBar.model.get('time');
                    var url = 'search-results/party/' + partySize + '/date/' + Helper.formatDate(date) + '/time/' + time;
                    that.toggleLoading(true);
                    app.router.navigate(url, { trigger: true });
                }).on('logOut', function () {
                    app.execute('SignOut', function (err) {
                        if (err) return that.errorPartial();

                        that.findTable(date, newParty, newDate, newTime);
                    });
                });
            });

            module.topBarBlock = new module.TopBarView({ model: module.topBar });
            app.topBar.show(module.topBarBlock);
        },

        searchResults: function (party, date, time, newParty, newDate, newTime, searchQuery) {
            var cityId;
            this.setup();

            var currentCity = app.request('GetCurrentCity');
            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            var that = this,
                module = require('modules/searchResults'),
                filter = app.request('GetFilterSimple', cityId),
                rendered = false;

            module.topBar.set('rightUrl', 'search-results/party/' + party + '/date/' + encodeURIComponent(date) + '/time/' + time + '/filter');
            module.topBar.set('title', currentCity.get('display_name'));

            if (filter && !filter.isDefault()) module.topBar.set('rightCss', 'red');
            else module.topBar.set('rightCss', '');

            module.contentLayout = null;
            var start = Helper.parseDate(date, time);
            var end = new Date(start);

            start.setMinutes(start.getMinutes() - 15);
            end.setMinutes(end.getMinutes() + 15);

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.searchBar = new module.SearchBarView({
                model: module.getSearchModel(newParty || party, newDate || date, newTime || time, searchQuery),
                defaults: {
                    party: party,
                    date: date,
                    time: time
                },
                showFindButton: true
            });

            module.contentLayout = new module.ContentLayout;
            module.calendarView = new module.CalendarView({ date: newDate || date });
            module.calendarTopBarView = new module.TopBarView({
                model: module.calendarTopBar,
                leftClickEvent: 'btnLeftClick'
            });

            module.searchBar.on('datePickerClicked', function () {
                app.topBar.show(module.calendarTopBarView);
                app.content.show(module.calendarView);

                module.calendarTopBarView.on('btnLeftClick', function () {
                    that.searchResults(party, date, time, module.searchBar.model.get('party'), newDate, module.searchBar.model.get('time'), module.searchBar.model.get('searchQuery'));
                });

                module.calendarView.on('dateSelected', function (selectedDate) {
                    that.searchResults(party, date, time, module.searchBar.model.get('party'), Helper.formatDate(selectedDate), module.searchBar.model.get('time'), module.searchBar.model.get('searchQuery'));
                });
            });

            var getRestaurantsHandler = function (err, data) {
                if (err) return that.errorPartial();
                that.toggleLoading(false);

                module.restaurantsPagesView = new module.RestaurantsPagesView({
                    collection: module.getRestaurantSet(data),
                    party: module.searchBar.model.get('party'),
                    date: newDate || date,
                    time: module.searchBar.model.get('time'),
                    cityId: cityId
                });

                if (!rendered) {
                    app.content.show(module.contentLayout);
                    module.contentLayout.searchBar.show(module.searchBar);
                    app.topBar.show(module.topBarBlock);
                    rendered = true;
                }

                module.contentLayout.resultsHolder.show(module.restaurantsPagesView); //for uniformity of another action (browse all)
            };

            module.searchBar.on('filterParametersChanged', function (data) {
                //apply party size, date and time filter (ie redirect with new query string)
                app.router.navigate('search-results/party/' + data.party + '/date/' + data.date + '/time/' + data.time, { trigger: true });
            });

            module.searchBar.on('searchParametersChanged', function (data) {
                //apply search filter
                app.execute('GetRestaurants', cityId, start, end, party, time, data.searchQuery, filter, getRestaurantsHandler);
            });

            app.execute('GetRestaurants', cityId, start, end, party, time, searchQuery, filter, getRestaurantsHandler);
        },

        browseAll: function () {
            this.setup();

            var that = this,
                module = require('modules/browseAll'),
                filter,
                cityId;

            var currentCity = app.request('GetCurrentCity');

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            filter = app.request('GetFilterSimple', cityId),

            module.topBar.set('rightUrl', 'restaurants/filter');
            module.topBar.set('title', currentCity.get('display_name'));

            if (filter && !filter.isDefault()) module.topBar.set('rightCss', 'red');
            else module.topBar.set('rightCss', '');

            module.contentLayout = null;
            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.searchBarView = new module.SearchBarView({
                model: module.search,
                showFindButton: true
            });

            app.execute('GetEditorsPicksByMetro', cityId, function (err, editorsPicks) {
                if (err) return that.errorPartial();

                var getRestaurantsHandler = function (err, restaurants) {
                    //if (err) return that.errorPartial();

                    if (module.contentLayout == null) {
                        module.contentLayout = new module.ContentLayout;

                        app.content.show(module.contentLayout);
                        module.contentLayout.searchBar.show(module.searchBarView);
                    }

                    module.restaurantsPagesView = new module.RestaurantsPagesView({
                        collection: module.getRestaurantSet(editorsPicks, restaurants),
                        isBrowseAll: true,
                        showSimple: true
                    });
                    module.contentLayout.resultsHolder.show(module.restaurantsPagesView);
                    app.topBar.show(module.topBarBlock);
                };

                module.searchBarView.on('searchParametersChanged', function (data) {
                    app.execute('GetRestaurantsByMetro', cityId, filter, data.searchQuery, getRestaurantsHandler);
                });

                app.execute('GetRestaurantsByMetro', cityId, filter, null, getRestaurantsHandler);
            });
        },

        restaurantsFilter: function (cityId) {
            this.filter(true);
        },

        searchResultsFilter: function (party, date, time) {
            this.filter(false, party, date, time);
        },

        filter: function (isRestaurants, party, date, time) {
            this.setup();
            var cityId;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            var that = this,
                module = require('modules/filter');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar,
                rightClickEvent: 'btnRightClick'
            });

            var backUrl = isRestaurants ?
                'restaurants' :
                'search-results/party/' + party + '/date/' + date + '/time/' + time;
            module.topBar.set('leftUrl', backUrl);

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err) return that.errorPartial();

                module.contentLayout = new module.ContentLayout({
                    model: filter,
                    isLocation: app.request('GetLocation') != null,
                    isRestaurants: isRestaurants,
                    searchSettings: {
                        party: party,
                        date: date,
                        time: time
                    }
                });

                app.content.show(module.contentLayout);
                app.topBar.show(module.topBarBlock);

                module.contentLayout.on('filterChanged', function (isDefault) {
                    if (isDefault) this.hideRightButton();
                    else this.showRightButton();
                }, module.topBarBlock);

                module.topBarBlock.on('btnRightClick', function () {
                    app.execute('ResetFilter', cityId);
                    this.resetFilter();
                }, module.contentLayout);

                if (filter.isDefault()) module.topBarBlock.hideRightButton();
                else module.topBarBlock.showRightButton();
            });
        },

        restaurantsFilterCuisines: function () {
            this.filterCuisines(true);
        },

        searchResultsFilterCuisines: function (party, date, time) {
            this.filterCuisines(false, party, date, time);
        },

        filterCuisines: function (isRestaurants, party, date, time) {
            this.setup();

            var that = this,
                module = require('modules/filter'),
                cityId;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            var backUrl = isRestaurants ?
                'restaurants/filter' :
                'search-results/party/' + party + '/date/' + date + '/time/' + time + '/filter';

            module.topBarCuisines.set('leftUrl', backUrl);
            module.topBarCuisines.set('rightUrl', backUrl);

            module.topBarBlock = new module.TopBarView({
                model: module.topBarCuisines,
                rightClickEvent: 'btnRightClick'
            });

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err) return that.errorPartial();

                module.contentLayout = new module.FavoriteItemsView({
                    collection: filter.get('cuisines'),
                    isCuisines: true,
                    cityId: cityId
                });

                module.topBarBlock.on('btnRightClick', function (url) {
                    this.saveItems();
                    app.router.navigate(url, { trigger: true });
                }, module.contentLayout);

                app.content.show(module.contentLayout);
                app.topBar.show(module.topBarBlock);
            });
        },

        restaurantsFilterNeighborhoods: function () {
            this.filterNeighborhoods(true);
        },

        searchResultsFilterNeighborhoods: function (party, date, time) {
            this.filterNeighborhoods(false, party, date, time);
        },

        filterNeighborhoods: function (isRestaurants, party, date, time) {
            this.setup();

            var that = this,
                module = require('modules/filter'),
                cityId;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            var backUrl = isRestaurants ?
                'restaurants/filter' :
                'search-results/party/' + party + '/date/' + date + '/time/' + time + '/filter';

            module.topBarNeighborhoods.set('leftUrl', backUrl);
            module.topBarNeighborhoods.set('rightUrl', backUrl);

            module.topBarBlock = new module.TopBarView({
                model: module.topBarNeighborhoods,
                rightClickEvent: 'btnRightClick'
            });

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err) return that.errorPartial();

                module.contentLayout = new module.FavoriteItemsView({
                    collection: filter.get('neighborhoods'),
                    cityId: cityId,
                    isRestaurants: isRestaurants
                });

                module.topBarBlock.on('btnRightClick', function (url) {
                    this.saveItems();
                    app.router.navigate(url, { trigger: true });
                }, module.contentLayout);

                app.content.show(module.contentLayout);
                app.topBar.show(module.topBarBlock);
            });
        },

        buildRestaurantBaseInfo: function (id, party, date, time, fromRestaurants, module, menu, callback) {
            var that = this,
                module = module || require('modules/restaurant/info'),
                start, cityId;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            start = Helper.parseDate(date, time);

            app.execute('GetRestaurant', id, start, party, time, function (err, restaurant) {
                if (err) return that.errorPartial();

                module.topBar.set('title', restaurant.get('name'));

                module.topBar.set('leftUrl',
                    fromRestaurants === true ?
                    ('restaurants') :
                    ('search-results/party/' + party + '/date/' + date + '/time/' + time));

                if (module.TopMenuView) {
                    module.topMenuView = new module.TopMenuView({
                        model: new module.KeyValue({ key: menu }),
                        urlBase: fromRestaurants === true ?
                        ('restaurants/' + id + '/') :
                        ('restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/')
                    });
                }

                module.topBarBlock = new module.TopBarView({ model: module.topBar });

                module.contentLayout = new module.ContentLayout;

                app.topBar.show(module.topBarBlock);
                app.content.show(module.contentLayout);

                if (module.topMenuView) module.contentLayout.topMenu.show(module.topMenuView);

                callback(restaurant);
            });
        },

        restauranInfoShort: function (id) {
            this.restauranInfo(id, 2, Helper.formatDate(new Date()), '19:00', true);
        },

        restauranInfo: function (id, party, date, time, fromRestaurants) {
            this.setup();
            var module = require('modules/restaurant/info')
            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, module, 0, function (restaurant) {
                module.infoView = new module.info.InfoView;
                module.topBarBlock = new module.TopBarView({ model: module.topBar });

                module.bookView = new module.info.BookView({
                    model: restaurant
                });
                module.exclusiveEatsOfferView = new module.info.ExclusiveEatsOfferView;
                module.imagesView = new module.info.ImagesView({ model: restaurant });
                module.mainView = new module.info.MainView({ model: restaurant });
                module.mapView = new module.info.MapView({ model: restaurant });

                var highlights = restaurant.highlights();
                if (highlights.length > 0) module.highlights = new module.info.TextBlockView({ model: new module.KeyValue({ key: 'Highlights', value: highlights }) });
                else module.highlights = null;

                var goodToKnow = restaurant.goodToKnow();
                if (goodToKnow.length > 0) module.goodToKnow = new module.info.TextBlockView({ model: new module.KeyValue({ key: 'Good to Know', value: goodToKnow }) });
                else module.goodToKnow = null;

                var recommendedDishes = restaurant.recommendedDishes();
                if (recommendedDishes.length > 0) module.recommendedDishes = new module.info.TextBlockView({ model: new module.KeyValue({ key: 'Recommended Dishes', value: recommendedDishes }) });
                else module.recommendedDishes = null;

                var recommendedMargaritas = restaurant.recommendedMargaritas();
                if (recommendedMargaritas.length > 0) module.recommendedMargaritas = new module.info.TextBlockView({ model: new module.KeyValue({ key: 'Recommended Margaritas', value: recommendedMargaritas }) });
                else module.recommendedMargaritas = null;

                var reviews = restaurant.get('reviews');
                if (reviews.length > 0) module.fullOverview = new module.info.FullOverviewView({ collection: restaurant.getReviewCollection() });
                else module.fullOverview = null;

                module.contentLayout.restaurantContent.show(module.infoView);

                module.infoView.imgBox.show(module.imagesView);
                module.infoView.bookBox.show(module.bookView);
                //module.infoView.exclusiveEatsOffer.show(module.exclusiveEatsOfferView);
                module.infoView.mainBox.show(module.mainView);
                module.infoView.mapBox.show(module.mapView);

                if (module.highlights != null) module.infoView.highlightsBox.show(module.highlights);
                else module.infoView.highlightsBox.close();

                if (module.goodToKnow != null) module.infoView.goodToKnowBox.show(module.goodToKnow);
                else module.infoView.goodToKnowBox.close();

                if (module.recommendedMargaritas != null) module.infoView.margaritasBox.show(module.recommendedMargaritas);
                else module.infoView.margaritasBox.close();

                if (module.recommendedDishes != null) module.infoView.dishesBox.show(module.recommendedDishes);
                else module.infoView.dishesBox.close();

                if (module.fullOverview != null) module.infoView.fullOverviewBox.show(module.fullOverview);
                else module.infoView.fullOverviewBox.close();

                module.bookView.on('slotChosen', function (selectedTime, specialMealId) {
                    var url;
                    if (selectedTime && selectedTime.length > 0) {
                        url = ['restaurants/', id,
                                '/party/', party,
                                '/date/', date,
                                '/time/', time,
                                '/', (fromRestaurants ? 'book-it' : 'book-it-ext'),
                                '/complete-reservation/', selectedTime
                        ].join('');

                        if (specialMealId) url += ('/meal/' + specialMealId);

                    } else {
                        url = fromRestaurants === true ?
                        ('restaurants/' + id + '/book-it') :
                        ('restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/book-it');
                    }

                    app.router.navigate(url, { trigger: true });
                });
            });
        },

        restauranReviewsShort: function (id) {
            this.restauranReviews(id, 2, Helper.formatDate(new Date()), '19:00', true);
        },

        restauranReviews: function (id, party, date, time, fromRestaurants) {
            this.setup();
            var module = require('modules/restaurant/info');

            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, module, 1, function (restaurant) {
                module.reviewsView = new module.reviews.ReviewsView({ collection: restaurant.getReviewCollection() });
                module.contentLayout.restaurantContent.show(module.reviewsView);
            });
        },

        restauranMenushort: function (id) {
            this.restauranMenus(id, 2, Helper.formatDate(new Date()), '19:00', true);
        },

        restauranMenus: function (id, party, date, time, fromRestaurants) {
            this.setup();
            var module = require('modules/restaurant/info');

            this.buildRestaurantBaseInfo(id, party, date, time, fromRestaurants, module, 2, function (restaurant) {
                module.menusView = new module.menus.MenusView({ collection: restaurant.getMenuCollection() });
                module.contentLayout.restaurantContent.show(module.menusView);
            });
        },

        restauranBookItShort: function (id, mealId) {
            this.restauranBookIt(id, 2, Helper.formatDate(new Date), '19:00', mealId, null, null, true);
        },

        restauranBookItEdit: function (id, party, date, time, code) {
            this.restauranBookIt(id, 2, Helper.formatDate(new Date), '19:00', null, code, null, true);
        },

        restauranBookIt: function (id, party, date, time, mealId, code, reservationId, fromRestaurants, newParty, newDate) {
            this.setup();
            var that = this,
                module = require('modules/restaurant/bookIt');

            this.buildRestaurantBaseInfo(id, newParty || party, newDate || date, time, fromRestaurants, module, 3, function (restaurant) {
                module.topBar.set('leftUrl', fromRestaurants === true ?
                        ('restaurants/' + id + '/info') :
                        ('restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/info'));

                module.chooseTimeView = new module.ChooseTimeView({ model: module.getSearchModel(newParty || party, newDate || date, restaurant.get('special_meals')), specialMealId: mealId });
                module.nextDaysView = new module.NextDaysView({ collection: module.getNextDays(newDate || date) });
                module.scheduleItemsView = new module.ScheduleItemsView({
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

                module.contentLayout.chooseTime.show(module.chooseTimeView);
                module.contentLayout.schedule.show(module.scheduleItemsView);
                module.contentLayout.nextDays.show(module.nextDaysView);

                module.calendarView = new module.CalendarView({ date: newDate || date });

                module.calendarTopBarView = new module.TopBarView({
                    model: module.calendarTopBar,
                    leftClickEvent: 'btnLeftClick'
                });

                module.chooseTimeView.on('datePickerClicked', function () {
                    module.calendarTopBarView.on('btnLeftClick', function () {
                        that.restauranBookIt(id, party, date, time, code, reservationId, fromRestaurants, module.chooseTimeView.model.get('party'), newDate ? Helper.formatDate(newDate) : null);
                    });

                    app.topBar.show(module.calendarTopBarView);
                    app.content.show(module.calendarView);

                    module.calendarView.on('dateSelected', function (selectedDate) {
                        module.chooseTimeView.model.set('date', selectedDate);
                        that.restauranBookIt(id, party, date, time, code, reservationId, fromRestaurants, module.chooseTimeView.model.get('party'), Helper.formatDate(selectedDate));
                    });
                });

                module.nextDaysView.on('newDayView:dateSelected', function (sender, selectedDate) {
                    module.chooseTimeView.model.set('date', selectedDate);
                    that.restauranBookIt(id, party, date, time, code, reservationId, fromRestaurants, module.chooseTimeView.model.get('party'), Helper.formatDate(selectedDate));
                });

                module.chooseTimeView.on('partySizeChanged', function (partySize) {
                    that.restauranBookIt(id, party, date, time, code, reservationId, fromRestaurants, partySize, newDate);
                });
            });
        },

        restaurantExclusiveEats: function (num) {
            this.setup();

            var module = require('modules/restaurant/exclusiveEats');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.aboutView = new module.AboutView;
            module.bookView = new module.BookView;
            module.selectView = new module.SelectView;

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.about.show(module.aboutView);
            module.contentLayout.select.show(module.selectView);
            module.contentLayout.book.show(module.bookView);
        },

        restaurantExclusiveEatsFaq: function (num) {

            var module = require('modules/restaurant/exclusiveEats');

            module.topBarBlock = new module.TopBarView({ model: module.faqTopBar });

            module.contentLayout = new module.FaqView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        completeReservationEdit: function (id, party, date, filterTime, from, time, code) {
            this.completeReservation(id, party, date, filterTime, from, time, null, code);
        },

        completeReservation: function (id, party, date, filterTime, from, time, mealId, code) {
            this.setup();
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

            var module = require('modules/restaurant/completeReservation');

            module.topBar.set('leftUrl', returnUrl);
            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            app.execute('GetRestaurant', id, slotDate, party, time, function (err, restaurant) {
                if (err) return that.errorPartial();

                app.execute('GetCurrentUser', function (err, currentUser) {
                    if (err) return that.errorPartial();

                    if (restaurant.get('slots').length == 0) return app.router.navigate(returnUrl, { trigger: true });

                    module.contentLayout = new module.ContentLayout;

                    module.restaurantInfoView = new module.RestaurantInfoView({
                        model: restaurant,
                        bookItUrl: bookItUrl
                    });

                    var showViews = function () {
                        app.topBar.show(module.topBarBlock);
                        app.content.show(module.contentLayout);

                        module.contentLayout.restaurantInfo.show(module.restaurantInfoView);
                        module.contentLayout.userInfo.show(module.contentLayout.userInfoView);
                        module.contentLayout.additionalInfo.show(module.contentLayout.additionalInfoView);

                        module.contentLayout.on('completeClicked', function () {
                            if (module.contentLayout.userInfoView.validate()) {
                                that.toggleLoading(true);
                                var lock = {
                                    user: module.contentLayout.userInfoView.getModel(),
                                    additionalInfo: module.contentLayout.additionalInfoView.getModel(),
                                    party: party,
                                    slotDate: slotDate,
                                    timeOffset: restaurant.get('current_time_offset'),
                                    restaurantId: id
                                };

                                if (code) {
                                    //update reservation after it modified                                    
                                    app.execute('UpdateReservation', code, lock, function (err, reservation) {
                                        if (err) return that.errorPartial();
                                        app.router.navigate('restaurants/' + id + '/confirmed-reservation/' + reservation.get('confirmation_code'), { trigger: true });
                                    });

                                } else {
                                    //create new reservation
                                    app.execute('ConfirmReservation', id, lock, function (err, reservationResponse) {
                                        if (err == null) {
                                            app.router.navigate('restaurants/' + id + '/confirmed-reservation/' + reservationResponse.get('confirmation_code'), { trigger: true });
                                        }
                                        else {
                                            var error = Helper.getErrorMessage(err);
                                            if (error) that.errorPartial(null, error);
                                            else that.errorPartial();
                                        }
                                    });
                                }
                            }
                        });
                    };

                    if (code) {
                        app.execute('GetReservation', code, function (err, reservation) {
                            if (err) return that.errorPartial(null, err);
                            if (reservation == null) return app.router.navigate('profile/reservations', { trigger: true });

                            module.contentLayout.userInfoView = new module.UserInfoView({ model: currentUser, reservation: reservation });//new
                            module.contentLayout.additionalInfoView = new module.AdditionalInfoView({ reservation: reservation });//new
                            showViews();
                        });
                    } else {
                        module.contentLayout.userInfoView = new module.UserInfoView({ model: currentUser });
                        module.contentLayout.additionalInfoView = new module.AdditionalInfoView;
                        showViews();
                    }
                });
            });
        },

        reservationConfirmed: function (restaurantId, code) {
            this.setup();
            var that = this,
                changing = 0;

            var module = require('modules/restaurant/confirmReservation');
            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err) return that.errorPartial();

                module.topBarBlock = new module.TopBarView({ model: module.topBar });

                var showViews = function (orderId) {
                    app.topBar.show(module.topBarBlock);
                    app.content.show(module.contentLayout);
                    that.toggleLoading();

                    module.contentLayout.on('btnCancelClicked', function () {
                        app.execute('CancelReservation', orderId, function (err) {
                            if (err) return that.errorPartial();
                            app.router.navigate('profile/reservations', { trigger: true });
                        });
                    });

                    module.contentLayout.on('btnModifyClicked', function (code, reservationId, party, date, time) {
                        app.router.navigate('restaurants/' + restaurantId + '/party/' + party + '/date/' + date + '/time/' + time + '/book-it/modify/' + code + '/' + reservationId, { trigger: true });
                    });

                    module.contentLayout.on('reminderChanged', function (smsReminder, emailReminder) {
                        changing++;
                        that.toggleLoading(true);
                        app.execute('UpdateReservationReminders', code, smsReminder, emailReminder, function (err, reservation) {
                            if (err) {
                                changing = 0;
                                that.toggleLoading();
                                return that.errorPartial(null, err);
                            }
                            changing--;

                            if (changing <= 0) that.toggleLoading();
                        });
                    });
                };

                if (currentUser == null) {
                    app.execute('GetReservation', code, function (err, reservation) {
                        if (err) return that.errorPartial(null, err);
                        if (reservation == null) return app.router.navigate('profile/reservations', { trigger: true });

                        module.contentLayout = new module.ContentLayout({ model: reservation, isConfirmedView: true, points: 200 })
                        showViews(reservation.get('order_id'));
                    });
                } else {
                    app.execute('GetReservation', code, function (err, reservation) {
                        if (err) return that.errorPartial(null, err);
                        if (reservation == null) return app.router.navigate('profile/reservations', { trigger: true });

                        module.contentLayout = new module.ContentLayout({ model: reservation, user: currentUser, isConfirmedView: true, points: 200 })
                        showViews(reservation.get('order_id'));
                    });
                }
            });
        },

        reservationCardInfo: function (num) {
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.CardInfoView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        reservationCanceled: function (num) {
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.CanceledView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profile: function () {
            this.setup();
            var that = this;

            var module = require('modules/profile');

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err) return that.errorPartial();

                if (currentUser == null) return app.router.navigate('login', { trigger: true });

                module.topBarBlock = new module.TopBarView({ model: module.topBar });
                module.contentLayout = new module.ContentLayout({ model: currentUser });

                app.topBar.show(module.topBarBlock);
                app.content.show(module.contentLayout);
            });
        },

        profileEdit: function () {
            this.setup();
            var module = require('modules/profile');

            module.topBarBlock = new module.TopBarView({ model: module.topBarEdit });

            module.contentLayout = new module.EditView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profileReservations: function () {
            this.setup();
            var that = this;

            var module = require('modules/reservations');

            app.execute('GetReservations', function (err, reservations) {
                if (err) return that.errorPartial(null, err);
                that.toggleLoading();

                if (reservations.error) {
                    that.errorPartial(null, reservations.error);
                } else {
                    module.topBarBlock = new module.TopBarView({ model: module.topBar });
                    module.contentLayout = new module.ContentLayout({ collection: reservations });

                    app.topBar.show(module.topBarBlock);
                    app.content.show(module.contentLayout);
                }
            });
        },

        profileReservation: function (code) {
            this.setup();
            var that = this,
                changing = 0,
                module = require('modules/reservations');

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err) return that.errorPartial();
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

                        module.detailsTopBar.set('title', title);
                        module.details = new module.DetailsView({ model: reservation, user: currentUser, minTimeToCancel: restaurant.get('min_time_to_cancel_reservation') });
                        module.topBarBlock = new module.TopBarView({ model: module.detailsTopBar });
                        module.contentLayout = module.details;

                        app.topBar.show(module.topBarBlock);
                        app.content.show(module.contentLayout);

                        module.details.on('btnCancelClicked', function () {
                            app.execute('CancelReservation', reservation.get('order_id'), function (err) {
                                if (err) return that.errorPartial();
                                app.router.navigate('profile/reservations', { trigger: true });
                            });
                        });

                        module.details.on('btnModifyClicked', function (code, reservationId, party, date, time) {
                            app.router.navigate('restaurants/' + restaurant.get('id') + '/party/' + party + '/date/' + date + '/time/' + time + '/book-it/modify/' + code + '/' + reservationId, { trigger: true });
                        });

                        module.details.on('reminderChanged', function (smsReminder, emailReminder) {
                            changing++;
                            that.toggleLoading(true);
                            app.execute('UpdateReservationReminders', code, smsReminder, emailReminder, function (err, reservation) {
                                if (err) {
                                    changing = 0;
                                    that.toggleLoading();
                                    return that.errorPartial(null, err);
                                }
                                changing--;

                                if (changing <= 0) that.toggleLoading();
                            });
                        });
                    });
                });
            });
        },

        '404': function () {
            this.setup();
            app.topBar.close();
            app.content.show(new NotFoundView);
        },

        errorPartial: function (holder, error) {
            holder = holder || app.content;
            error = typeof error == 'string' ? error : null; //error shoud be only string
            var errorView = new ErrorView({ error: error });
            holder.show(errorView);

            this.toggleLoading(false);
            return false;
        },

        toggleLoading: function (show) {
            if (show) app.loading.show(app.loadingView);
            else app.loading.close();
        },

        checkCurrentCity: function () {
            var currentCity = app.request('GetCurrentCity');
            if (currentCity == null) {
                app.router.navigate('', { trigger: true });
                return null;
            } else {
                return currentCity.get('id');
            }
        }
    });

    return Router;
});
