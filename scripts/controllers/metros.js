define([
	'underscore',
	'app',
    'modules/helper',
    'BaseController',
	'models/city',
    'models/topBar',
	'collections/cities',
    'views/chooseCity/content',
    'views/chooseCity/city',
    'views/chooseCity/cities',
    'views/chooseCity/dontSeeCity',
    'views/shared/topBar'
],

function (_, app, Helper, BaseController, City, TopBar, Cities, ContentLayout, CityView, CitiesView, DontSeeCityView, TopBarView) {
    var Controller = BaseController.extend({
        index: function () {
            var that = this, contentView;

            app.execute('GetCurrentUser', function (err, currentUser) {
                app.execute('GetMetros', function (err, cities, isNearestCity) {
                    if (err) return that.errorPartial();

                    topBarView = getTopBarView();
                    that.topBarLayout.show(topBarView);

                    if (currentUser) topBarView.hideRightButton();

                    var currentCity = app.request('GetCurrentCity');

                    if (currentCity) {
                        if (isNearestCity === true) return app.router.navigate('find-table', { trigger: true });

                        currentCity.set('isCurrent', true);

                        //remove current city from main list
                        cities = new Cities(cities.filter(function (city) { return city.get('id') != currentCity.get('id') }));
                        contentView = new ContentLayout({ hasCurrentCity: true });

                        app.content.show(contentView);
                        contentView.currentCity.show(new CityView({ model: currentCity }));
                    } else {
                        contentView = new ContentLayout;
                        app.content.show(contentView);
                    }

                    var citiesView = new CitiesView({ collection: cities });
                    var dontSeeCityView = new DontSeeCityView;

                    dontSeeCityView.on('submitNewCity', function (email, zip) {
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
                    }, dontSeeCityView);

                    contentView.findYourCity.show(dontSeeCityView);
                    contentView.locationsButtons.show(citiesView);
                });
            });
        }
    });

    var getTopBarView = function () {
        var topBar = new TopBar({
            leftText: 'Home',
            leftUrl: 'back',
            rightText: 'Log In',
            rightUrl: 'login',
            title: 'Choose Your City'
        });

        return new TopBarView({ model: topBar });
    };

    return Controller;
});