define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/restaurantInfo.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        events: {
            'click .btnEdit': 'btnEditClick'
        },

        serializeData: function () {
            var result = this.model.toJSON();
            return _.extend(result, { specialMealId: this.specialMealId });
        },

        initialize: function () {
            if (this.options.specialMealId) {
                this.specialMealId = parseInt(this.options.specialMealId, 10);
            }
        },

        btnEditClick: function (evt) {
            evt.preventDefault();            
            app.router.navigate(this.options.bookItUrl, { trigger: true });
        }
    });

    return ItemView;
});