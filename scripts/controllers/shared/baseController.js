define([	
    'marionette',
	'app',
    'views/shared/error'],

function (Marionette, app, ErrorView) {
    var BaseController = Marionette.Controller.extend({
        initialize: function () {
            this.contentLayout = this.options.contentLayout;
            this.topBarLayout = this.options.topBarLayout;
        },

        errorPartial: function (error) {
            error = typeof error == 'string' ? error : null; //error shoud be only string
            var errorView = new ErrorView({ error: error });
            this.contentLayout.show(errorView);

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

    return BaseController;
});