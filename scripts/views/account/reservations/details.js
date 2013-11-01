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
        },

        templateHelpers: {
            getDate: function () {
                return Helper.formatDateShort2(this.isLock ? this.slotDate : this.reserved_for);
            },

            getTime: function () {
                var time = Helper.formatTime(this.isLock ? this.slotDate : new Date(this.reserved_for));
                return time.textSimple + time.amTextFull;
            },

            getFullName: function () {
                if (this.user.getFullName) return this.user.getFullName();
                if (this.isLock) return this.user.firstName + ' ' + this.user.lastName;

                return '';
            },

            formatPhone: function () {
                return this.isLock ? Helper.formatPhone(this.user.phone) : this.user.formatPhone();
            },
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
            this.trigger('btnModifyClicked');
        }
    });

    return ItemView;
});