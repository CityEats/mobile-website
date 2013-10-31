define(['marionette', 'underscore', 'modules/helper','text!templates/account/reservations/upcoming.html', 'text!templates/account/reservations/past.html', 'text!templates/account/reservations/canceled.html'],

function (Marionette, _, Helper, upcomingHtml, pastHtml, canceledHtml) {

    var ItemView = Marionette.ItemView.extend({
        getTemplate: function () {
            console.log(this.model);
            if (this.model.isUpcoming()) return _.template(upcomingHtml);
            else if (this.model.isPast()) return _.template(pastHtml);
            else if (this.model.isCanceled()) return _.template(canceledHtml);
        },

        events: {
            'click .btnCancel': 'btnCancelClick',
            'click .btnModify': 'btnModifyClick',
            'click .btnShare': 'btnShareClick',
        },

        templateHelpers: {
            getDate: function () {
                return Helper.formatDateShort2(this.reserved_for);
            },
            getTime: function () {
                var time = Helper.formatTime(new Date(this.reserved_for));
                return time.textSimple + time.amTextFull;
            },
        },

        serializeData: function () {
            var result = this.model.toJSON();
            return _.extend(result, { user: this.options.user.toJSON() });
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