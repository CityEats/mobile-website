define(['marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/complete.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            restaurantInfo: '#restaurantInfo',
            userInfo: '#userInfo',
            additionalInfo: '#additionalInfo',
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