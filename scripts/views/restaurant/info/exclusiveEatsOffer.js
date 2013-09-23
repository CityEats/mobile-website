define(['marionette', 'underscore', 'text!templates/restaurant/info/exclusiveEatsOffer.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        className: 'exclusiveEatsOfferInner',
        template: _.template(itemHtml),
        events: {
            'click .exclusiveEatsOfferDetails': 'goToExclusiveEats'
        },

        goToExclusiveEats: function (evt) {
            evt.preventDefault();
            var url = 'restaurants/5/exclusive-eats';
            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});