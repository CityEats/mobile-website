define(['app', 'marionette', 'underscore', 'text!templates/restaurant/exclusiveEats/shortItem.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        className: 'exclusiveEatsOffer',
        events: {
            'click .exclusiveEatsOfferDetails' : 'btnDetailsClick'
        },

        btnDetailsClick: function (evt) {
            evt.preventDefault();
            app.router.navigate('restaurants/' + this.options.restaurantId + '/exclusive-eats/' + this.model.id, { trigger: true });
        }
    });

    return ItemView;
});