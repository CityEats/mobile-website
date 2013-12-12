define([
	'underscore',
	'app',
    'BaseController',
    'modules/helper',
    'models/topBar',
    'views/shared/topBar',
    'views/login/login',
    'views/signUp/signUp',
    'views/account/profile/about'
],

function (_, app, BaseController, Helper, TopBar, TopBarView, LoginContentLayout, SignUpContentLayout, ProfileContentLayout) {
    var Controller = BaseController.extend({

        //login
        login: function (fbRedirectUri, url) {
            var topBarView = this.getLoginTopBarView();

            var contentView = new LoginContentLayout({
                redirectUri: fbRedirectUri
            });

            contentView.on('loginSubmited', function (user) {
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

                }, contentView);
            });

            this.topBarLayout.show(topBarView);
            this.contentLayout.show(contentView);
        },

        getLoginTopBarView: function () {
            var topBarModel = new TopBar({
                leftText: 'Home',
                leftUrl: 'back',
                rightText: 'Sing Up',
                rightUrl: 'signup',
                title: 'Log In'
            });

            return new TopBarView({ model: topBarModel });
        },

        //signUp
        signUp: function (fbRedirectUri) {
            var topBarView = this.getSignUpTopBarView();

            var contentView = new SignUpContentLayout({
                redirectUri: fbRedirectUri
            });

            contentView.on('loginSubmited', function (user) {
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
            }, contentView);

            this.topBarLayout.show(topBarView);
            this.contentLayout.show(contentView);
        },

        getSignUpTopBarView: function () {
            var topBarModel = new TopBar({
                leftText: 'Home',
                leftUrl: 'back',
                rightText: 'Log In',
                rightUrl: 'login',
                title: 'Sign Up'
            });

            return new TopBarView({ model: topBarModel });
        },

        //profile
        profile: function () {
            var that = this;

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err) return that.errorPartial();

                if (currentUser == null) return app.router.navigate('login', { trigger: true });

                var topBarView = that.getProfileTopBarView();
                contentView = new ProfileContentLayout({ model: currentUser });

                app.topBar.show(topBarView);
                app.content.show(contentView);
            });
        },

        getProfileTopBarView: function () {
            var topBar = new TopBar({
                leftText: 'Home',
                leftUrl: 'back',
                title: 'Account'
            });

            return new TopBarView({ model: topBar });
        }
    });

    return Controller;
});