define(['app', 'marionette', 'underscore', 'modules/helper', 'text!templates/restaurant/bookIt/complete/canceled.html'], function (app, Marionette, _, Helper, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        events: {
            'click .btnFindTable': 'btnFindTableClicked',
            'click .btnAccount': 'btnAccountClicked'
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
            }
        },

        serializeData: function () {
            var result = this.model.toJSON();
            var extra = {
                user: this.user || null
            };

            return _.extend(result, extra);
        },


        initialize: function(){
            this.user = this.options.user;
        },

        btnFindTableClicked: function (evt) {
            evt.preventDefault();
            var url = 'find-table';
            app.router.navigate(url, { trigger: true });
        },

        btnAccountClicked: function (evt) {
            evt.preventDefault();
            var url = 'profile';
            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});