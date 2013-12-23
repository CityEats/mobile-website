define([
	'app',
	'marionette',
    'views/shared/footer',
    'views/shared/error',
    'views/shared/404',
    'views/shared/loading',
    'modules/helper',
    'modules/forgotPassword',
    'modules/contactUs',
    'modules/restaurant/exclusiveEats',
    'modules/restaurant/completeReservation',
    'modules/profile',
    'modules/messages',
    'controllers/restaurants',
    'controllers/metros',
    'controllers/account',
    'controllers/findTable',
    'controllers/filter',
    'controllers/restaurant',
    'controllers/reservations',
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
            'restaurants': 'restaurants',
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
            'restaurants/:num/party/:num/date/:num/time/:num/book-it/modify/:code(/meal/:meal)': 'restauranBookItEdit',
            //'restaurants/:num/exclusive-eats': 'restaurantExclusiveEats',
            //'restaurants/:num/exclusive-eats-faq': 'restaurantExclusiveEatsFaq',
            'restaurants/:num/party/:num/date/:num/time/:num/:from/complete-reservation/:num(/meal/:meal)': 'completeReservation',            
            'restaurants/:num/party/:num/date/:num/time/:num/:from/complete-reservation/:num/modify/:code(/meal/:meal)': 'completeReservationEdit',
            //'restaurants/:num/:num/party/:num/date/:num/time/:num/:from/confirmed-reservation/:num/:num': 'reservationConfirmed',
            'restaurants/:num/confirmed-reservation/:num': 'reservationConfirmed',
            //'restaurants/:num/:num/complete-reservation/:num': 'completeReservation',
            //'restaurants/:num/reservation-card-info': 'reservationCardInfo',
            //'restaurants/:num/reservation-confirmed': 'reservationConfirmed',
            //'restaurants/:num/reservation-canceled': 'reservationCanceled',
            'profile': 'profile',
            //'profile/edit': 'profileEdit',
            //'profile/cuisines': 'profileCuisines',
            //'profile/neighborhoods': 'profileNeighborhoods',
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

        getController: function (controller) {
            this.setup();
            var Controller = require(controller);
            return new Controller({
                contentLayout: app.content,
                topBarLayout: app.topBar
            });
        },

        index: function () {
            this.chooseCity();
        },

        chooseCity: function () {
            this.getController('controllers/metros').index();
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
            this.getController('controllers/account').login(fbRedirectUri, url);
        },

        signUp: function () {
            this.getController('controllers/account').signUp(fbRedirectUri);
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

        findTable: function () {
            this.getController('controllers/findTable').index();
        },

        searchResults: function (party, date, time, newParty, newDate, newTime, searchQuery) {
            this.getController('controllers/restaurants').search(party, date, time, newParty, newDate, newTime, searchQuery);
        },

        restaurants: function () {            
            this.getController('controllers/restaurants').index();
        },

        restaurantsFilter: function (cityId) {
            this.filter(true);
        },

        searchResultsFilter: function (party, date, time) {
            this.filter(false, party, date, time);
        },

        filter: function (isRestaurants, party, date, time) {
            this.getController('controllers/filter').index(isRestaurants, party, date, time);
        },

        restaurantsFilterCuisines: function () {
            this.filterCuisines(true);
        },

        searchResultsFilterCuisines: function (party, date, time) {
            this.filterCuisines(false, party, date, time);
        },

        filterCuisines: function (isRestaurants, party, date, time) {            
            this.getController('controllers/filter').cuisines(isRestaurants, party, date, time);
        },

        restaurantsFilterNeighborhoods: function () {
            this.filterNeighborhoods(true);
        },

        searchResultsFilterNeighborhoods: function (party, date, time) {
            this.filterNeighborhoods(false, party, date, time);
        },

        filterNeighborhoods: function (isRestaurants, party, date, time) {            
            this.getController('controllers/filter').neighborhoods(isRestaurants, party, date, time);
        },        

        restauranInfoShort: function (id) {
            this.restauranInfo(id, 2, Helper.formatDate(new Date()), '19:00', true);
        },

        restauranInfo: function (id, party, date, time, fromRestaurants) {
            this.getController('controllers/restaurant').info(id, party, date, time, fromRestaurants);
        },

        restauranReviewsShort: function (id) {
            this.restauranReviews(id, 2, Helper.formatDate(new Date()), '19:00', true);
        },

        restauranReviews: function (id, party, date, time, fromRestaurants) {            
            this.getController('controllers/restaurant').reviews(id, party, date, time, fromRestaurants);
        },

        restauranMenushort: function (id) {
            this.restauranMenus(id, 2, Helper.formatDate(new Date()), '19:00', true);
        },

        restauranMenus: function (id, party, date, time, fromRestaurants) {            
            this.getController('controllers/restaurant').menus(id, party, date, time, fromRestaurants);
        },

        restauranBookItShort: function (id, mealId) {
            this.restauranBookIt(id, 2, Helper.formatDate(new Date), '19:00', mealId, null, true);
        },

        restauranBookItEdit: function (id, party, date, time, code, mealId) {
            this.restauranBookIt(id, 2, Helper.formatDate(new Date), '19:00', mealId, code, true);
        },

        restauranBookIt: function (id, party, date, time, mealId, code, fromRestaurants) {            
            this.getController('controllers/restaurant').bookIt(id, party, date, time, mealId, code, fromRestaurants);
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

        completeReservationEdit: function (id, party, date, filterTime, from, time, code, mealId) {
            this.completeReservation(id, party, date, filterTime, from, time, mealId, code);
        },

        completeReservation: function (id, party, date, filterTime, from, time, mealId, code) {            
            this.getController('controllers/reservations').completeReservation(id, party, date, filterTime, from, time, mealId, code);
        },

        reservationConfirmed: function (restaurantId, code) {
            this.getController('controllers/reservations').reservationConfirmed(restaurantId, code);
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
            this.getController('controllers/account').profile();
        },

        profileEdit: function () {
            this.getController('controllers/account').profileEdit();
        },

        profileCuisines: function(){
            this.getController('controllers/account').cuisines();
        },

        profileNeighborhoods: function () {
            this.getController('controllers/account').neighborhoods();
        },

        profileReservations: function () {
            this.getController('controllers/reservations').reservations();
        },

        profileReservation: function (code) {            
            this.getController('controllers/reservations').reservation(code);
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
