define([
	'jquery',
	'underscore',
	'backbone',
	'app',	
    'models/topBar',	
    'views/shared/topBar',
    'views/login/login'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout) {
    return app.module('Login', function (Login) {
        _.extend(Login, {
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '',
                rightText: 'Sing Up',
                rightUrl: 'signup',
                title: 'Log In'
            }),            
            ContentLayout: ContentLayout,            
            TopBarView: TopBarView
        });
    });
});