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
    'modules/searchResults'
],
function (app, Marionette, FooterView) {
    var Router = Marionette.AppRouter.extend({
        routes: {
            '': 'index',
            'index.html': 'index',
            'login': 'login',            
            'signup': 'signUp',
            'contact-us' : 'contactUs',
            'forgot-password': 'forgotPassword',
            'find-table/:num': 'findTable',
            'search-results': 'searchResults'
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

            console.log('chooseCity');
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

            console.log('login');
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

            console.log('signUp action');
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

            console.log('forgotPassword action');
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

            console.log('contact-us action');
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

            console.log('find-table action');
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

            module.contentLayout = new module.ContentLayout;

            app.topBar.show(module.topBarBlock);
            app.content.show(module.contentLayout);

            module.contentLayout.resultsHolder.show(module.restaurantsView);
            module.contentLayout.searchBar.show(new module.SearchBarView);            

            console.log('search-results action');
        }
    });

    return Router;

});
