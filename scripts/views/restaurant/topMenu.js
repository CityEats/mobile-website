define(['app', 'marionette', 'underscore', 'text!templates/restaurant/menu.html'], function (app, Marionette, _, menuHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(menuHtml),
        events: {
            'click .subNavLink': 'goToPage'
        },

        goToPage: function (evt) {
            evt.preventDefault();
            var url = this.$(evt.target).data('url');
            
            url = this.options.urlBase + url;
            app.router.navigate(url, { trigger: true });            
        }
    });

    return ItemView;
});