﻿define(['marionette', 'underscore', 'modules/helper','text!templates/account/reservations/upcoming.html', 'text!templates/account/reservations/past.html', 'text!templates/account/reservations/canceled.html'],

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
            'click .cbEmailReminder': 'reminderChanged',
            'click a.reservationData': 'reservationDataClicked'
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
                return Helper.formatDateShort2(this.reserved_for, this.current_time_offset);
            },

            getTime: function () {
                var time = Helper.formatTime(Helper.newDate(this.reserved_for, this.current_time_offset));
                return time.textSimple + time.amTextFull;
            },

            getFullName: function () {
                return this.first_name + ' ' + this.last_name;
            },

            formatPhone: function () {
                return Helper.formatPhone(this.phone_number);
            },

            formatEmail: function () {                
                return this.email;
            }
        },

        serializeData: function () {
            var result = this.model.toJSON();
            var extra = {
                isConfirmedView: this.options.isConfirmedView,
                points: this.options.points
            };

            return _.extend(result, extra);
        },

        btnCancelClick: function (evt) {
            evt.preventDefault();
            var that = this,
                confirmMessage = "Are you sure you want to cancel this CityEats reservation?",
                sorryMessage = "We're sorry, but the restaurant does not allow online cancellations this close to the reservation time. Please call them at " + Helper.formatPhone(this.options.phoneNumber) + ". Thank you.";

            var processCancel = function () {
                if (confirm(confirmMessage)) that.trigger('btnCancelClicked');
            };

            if (this.options.minTimeToCancel) {
                var reservedFor = new Date(this.model.get('reserved_for'));
                reservedFor.setMinutes(reservedFor.getMinutes() - this.options.minTimeToCancel);
                if (reservedFor < new Date) {
                    alert(sorryMessage);
                } else {
                    processCancel();
                }
            } else {
                processCancel();
            }
        },

        btnModifyClick: function (evt) {
            evt.preventDefault();
            var reservedDate, time, date, code, party, orderId;

            reservedDate = new Date(this.model.get('reserved_for'));
            party = this.model.get('party_size');
            code = this.model.get('confirmation_code');
            orderId = this.model.get('order_id');

            time = Helper.formatTime(reservedDate);
            date = Helper.formatDate(reservedDate);

            this.trigger('btnModifyClicked', code, orderId, party, date, time.value);
        },

        reminderChanged: function (evt) {
            this.trigger('reminderChanged', this.ui.cbSmsReminder.is(':checked'), this.ui.cbEmailReminder.is(':checked'));
        },

        reservationDataClicked: function (evt) {
            evt.preventDefault();
            var backUrl = Backbone.history.fragment; //curent url
            app.router.navigate('restaurants/' + this.model.get('restaurant_id') + '/info?' + encodeURIComponent(backUrl), { trigger: true });
        }
    });

    return ItemView;
});