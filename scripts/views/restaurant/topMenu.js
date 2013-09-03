define(['app', 'marionette', 'underscore', 'text!templates/restaurant/menu.html'], function (app, Marionette, _, menuHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(menuHtml),
        events: {
            'click .subNavLink': 'goToPage'
        },

        goToPage: function (evt) {
            var url = this.$(evt.target).data('url');
            url = 'restaurans/5/' + url;
            app.router.navigate(url, { trigger: true });
            evt.preventDefault();
        }
    });

    return ItemView;
});