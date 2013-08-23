define([
	'jquery',
	'underscore',
	'backbone',
	'app',
	'models/city',
    'models/topBar',
	'collections/cities',
    'views/chooseCity/content',
    'views/chooseCity/city',
    'views/chooseCity/cities',
    'views/chooseCity/dontSeeCity',
    'views/shared/topBar'
],

function ($, _, Backbone, app, City, TopBar, Cities, ContentLayout, CityView, CitiesView, DontSeeCityView, TopBarView) {
    return app.module('CitiesList', function (CitiesList) {
        _.extend(CitiesList, {
            collection: new Cities([new City({ name: '111', id: 1 }), new City({ name: '2222', id: 2 })]),
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '',
                rightText: 'Log In',
                rightUrl: 'login',
                title: 'Choose Your City'
            }),
            currentCity: new City({ name: '2222', isCurrent: true, id: 3 }),
            ContentLayout: ContentLayout,
            CityView: CityView,
            CitiesView: CitiesView,
            DontSeeCityView: DontSeeCityView,
            TopBarView: TopBarView
        });
    });
});