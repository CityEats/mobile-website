define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/restaurantInfo.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        events: {
            'click .btnEdit': 'btnEditClick'
        },

        btnEditClick: function (evt) {
            evt.preventDefault();            
            app.router.navigate(this.options.bookItUrl, { trigger: true });
        }
    });

    return ItemView;
});