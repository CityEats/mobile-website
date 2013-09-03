define([
	'app',
	'marionette',
    'views/shared/footer',
    'modules/data',
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
    'modules/reservations'
],
function (app, Marionette, FooterView, Data) {
    var Router = Marionette.AppRouter.extend({
        routes: {
            '': 'index',
            'index.html': 'index',
            'login': 'login',            
            'signup': 'signUp',
            'contact-us' : 'contactUs',
            'forgot-password': 'forgotPassword',
            'find-table/:num': 'findTable',
            'search-results': 'searchResults',
            'browse-all': 'browseAll',
            'filter': 'filter',
            'favorite-cuisines': 'favoriteCuisines',
            'favorite-neighborhoods': 'favoriteNeighborhoods',
            'restaurans/:num/info': 'restauranInfo',
            'restaurans/:num/reviews': 'restauranReviews',
            'restaurans/:num/menus': 'restauranMenus',
            'restaurans/:num/book-it': 'restauranBookIt',
            'restaurans/:num/exclusive-eats': 'restaurantExclusiveEats',
            'restaurans/:num/exclusive-eats-faq': 'restaurantExclusiveEatsFaq',
            'restaurans/:num/complete-reservation': 'completeReservation',
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

            //setup temporary DB logic
            var data = {
                allCuisines: Data.getAllCuisines(),
                allNeighborhoods: Data.getAllNeighborhoods(),                
                filter: Data.getFilter()
            };           

            app.commands.setHandler("FavCuisines:save", function (items) {
                //data.favCuisines = items;
                debugger
                data.filter.set('cuisineIds', items);
            });

            app.commands.setHandler("FavNeighborhoods:save", function (items) {
                //data.favNeighborhoods = items;
                debugger
                data.filter.set('neighborhoodIds', items);
            });            

            app.reqres.setHandler("FavCuisines:get", function (checked) {                
                return Data.getAllCuisines(data.filter.get('cuisineIds'));
            });

            app.reqres.setHandler("FavNeighborhoods:get", function (checked) {
                return Data.getAllNeighborhoods(data.filter.get('neighborhoodIds'));
            });            

            app.reqres.setHandler("Filter:get", function () {                
                data.filter.set('cuisines', Data.getAllCuisines(data.filter.get('cuisineIds')));
                data.filter.set('neighborhoods', Data.getAllNeighborhoods(data.filter.get('neighborhoodIds')));
                return data.filter;
            });

            app.commands.setHandler("Filter:save", function (item) {
                data.filter = item;
            });
        },

        index: function () {
            this.chooseCity();
        },

        chooseCity: function () {
            this.setup();

            var module = require('modules/cities');
            module.citiesView = new module.CitiesView({
                collection: module.collection
            });

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.hasCurrentCity = !!module.currentCity;
            console.log(module.hasCurrentCity)

            module.contentLayout = new module.ContentLayout({ hasCurrentCity: module.hasCurrentCity });

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.locationsButtons.show(module.citiesView);
            module.contentLayout.findYourCity.show(new module.DontSeeCityView);
            if (module.hasCurrentCity) {
                module.contentLayout.currentCity.show(new module.CityView({ model: module.currentCity }));
            }            
        },

        login: function () {            
            this.setup();

            var module = require('modules/login');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });            

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);            
        },

        signUp: function () {
            this.setup();

            var module = require('modules/signUp');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);            
        },

        forgotPassword: function () {
            this.setup();

            var module = require('modules/forgotPassword');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);            
        },

        contactUs: function () {
            this.setup();

            var module = require('modules/contactUs');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);            
        },

        findTable: function (num) {
            this.setup();

            var module = require('modules/findTable');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        searchResults: function () {
            this.setup();
            
            var module = require('modules/searchResults');

            module.restaurantsView = new module.RestaurantsView({
                collection: module.collection
            });
            
            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.searchBarView = new module.SearchBarView({
                model: module.search
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.resultsHolder.show(module.restaurantsView);            
            module.contentLayout.searchBar.show(module.searchBarView);
        },

        browseAll: function () {
            this.setup();

            var module = require('modules/browseAll');

            module.restaurantsView = new module.RestaurantsView({
                collection: module.collection
            });
            module.editorsPicksView = new module.RestaurantsView({
                collection: module.editorsPicksCollection
            });

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.searchBarView = new module.SearchBarView({
                model: module.search
            });

            module.contentLayout = new module.ContentLayout({
                isBrowseAll: true,
                isEditorsPicks: !!module.editorsPicksCollection,
            });

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.resultsHolder.show(module.restaurantsView);
            module.contentLayout.editorsPicks.show(module.editorsPicksView);
            module.contentLayout.searchBar.show(module.searchBarView);
        },

        filter: function () {
            this.setup();

            var module = require('modules/filter');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ContentLayout({
                model: app.request('Filter:get')
            });

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        favoriteCuisines: function () {            
            this.setup();

            var module = require('modules/filter');

            module.topBarBlock = new module.TopBarView({
                model: module.topBarCuisines,
                rightClickEvent: 'btnRightClick'
            });

            module.contentLayout = new module.FavoriteItemsView({
                collection: app.request('FavCuisines:get'),
                isCuisines: true
            });

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
            
            module.topBarBlock.on('btnRightClick', function (url) {                
                this.saveItems();
                app.router.navigate(url, { trigger: true });
            }, module.contentLayout);
        },

        favoriteNeighborhoods: function () {
            this.setup();

            var module = require('modules/filter');            
            
            module.topBarBlock = new module.TopBarView({                
                model: module.topBarNeighborhoods,
                rightClickEvent: 'btnRightClick'
            });

            module.contentLayout = new module.FavoriteItemsView({
                collection: app.request('FavNeighborhoods:get')
            });

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
            
            module.topBarBlock.on('btnRightClick', function (url) {               
                this.saveItems();                
                app.router.navigate(url, { trigger: true });
            },  module.contentLayout );
        },

        restauranInfo: function (num) {
            this.setup();

            var module = require('modules/restaurant/info');

            module.infoView = new module.info.InfoView;

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });
            
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
        },

        restauranReviews: function (num) {
            this.setup();

            var module = require('modules/restaurant/info');

            module.reviewsView = new module.reviews.ReviewsView({
                collection: module.reviews.reviews
            });

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

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

            module.reviewsView = new module.menus.MenusView({
                collection: module.menus.menus
            });

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

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

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

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

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

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

            module.topBarBlock = new module.TopBarView({
                model: module.faqTopBar
            });
            
            module.contentLayout = new module.FaqView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        completeReservation: function (num) {
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        reservationCardInfo: function (num) {
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.CardInfoView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        reservationConfirmed: function (num) {            
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ConfirmedView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        reservationCanceled: function (num) {            
            this.setup();

            var module = require('modules/restaurant/completeReservation');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.CanceledView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profile: function () {
            this.setup();

            var module = require('modules/profile');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profileEdit: function () {
            this.setup();

            var module = require('modules/profile');

            module.topBarBlock = new module.TopBarView({
                model: module.topBarEdit
            });

            module.contentLayout = new module.EditView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profileReservations: function () {
            this.setup();

            var module = require('modules/reservations');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profileCanceled: function () {
            this.setup();

            var module = require('modules/reservations');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.CanceledView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profilePast: function () {
            this.setup();

            var module = require('modules/reservations');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.PastView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },

        profileupcoming: function () {
            this.setup();

            var module = require('modules/reservations');

            module.topBarBlock = new module.TopBarView({
                model: module.topBar
            });

            module.contentLayout = new module.UpcomingView;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);
        },
    });

    return Router;
});
