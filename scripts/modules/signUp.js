define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/signUp/signUp'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout) {
    return app.module('SignUp', function (SignUp) {
        _.extend(SignUp, {
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '', //TODO: "Choose City" or "Find a Table"
                rightText: 'Log In',
                rightUrl: 'login',
                title: 'Sign Up'
            }),
            ContentLayout: ContentLayout,
            TopBarView: TopBarView
        });
    });
});