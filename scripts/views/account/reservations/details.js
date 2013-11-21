define(['marionette', 'underscore', 'modules/helper','text!templates/account/reservations/upcoming.html', 'text!templates/account/reservations/past.html', 'text!templates/account/reservations/canceled.html'],

function (Marionette, _, Helper, upcomingHtml, pastHtml, canceledHtml) {

    var ItemView = Marionette.ItemView.extend({
        getTemplate: function () {
            if (this.options.isConfirmedView) return _.template(upcomingHtml);
            if (this.model.isUpcoming()) return _.template(upcomingHtml);
            if (this.model.isPast()) return _.template(pastHtml);
            if (this.model.isCanceled()) return _.template(canceledHtml);
        },

        events: {
            'click .btnCancel': 'btnCancelClick',
            'click .btnModify': 'btnModifyClick',
            'click .btnShare': 'btnShareClick',
            'click .cbSmsReminder': 'reminderChanged',
            'click .cbEmailReminder': 'reminderChanged'
        },

        ui: {
            cbSmsReminder: '.cbSmsReminder',
            cbEmailReminder: '.cbEmailReminder',
        },

        onRender: function () {
            if (this.options.isConfirmedView || this.model.isUpcoming()) {
                this.ui.cbSmsReminder.attr('checked', this.model.get('sms_reminder'));
                this.ui.cbEmailReminder.attr('checked', this.model.get('email_reminder'));
            }
        },

        templateHelpers: {
            getDate: function () {
                //return Helper.formatDateShort2(this.isLock ? this.slotDate : this.reserved_for);
                return Helper.formatDateShort2(this.reserved_for); 
            },

            getTime: function () {
                //var time = Helper.formatTime(this.isLock ? this.slotDate : new Date(this.reserved_for));
                var time = Helper.formatTime(new Date(this.reserved_for));
                return time.textSimple + time.amTextFull;
            },

            getFullName: function () {
                if (this.user && this.user.getFullName) return this.user.getFullName();
                else return this.first_name + ' ' + this.last_name;
            },

            formatPhone: function () {
                //return this.isLock ? Helper.formatPhone(this.user.phone) : this.user.formatPhone();
                return Helper.formatPhone(this.user && this.user.phone_number ? this.user.phone_number : this.phone_number);
            },

            formatEmail: function () {                
                return this.user && this.user.email ? this.user.email : this.email;
            }
        },

        serializeData: function () {
            var result = this.model.toJSON();
            var extra = {
                isConfirmedView: this.options.isConfirmedView,
                isLock: this.options.isLock
            };
            
            if (this.options.user) extra['user'] = this.options.user.toJSON();
            if (this.options.isLock) {
                extra.restaurant_name = this.options.restaurant;
                extra.party_size = this.model.get('party');
                extra.special_request = this.model.get('additionalInfo').specialRequests;
                extra.confirmation_code = this.model.get('reservationResponse').order.confirmation_code;
                extra.points = this.options.points;
            }
            return _.extend(result, extra);
        },

        btnCancelClick: function (evt) {
            evt.preventDefault();
            if (confirm('Are you sure you want to cancel this CityEats reservation?')) {
                this.trigger('btnCancelClicked');
            }
        },

        btnModifyClick: function (evt) {            
            evt.preventDefault();
            var reservedDate, time, date, code, party, orderId;
            if (this.options.isLock) {
                reservedDate = new Date(this.model.get('slotDate'));
                party = this.model.get('party');
                code = this.model.get('reservationResponse').order.confirmation_code;
            } else {
                reservedDate = new Date(this.model.get('reserved_for'));
                party = this.model.get('party_size');
                code = this.model.get('confirmation_code');
                orderId = this.model.get('order_id');
            }

            time = Helper.formatTime(reservedDate);
            date = Helper.formatDate(reservedDate);

            this.trigger('btnModifyClicked', code, orderId, party, date, time.value);
        },

        reminderChanged: function (evt) {
            this.trigger('reminderChanged', this.ui.cbSmsReminder.is(':checked'), this.ui.cbEmailReminder.is(':checked'));
        }
    });

    return ItemView;
});