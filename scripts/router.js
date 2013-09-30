define([
	'app',
	'marionette',
    'views/shared/footer',
    'views/shared/error',
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
    'modules/profile',
    'modules/reservations',
    'modules/messages'
],
function (app, Marionette, FooterView, ErrorView, Helper) {
    var fbAppId = '488317004581923',
        fbRedirectUri = 'https://qa-beta.cityeats.com/api/v2/facebook_auth';

    var Router = Marionette.AppRouter.extend({
        routes: {
            '': 'index',
            'index.html': 'index',
            'back': 'back',
            'login': 'login',
            'signup': 'signUp',
            'contact-us': 'contactUs',
            'forgot-password': 'forgotPassword',
            'find-table/:num': 'findTable',
            'search-results/:num/party/:num/date/:num/time/:num': 'searchResults',            
            'restaurants/:num': 'browseAll',
            'restaurants/:num/filter': 'restaurantsFilter',
            'search-results/:num/party/:num/date/:num/time/:num/filter': 'searchResultsFilter',
            'restaurants/:num/filter/cuisines': 'restaurantsFilterCuisines',
            'search-results/:num/party/:num/date/:num/time/:num/filter/cuisines': 'searchResultsFilterCuisines',
            'restaurants/:num/filter/neighborhoods': 'restaurantsFilterNeighborhoods',
            'search-results/:num/party/:num/date/:num/time/:num/filter/neighborhoods': 'searchResultsFilterNeighborhoods',
            'restaurants/:num/:num/info': 'restauranInfoShort',
            'restaurants/:num/:num/party/:num/date/:num/time/:num/info': 'restauranInfo',
            'restaurants/:num/:num/reviews': 'restauranReviewsShort',
            'restaurants/:num/:num/party/:num/date/:num/time/:num/reviews': 'restauranReviews',
            'restaurants/:num/menus': 'restauranMenus',
            'restaurants/:num/book-it': 'restauranBookIt',
            'restaurants/:num/exclusive-eats': 'restaurantExclusiveEats',
            'restaurants/:num/exclusive-eats-faq': 'restaurantExclusiveEatsFaq',
            'restaurants/:num/:num/complete-reservation/:num': 'completeReservation',
            'restaurants/:num/reservation-card-info': 'reservationCardInfo',
            'restaurants/:num/reservation-confirmed': 'reservationConfirmed',
            'restaurants/:num/reservation-canceled': 'reservationCanceled',
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

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err == null) {                    
                    module.topBarBlock = new module.TopBarView({ model: module.topBar });
                    app.topBar.show(module.topBarBlock);
                    if (currentUser) {
                        module.topBarBlock.hideRightButton();
                    }

                    app.execute('GetMetros', function (err, cities, isNearestCity) {
                        if (err == null) {
                            var currentCity = app.request('GetCurrentCity');
                            if (currentCity) {
                                if (isNearestCity === true) {
                                    app.router.navigate('find-table/' + currentCity.get('id'), { trigger: true });
                                    return true;
                                }
                                module.contentLayout = new module.ContentLayout({ hasCurrentCity: !!currentCity });
                                app.content.show(module.contentLayout);
                                currentCity.set('isCurrent', true);
                                cities = new module.Cities(cities.without(currentCity));
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
                        }
                    });
                }
            });            
        },

        back: function () {
            var currentCity = app.request('GetCurrentCity');

            if (currentCity == null) {
                app.router.navigate('', { trigger: true }); 
            } else {                
                app.router.navigate('find-table/' + currentCity.get('id'), { trigger: true });
            }
        },

        login: function () {            
            this.setup();
            var that = this;
            var module = require('modules/login');

            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.contentLayout = new module.ContentLayout({
                appId: fbAppId,
                redirectUri: fbRedirectUri
            });

            module.contentLayout.on('loginSubmited', function (user) {
                var view = this;
                app.execute('SignIn', user, function (err, data) {
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

                }, module.contentLayou);
            });

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        signUp: function () {
            this.setup();
            var that = this;
            var module = require('modules/signUp');

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

        findTable: function (cityId, date, newParty, newDate, newTime) {
            this.setup();
            var that = this;
            var module = require('modules/findTable');
            date = date || new Date;
            party = 2;
            time = '19:00';
            app.execute('GetRestaurantsByMetro', cityId); //preload restaurants;
            app.execute('GetCuisines', cityId); //preload cuisines;

            var currentCity = app.request('GetCurrentCity');

            if (currentCity == null) {
                //
                app.router.navigate('', { trigger: true });
                return;
            }            

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err == null) {
                    var name;
                    if (currentUser) {
                        name = currentUser.get('first_name') + ' ' + currentUser.get('last_name');
                    }

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
                            that.findTable(cityId, date, newDate);
                        });

                        app.topBar.show(module.calendarTopBarView);
                        app.content.show(module.calendarView);

                        module.calendarView.on('dateSelected', function (selectedDate) {                            
                            module.searchBar.model.set('date', selectedDate);
                            
                            that.findTable(cityId, date, module.searchBar.model.get('party'), selectedDate, module.searchBar.model.get('time'));
                        });
                    });

                    module.contentLayout.on('findTableClicked', function () {
                        var date = module.searchBar.model.get('date');
                        var partySize = module.searchBar.model.get('party');
                        var time = module.searchBar.model.get('time');

                        var url = 'search-results/' + cityId + '/party/' + partySize + '/date/' + Helper.formatDate(date) + '/time/' + time;
                        app.router.navigate(url, { trigger: true });
                    });
                }
            });            

            module.topBarBlock = new module.TopBarView({ model: module.topBar });
            app.topBar.show(module.topBarBlock);            
        },

        searchResults: function (cityId, party, date, time, newParty, newDate, newTime) {
            this.setup();
            var that = this;

            var module = require('modules/searchResults'),
                filter = app.request('GetFilterSimple', cityId);

            var currentCity = app.request('GetCurrentCity');
            if (currentCity == null) {
                //
                app.router.navigate('', { trigger: true });
                return;
            }

            module.topBar.set('rightUrl', 'search-results/' + cityId + '/party/' + party + '/date/' + date + '/time/' + time + '/filter');
            module.topBar.set('title', currentCity.get('display_name'));

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
            
            module.searchBar = new module.SearchBarView({
                model: module.getSearchModel(newParty || party, newDate || date, newTime || time),
                defaults: {
                    party: party,
                    date: date,
                    time: time
                },
                showFindButton: true
            });

            var getRestaurantsHandler = function (err, data) {
                if (err == null) {
                    module.restaurantsView = new module.RestaurantsView({ collection: data });

                    if (module.contentLayout == null) {
                        //render only at first time                        
                        module.contentLayout = new module.ContentLayout;
                        module.calendarView = new module.CalendarView({ date: newDate || date });;
                        module.calendarTopBarView = new module.TopBarView({
                            model: module.calendarTopBar,
                            leftClickEvent: 'btnLeftClick'
                        })

                        app.content.show(module.contentLayout);
                        module.contentLayout.searchBar.show(module.searchBar);

                        module.searchBar.on('datePickerClicked', function () {
                            module.calendarTopBarView.on('btnLeftClick', function () {
                                that.searchResults(cityId, party, date, time, newDate);
                            });

                            app.topBar.show(module.calendarTopBarView);
                            app.content.show(module.calendarView);

                            module.calendarView.on('dateSelected', function (selectedDate) {
                                module.searchBar.model.set('date', selectedDate);                                
                                that.searchResults(cityId, party, date, time, module.searchBar.model.get('party'), Helper.formatDate(selectedDate), module.searchBar.model.get('time'));
                            });
                        });
                    }

                    module.contentLayout.resultsHolder.show(module.restaurantsView);
                }
            };

            module.searchBar.on('searchParametersChanged', function (data) {
                var startChanged = new Date(data.date + ' ' + data.time);
                var endChanged = new Date(data.date + ' ' + data.time);

                startChanged.setMinutes(startChanged.getMinutes() - 15);
                endChanged.setMinutes(endChanged.getMinutes() + 15);

                app.execute('GetRestaurants', cityId, startChanged, endChanged, data.party, data.time, data.searchQuery,  filter, getRestaurantsHandler);
            });

            app.topBar.show(module.topBarBlock);            
            app.execute('GetRestaurants', cityId, start, end, party, time, null, filter, getRestaurantsHandler);
        },

        browseAll: function (cityId) {
            this.setup();

            var module = require('modules/browseAll'),
                filter = app.request('GetFilterSimple', cityId);

            var currentCity = app.request('GetCurrentCity');
            if (currentCity == null) {
                //
                app.router.navigate('', { trigger: true });
                return;
            }

            module.topBar.set('rightUrl', 'restaurants/' + cityId + '/filter');
            module.topBar.set('title', currentCity.get('display_name'));

            if (filter && !filter.isDefault()) {
                module.topBar.set('rightCss', 'red');
            } else {
                module.topBar.set('rightCss', '');
            }

            module.contentLayout = null;
            module.topBarBlock = new module.TopBarView({ model: module.topBar });

            module.searchBarView = new module.SearchBarView({
                model: module.search,
                showFindButton: true
            });

            app.topBar.show(module.topBarBlock);

            var getRestaurantsHandler = function (err, restaurants) {
                if (err == null) {
                    if (module.contentLayout == null) {
                        module.contentLayout = new module.ContentLayout({
                            isBrowseAll: true,
                            //isEditorsPicks: true,
                        });

                        app.content.show(module.contentLayout);

                        module.contentLayout.searchBar.show(module.searchBarView);
                    }

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
                }
            };            

            module.searchBarView.on('searchParametersChanged', function (data) {                
                app.execute('GetRestaurantsByMetro', cityId, filter, data.searchQuery, getRestaurantsHandler);
            });

            app.execute('GetRestaurantsByMetro', cityId, filter, null, getRestaurantsHandler);
        },

        restaurantsFilter: function (cityId) {
            this.filter(cityId, true);
        },

        searchResultsFilter: function (cityId, party, date, time) {
            this.filter(cityId, false, party, date, time);
        },

        filter: function (cityId, isRestaurants, party, date, time) {
            this.setup();

            var module = require('modules/filter');
            module.topBarBlock = new module.TopBarView({
                model: module.topBar,
                rightClickEvent: 'btnRightClick'
            });
            
            var backUrl = isRestaurants ?
                'restaurants/' + cityId :
                'search-results/' + cityId + '/party/' + party + '/date/' + date + '/time/' + time;
            module.topBar.set('leftUrl', backUrl);

            app.topBar.show(module.topBarBlock);

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err == null) {
                    module.contentLayout = new module.ContentLayout({
                        model: filter,
                        cityId: cityId,
                        isRestaurants: isRestaurants,
                        searchSettings: {
                            party: party,
                            date: date,
                            time: time
                        }
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

        restaurantsFilterCuisines: function (cityId) {
            this.filterCuisines(cityId, true);
        },

        searchResultsFilterCuisines: function (cityId, party, date, time) {
            this.filterCuisines(cityId, false, party, date, time);
        },        

        filterCuisines: function (cityId, isRestaurants, party, date, time) {
            this.setup();

            var module = require('modules/filter');
            
            var backUrl = isRestaurants ? 
                'restaurants/'+ cityId+ '/filter' :
                'search-results/' + cityId + '/party/' + party + '/date/' + date + '/time/' + time + '/filter';

            module.topBarCuisines.set('leftUrl', backUrl);
            module.topBarCuisines.set('rightUrl', backUrl);

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

        restaurantsFilterNeighborhoods: function (cityId) {
            this.filterNeighborhoods(cityId, true);
        },

        searchResultsFilterNeighborhoods: function (cityId, party, date, time) {
            this.filterNeighborhoods(cityId, false, party, date, time);
        },

        filterNeighborhoods: function (cityId, isRestaurants, party, date, time) {
            this.setup();

            var module = require('modules/filter');
           
            var backUrl = isRestaurants ?
                'restaurants/' + cityId + '/filter' :
                'search-results/' + cityId + '/party/' + party + '/date/' + date + '/time/' + time + '/filter';

            module.topBarNeighborhoods.set('leftUrl', backUrl);
            module.topBarNeighborhoods.set('rightUrl', backUrl);

            module.topBarBlock = new module.TopBarView({
                model: module.topBarNeighborhoods,
                rightClickEvent: 'btnRightClick'
            });            

            app.topBar.show(module.topBarBlock);            

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err == null) {
                    module.contentLayout = new module.FavoriteItemsView({
                        collection: filter.get('neighborhoods'),
                        cityId: cityId,
                        isRestaurants: isRestaurants
                    });

                    app.content.show(module.contentLayout);

                    module.topBarBlock.on('btnRightClick', function (url) {
                        this.saveItems();
                        app.router.navigate(url, { trigger: true });
                    }, module.contentLayout);
                }
            });
        },

        restauranInfoShort: function (cityId, id) {            
            this.restauranInfo(cityId, id, 2, Helper.formatDate(new Date()), '19:00', true);
        },

        restauranInfo: function (cityId, id, party, date, time, fromRestaurants) {
            this.setup();            
            var module = require('modules/restaurant/info');
            var start = new Date(date + ' ' + time);
            var end = new Date(date + ' ' + time);

            start.setMinutes(start.getMinutes() - 15);
            end.setMinutes(end.getMinutes() + 15);

            module.infoView = new module.info.InfoView;

            app.execute('GetRestaurant', id, start, end, party, time, function (err, restaurant) {
                if (err == null) {
                    module.topBar.set('title', restaurant.get('name'));
                    
                    module.topBar.set('leftUrl',
                        fromRestaurants === true ?
                        ('restaurants/' + cityId):
                        ('search-results/' + cityId + '/party/' + party + '/date/' + date + '/time/' + time));

                    module.topMenuView = new module.TopMenuView({
                        model: new module.KeyValue({ key: 0 }),
                        urlBase: fromRestaurants === true ?
                        ('restaurants/' + cityId + '/' + id + '/') :
                        ('restaurants/' + cityId + '/' + id + '/' + '/party/' + party + '/date/' + date + '/time/' + time)
                    });
                    
                    module.topBarBlock = new module.TopBarView({ model: module.topBar });

                    module.bookView = new module.info.BookView({ model: restaurant });
                    module.exclusiveEatsOfferView = new module.info.ExclusiveEatsOfferView;
                    module.imagesView = new module.info.ImagesView({ model: restaurant });
                    module.mainView = new module.info.MainView({ model: restaurant });
                    module.mapView = new module.info.MapView({ model: restaurant });

                    var highlights = restaurant.highlights();
                    if (highlights.length > 0) {
                        module.highlights = new module.info.TextBlockView({ model: new module.KeyValue({ key: 'Highlights', value: highlights }) })
                    } else {
                        module.highlights = null;
                    }

                    var goodToKnow = restaurant.goodToKnow();
                    if (goodToKnow.length > 0) {
                        module.goodToKnow = new module.info.TextBlockView({ model: new module.KeyValue({ key: 'Good to Know', value: goodToKnow }) })
                    } else {
                        module.goodToKnow = null;
                    }
                    
                    var reviews = restaurant.get('reviews');
                    if (reviews.length > 0) {
                        module.fullOverview = new module.info.FullOverviewView({ collection: restaurant.getReviewCollection() });
                    } else {
                        module.fullOverview = null;
                    }
                    //module.TextBlockView = new module.info.TextBlockView;

                    module.contentLayout = new module.ContentLayout;

                    app.topBar.show(module.topBarBlock);
                    app.content.show(module.contentLayout);

                    module.contentLayout.restaurantContent.show(module.infoView);
                    module.contentLayout.topMenu.show(module.topMenuView);
                    
                    module.infoView.imgBox.show(module.imagesView);
                    module.infoView.bookBox.show(module.bookView);
                    //module.infoView.exclusiveEatsOffer.show(module.exclusiveEatsOfferView);
                    module.infoView.mainBox.show(module.mainView);
                    module.infoView.mapBox.show(module.mapView);

                    if (module.highlights != null) {
                        module.infoView.highlightsBox.show(module.highlights);
                    } else {
                        module.infoView.highlightsBox.close();
                    }

                    if (module.goodToKnow != null) {
                        module.infoView.goodToKnowBox.show(module.goodToKnow);
                    } else {
                        module.infoView.goodToKnowBox.close();
                    }                    

                    if (module.reviews != null) {
                        module.infoView.fullOverviewBox.show(module.fullOverview);
                    } else {
                        module.infoView.fullOverviewBox.close();
                    }
                    
                    //module.infoView.imgBox.show('highlightsBox', 'goodToKnowBox', 'dishesBox', 'margaritasBox', 'fullOverviewBox');     
                }
            });
        },

        restauranReviewsShort: function (cityId, id) {
            this.restauranReviews(cityId, id, 2, Helper.formatDate(new Date()), '19:00', true);
        },

        restauranReviews: function (cityId, id, party, date, time, fromRestaurants) {

            this.setup();
            var module = require('modules/restaurant/info');
            var start = new Date(date + ' ' + time);
            var end = new Date(date + ' ' + time);

            start.setMinutes(start.getMinutes() - 15);
            end.setMinutes(end.getMinutes() + 15);

            
            app.execute('GetRestaurant', id, start, end, party, time, function (err, restaurant) {
                if (err == null) {
                    module.topBar.set('title', restaurant.get('name'));

                    module.topBar.set('leftUrl',
                        fromRestaurants === true ?
                        ('restaurants/' + cityId) :
                        ('search-results/' + cityId + '/party/' + party + '/date/' + date + '/time/' + time));

                    module.topMenuView = new module.TopMenuView({
                        model: new module.KeyValue({ key: 1 }),
                        urlBase: fromRestaurants === true ?
                        ('restaurants/' + cityId + '/' + id + '/') :
                        ('restaurants/' + cityId + '/' + id + '/' + '/party/' + party + '/date/' + date + '/time/' + time)
                    });


                    module.reviewsView = new module.reviews.ReviewsView({ collection: restaurant.getReviewCollection() });

                    module.topBarBlock = new module.TopBarView({ model: module.topBar });
                    

                    module.contentLayout = new module.ContentLayout;

                    app.topBar.show(module.topBarBlock);
                    app.content.show(module.contentLayout);

                    module.contentLayout.restaurantContent.show(module.reviewsView);
                    module.contentLayout.topMenu.show(module.topMenuView);
                }
            });            
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

        completeReservation: function (cityId, restaurantId, time) {
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

        errorPartial: function (holder) {
            holder = holder || app.content;
            var errorView = new ErrorView;
            holder.show(errorView);
        },
    });

    return Router;
});
