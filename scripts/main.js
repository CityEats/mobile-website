require.config({
    paths: {
        backbone: 'vendors/backbone.marionette/backbone',
        underscore: 'vendors/backbone.marionette/underscore',
        jquery: 'vendors/backbone.marionette/jquery',
        marionette: 'vendors/backbone.marionette/core/amd/backbone.marionette',
        'backbone.wreqr': 'vendors/backbone.marionette/core/amd/backbone.wreqr',
        'backbone.eventbinder': 'vendors/backbone.marionette/core/amd/backbone.eventbinder',
        'backbone.babysitter': 'vendors/backbone.marionette/core/amd/backbone.babysitter',
        text: 'vendors/require/text',
        urlArgs: "bust=" + (new Date()).getTime(),
        basicItemView: 'views/shared/basicItemView',
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
});

require(
  ['jquery', 'app', 'router', 'backbone', 'rateIt'],
  function ($, app, Router, Backbone) {
      this.app = app;

      app.addInitializer(function (options) {
          app.router = new Router();
          Backbone.history.start({ pushState: true, root: options.root });
      });

      $(document).ready(function () {
          app.start({
              root: '/'
          });
      });
  }
);