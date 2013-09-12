define([
	'app',
	'marionette',
    'views/shared/footer',
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
    'modules/profile',
    'modules/reservations',
    'modules/messages'
],
function (app, Marionette, FooterView) {
    var Router = Marionette.AppRouter.extend({
        routes: {
            '': 'index',
            'index.html': 'index',
            'login': 'login',
            'signup': 'signUp',
            'contact-us': 'contactUs',
            'forgot-password': 'forgotPassword',
            'find-table/:num': 'findTable',
            'search-results/:num/party/:num/date/:num/time/:num': 'searchResults',
            'browse-all/:num': 'browseAll',
            'filter/:num': 'filter',
            'filter/:num/cuisines': 'filterCuisines',
            'filter/:num/neighborhoods': 'filterNeighborhoods',
            'restaurans/:num/info': 'restauranInfoShort',
            'restaurans/:num/party/:num/date/:num/time/:num/info': 'restauranInfo',
            'restaurans/:num/reviews': 'restauranReviews',
            'restaurans/:num/menus': 'restauranMenus',
            'restaurans/:num/book-it': 'restauranBookIt',
            'restaurans/:num/exclusive-eats': 'restaurantExclusiveEats',
            'restaurans/:num/exclusive-eats-faq': 'restaurantExclusiveEatsFaq',
            'restaurans/:num/complete-reservation/:num': 'completeReservation',
            'restaurans/:num/reservation-card-info': 'reservationCardInfo',
            'restaurans/:num/reservation-confirmed': 'reservationConfirmed',
            'restaurans/:num/reservation-canceled': 'reservationCanceled',
            'profile': 'profile',
            'profile/edit': 'profileEdit',
            'profile/reservations': 'profileReservations',
            'profile/canceled': 'profileCanceled',
            'profile/past': 'profilePast',
            'profile/upcoming': 'profileupcoming',
        },

        setup: function () {
            if (app.footer) { return true; }

            app.footerView = new FooterView;

            app.addRegions({ topBar: '#topBar' });
            app.addRegions({ content: '#content' });
            app.addRegions({ footer: '#footer' });

            app.footer.show(app.footerView);
        },

        index: function () {
            this.chooseCity();
        },

        chooseCity: function () {
            this.setup();

            var module = require('modules/cities');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });
            app.topBar.show(module.topBarBlock);            

            app.execute('GetMetros', function (err, cities) {
                if (err == null) {
                    var currentCity = app.request('GetCurrentCity');
                    if (currentCity) {
                        //currentCity = cities.get(currentCityId);
                        module.contentLayout = new module.ContentLayout({ hasCurrentCity: !!currentCity });
                        app.content.show(module.contentLayout);
                        //if (currentCity) {
                        currentCity.set('isCurrent', true);
                        cities = new module.Cities(cities.without(currentCity));

                        module.contentLayout.currentCity.show(new module.CityView({ model: currentCity }));
                        //}
                    } else {
                        module.contentLayout = new module.ContentLayout;
                        app.content.show(module.contentLayout);
                    }

                    module.citiesView = new module.CitiesView({ collection: cities });

                    module.contentLayout.findYourCity.show(new module.DontSeeCityView);
                    module.contentLayout.locationsButtons.show(module.citiesView);
                }
            });
        },

        login: function () {
            this.setup();

            var module = require('modules/login');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        signUp: function () {
            this.setup();

            var module = require('modules/signUp');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout;

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

        findTable: function (num) {
            this.setup();
            app.execute('GetRestaurantsByMetro', num); //preload restaurants;
            app.execute('GetCuisines', num); //preload cuisines;

            var currentCity = app.request('GetCurrentCity');
            if (currentCity == null) {
                //
                app.router.navigate('', { trigger: true });
                return;
            }

            var module = require('modules/findTable');

            module.searchBar = new module.SearchBarView({
                model: module.getSearchModel(2, new Date(), '19:00')                
            })

            module.topBarBlock = new module.TopBarView({ model: module.topBar });
            module.contentLayout = new module.ContentLayout({ model: currentCity });

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
            module.contentLayout.search.show(module.searchBar);
        },

        searchResults: function (cityId, party, date, time) {
            this.setup();

            var module = require('modules/searchResults'),
                filter = app.request('GetFilterSimple', cityId);

            module.topBar.set('rightUrl', 'filter/' + cityId);

            if (filter && !filter.isDefault()) {
                module.topBar.set('rightCss', 'red');
            } else {
                module.topBar.set('rightCss', '');
            }

            module.contentLayout = null;
            var start = new Date(date + ' ' + time);
            var end = new Date(date + ' ' + time);

            start.setMinutes(start.getMinutes() - 15);
            end.setMinutes(end.getMinutes() + 15);

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.searchBarView = new module.SearchBarView({
                model: module.getSearchModel(party, date, time),
                showFindButton: true
            });

            var getRestaurantsHandler = function (err, data) {
                if (err == null) {
                    console.log(data);

                    module.restaurantsView = new module.RestaurantsView({ collection: data });

                    if (module.contentLayout == null) {
                        //render only at first time                        
                        module.contentLayout = new module.ContentLayout;
                        app.content.show(module.contentLayout);
                        module.contentLayout.searchBar.show(module.searchBarView);
                    }

                    module.contentLayout.resultsHolder.show(module.restaurantsView);
                }
            };

            module.searchBarView.on('searchParametersChanged', function (data) {

                //data.searchQuery;
                var startChanged = new Date(data.date + ' ' + data.time);
                var endChanged = new Date(data.date + ' ' + data.time);

                startChanged.setMinutes(startChanged.getMinutes() - 15);
                endChanged.setMinutes(endChanged.getMinutes() + 15);

                app.execute('GetRestaurants', cityId, startChanged, endChanged, data.party, data.time, filter, getRestaurantsHandler);
            });

            app.topBar.show(module.topBarBlock);            
            app.execute('GetRestaurants', cityId, start, end, party, time, filter, getRestaurantsHandler);
        },

        browseAll: function (cityId) {
            this.setup();

            var module = require('modules/browseAll'),
                filter = app.request('GetFilterSimple', cityId);

            module.topBar.set('rightUrl', 'filter/' + cityId);
            if (filter && !filter.isDefault()) {
                module.topBar.set('rightCss', 'red');
            } else {
                module.topBar.set('rightCss', '');
            }

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.searchBarView = new module.SearchBarView({
                model: module.search,
                showFindButton: true
            });

            app.topBar.show(module.topBarBlock);

            app.execute('GetRestaurantsByMetro', cityId, app.request('GetFilterSimple', cityId), function (err, restaurants) {
                module.contentLayout = new module.ContentLayout({
                    isBrowseAll: true,
                    //isEditorsPicks: true,
                });

                app.content.show(module.contentLayout);

                module.contentLayout.searchBar.show(module.searchBarView);

                module.restaurantsView = new module.RestaurantsView({
                    collection: restaurants,
                    showSimple: true
                });

                //module.editorsPicksView = new module.RestaurantsView({
                //    collection: restaurants,
                //    showSimple: true
                //});

                module.contentLayout.resultsHolder.show(module.restaurantsView);
                //module.contentLayout.editorsPicks.show(module.editorsPicksView);
            });

        },

        filter: function (cityId) {
            this.setup();

            var module = require('modules/filter');
            module.topBarBlock = new module.TopBarView({
                model: module.topBar,
                rightClickEvent: 'btnRightClick'
            });
            app.topBar.show(module.topBarBlock);

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err == null) {
                    module.contentLayout = new module.ContentLayout({
                        model: filter,
                        cityId: cityId
                    });

                    module.contentLayout.on('filterChanged', function (isDefault) {
                        if (isDefault) {
                            this.hideRightButton();
                        } else {
                            this.showRightButton();
                        }
                    }, module.topBarBlock);

                    module.topBarBlock.on('btnRightClick', function () {
                        app.execute('ResetFilter', cityId);
                        this.resetFilter();
                    }, module.contentLayout);
                    
                    app.content.show(module.contentLayout);                    
                }
            });            
            
        },

        filterCuisines: function (cityId) {
            this.setup();

            var module = require('modules/filter');

            module.topBarCuisines.set('rightUrl', 'filter/' + cityId);
            module.topBarBlock = new module.TopBarView({
                model: module.topBarCuisines,
                rightClickEvent: 'btnRightClick'
            });

            app.topBar.show(module.topBarBlock);            

            app.execute('GetFilter', cityId, function (err, filter) {                
                if (err == null) {
                    module.contentLayout = new module.FavoriteItemsView({
                        collection: filter.get('cuisines'),
                        isCuisines: true,
                        cityId: cityId
                    });

                    app.content.show(module.contentLayout);

                    module.topBarBlock.on('btnRightClick', function (url) {
                        this.saveItems();
                        app.router.navigate(url, { trigger: true });
                    }, module.contentLayout);
                }
            });
        },

        filterNeighborhoods: function (cityId) {
            this.setup();

            var module = require('modules/filter');

            module.topBarNeighborhoods.set('rightUrl', 'filter/' + cityId);
            module.topBarBlock = new module.TopBarView({
                model: module.topBarNeighborhoods,
                rightClickEvent: 'btnRightClick'
            });            

            app.topBar.show(module.topBarBlock);            

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err == null) {
                    module.contentLayout = new module.FavoriteItemsView({
                        collection: filter.get('neighborhoods'),
                        cityId: cityId
                    });

                    app.content.show(module.contentLayout);

                    module.topBarBlock.on('btnRightClick', function (url) {
                        this.saveItems();
                        app.router.navigate(url, { trigger: true });
                    }, module.contentLayout);
                }
            });
        },

        restauranInfoShort: function (id) {            
            this.restauranInfo(id, 2, new Date(), '19:00');
        },

        restauranInfo: function (id, party, date, time) {
            this.setup();

            var module = require('modules/restaurant/info');
            var start = new Date(date + ' ' + time);
            var end = new Date(date + ' ' + time);

            start.setMinutes(start.getMinutes() - 15);
            end.setMinutes(end.getMinutes() + 15);

            module.infoView = new module.info.InfoView;

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.topMenuView = new module.TopMenuView({
                model: new module.KeyValue({ key: 0 })
            });

            module.bookView = new module.info.BookView;
            module.exclusiveEatsOfferView = new module.info.ExclusiveEatsOfferView;
            module.imagesView = new module.info.ImagesView;
            module.mainView = new module.info.MainView;
            module.mapView = new module.info.MapView;
            //module.TextBlockView = new module.info.TextBlockView;

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.restaurantContent.show(module.infoView);
            module.contentLayout.topMenu.show(module.topMenuView);

            module.infoView.imgBox.show(module.imagesView);
            module.infoView.bookBox.show(module.bookView);
            module.infoView.exclusiveEatsOffer.show(module.exclusiveEatsOfferView);
            module.infoView.mainBox.show(module.mainView);
            module.infoView.mapBox.show(module.mapView);
            //module.infoView.imgBox.show('highlightsBox', 'goodToKnowBox', 'dishesBox', 'margaritasBox', 'fullOverviewBox');     

            app.execute('GetRestaurant', id, start, end, party, function (err, restaurant) {
                if (err == null) {
                }
            });
        },

        restauranReviews: function (num) {
            this.setup();

            var module = require('modules/restaurant/info');

            module.reviewsView = new module.reviews.ReviewsView({ collection: module.reviews.reviews });

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.topMenuView = new module.TopMenuView({
                model: new module.KeyValue({ key: 1 })
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.restaurantContent.show(module.reviewsView);
            module.contentLayout.topMenu.show(module.topMenuView);
        },

        restauranMenus: function (num) {
            this.setup();

            var module = require('modules/restaurant/info');

            module.reviewsView = new module.menus.MenusView({ collection: module.menus.menus });

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.topMenuView = new module.TopMenuView({
                model: new module.KeyValue({ key: 2 })
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.restaurantContent.show(module.reviewsView);
            module.contentLayout.topMenu.show(module.topMenuView);
        },

        restauranBookIt: function (num) {
            this.setup();

            var module = require('modules/restaurant/bookIt');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.chooseTimeView = new module.ChooseTimeView;
            module.nextDaysView = new module.NextDaysView;
            module.scheduleItemsView = new module.ScheduleItemsView;

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.chooseTime.show(module.chooseTimeView);
            module.contentLayout.schedule.show(module.scheduleItemsView);
            module.contentLayout.nextDays.show(module.nextDaysView);
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
            this.setup();

            var module = require('modules/restaurant/exclusiveEats');

            module.topBarBlock = new module.TopBarView({ model: module.faqTopBar });

            module.contentLayout = new module.FaqView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        completeReservation: function (num, time) {
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        reservationCardInfo: function (num) {
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.CardInfoView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        reservationConfirmed: function (num) {
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ConfirmedView;

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

            var module = require('modules/profile');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
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

            var module = require('modules/reservations');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profileCanceled: function () {
            this.setup();

            var module = require('modules/reservations');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.CanceledView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profilePast: function () {
            this.setup();

            var module = require('modules/reservations');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.PastView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profileupcoming: function () {
            this.setup();

            var module = require('modules/reservations');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.UpcomingView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },
    });

    return Router;
});
