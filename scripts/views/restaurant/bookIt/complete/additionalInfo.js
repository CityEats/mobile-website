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
        },
        
        onRender: function () {
            if (this.options.reservation) {
                //edit reservation
                this.ui.txtSpecialRequests.val(this.options.reservation.get('special_request'));
                this.ui.txtPromoCode.val(this.options.reservation.get('promo_code'));
                this.ui.cbSmsReminder.attr('checked', this.options.reservation.get('sms_reminder'));
                this.ui.cbEmailReminder.attr('checked', this.options.reservation.get('email_reminder'));
            }
        }
    });

    return ItemView;
});