define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'views/shared/topBar',
    'views/account/profile/about',
    'views/account/profile/edit',
],

function ($, _, Backbone, app, TopBar, TopBarView, ContentLayout, EditView) {
    return app.module('Profile', function (Profile) {
        _.extend(Profile, {
            topBar: new TopBar({
                leftText: 'Home',
                leftUrl: 'back',               
                title: 'Account'
            }),
            topBarEdit: new TopBar({
                leftText: 'Cancel',
                leftUrl: '',                
                title: 'Edit Profile'
            }),
            ContentLayout: ContentLayout,
            EditView: EditView,
            TopBarView: TopBarView
        });
    });
});