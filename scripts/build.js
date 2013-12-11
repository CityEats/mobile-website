({
    baseUrl: ".",
    paths: {
        backbone: 'vendors/backbone.marionette/backbone',
        underscore: 'vendors/backbone.marionette/underscore',
        jquery: 'vendors/backbone.marionette/jquery',
        marionette: 'vendors/backbone.marionette/core/amd/backbone.marionette',
        'backbone.wreqr': 'vendors/backbone.marionette/core/amd/backbone.wreqr',
        'backbone.eventbinder': 'vendors/backbone.marionette/core/amd/backbone.eventbinder',
        'backbone.babysitter': 'vendors/backbone.marionette/core/amd/backbone.babysitter',
        text: 'vendors/require/text',
        basicItemView: 'views/shared/basicItemView',
        BaseController: 'controllers/shared/baseController',
        rateIt: 'vendors/plugins/rateit/jquery.rateit.min'
    },
    shim: {
        jquery: {
            exports: 'jQuery'
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        rateIt: {
            deps: ['jquery'],
            exports: 'rateIt'
        }
    },
    //optimize: "none",
    name: "main",
    out: "main-built.js"
})