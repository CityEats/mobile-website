define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/forgotPassword/forgotPassword'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout) {
    return app.module('ForgotPassword', function (ForgotPassword) {
        _.extend(ForgotPassword, {
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '', //TODO: "Choose City" or "Find a Table"
                rightText: 'Log In',
                rightUrl: 'login',
                title: 'Reset Password'
            }),
            ContentLayout: ContentLayout,
            TopBarView: TopBarView
        });
    });
});