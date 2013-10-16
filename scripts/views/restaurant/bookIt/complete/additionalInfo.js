define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/additionalInfo.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        ui: {
            txtSpecialRequests: '.txtSpecialRequests',
            txtPromoCode: '.txtPromoCode',
            cbSmsReminder: '.cbSmsReminder',
            cbEmailReminder: '.cbEmailReminder',
        },

        getModel: function () {
            return {
                specialRequests: this.ui.txtSpecialRequests.val(),
                promoCode: this.ui.txtPromoCode.val(),
                smsReminder: this.ui.cbSmsReminder.is(':checked'),
                emailReminder: this.ui.cbEmailReminder.is(':checked')
            };
        }
    });

    return ItemView;
});