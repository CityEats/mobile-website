define(['marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/purchaseDetails.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Marionette.ItemView.extend({
        template: _.template(contentHtml),
        templateHelpers: {
            format: function (amount) {
                return '$' + (amount || 0).toFixed(2);
            }
        },
        onRender: function () {
            
        }
    });

    return ContentLayout;
});