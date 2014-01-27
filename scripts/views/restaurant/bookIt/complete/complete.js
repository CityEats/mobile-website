define(['marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/complete.html', 'text!templates/restaurant/bookIt/complete/completePurchase.html'], function (Marionette, _, completeHtml, completePurchaseHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        getTemplate: function () {
            return this.options.isPurchase ?
                _.template(completePurchaseHtml) :
                _.template(completeHtml);
        },
        regions: {
            restaurantInfo: '#restaurantInfo',
            userInfo: '#userInfo',
            purchaseDetails: '#purchaseDetails',
            additionalInfo: '#additionalInfo'
        },

        events: {
            'click .btnComplete': 'btnCompleteClick'
        },

        btnCompleteClick: function (evt) {
            evt.preventDefault();
            this.trigger('completeClicked');
        },
    });

    return ContentLayout;
});