define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/contactUs/contactUs'
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout) {
    return app.module('ContactUs', function (ContactUs) {
        _.extend(ContactUs, {
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: '', //TODO: "Choose City" or "Find a Table"
                rightText: 'Log In',
                rightUrl: 'login',
                title: 'Contact Us'
            }),
            ContentLayout: ContentLayout,
            TopBarView: TopBarView
        });
    });
});