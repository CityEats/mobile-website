define(['app', 'marionette', 'underscore', 'text!templates/shared/404.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        className: 'roundedBox',
        events: {
            'click .btnHome': 'btnHomeClick'
        },

        btnHomeClick: function (evt) {
            evt.preventDefault();
            app.router.navigate('', { trigger: true });
        }
    });

    return ItemView;
});