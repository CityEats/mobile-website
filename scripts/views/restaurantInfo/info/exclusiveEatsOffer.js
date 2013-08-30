define(['marionette', 'underscore', 'text!templates/restaurantInfo/info/exclusiveEatsOffer.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        className: 'exclusiveEatsOfferInner',
        template: _.template(itemHtml)
    });

    return ItemView;
});