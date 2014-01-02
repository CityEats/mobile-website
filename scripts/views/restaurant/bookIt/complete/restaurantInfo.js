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

        templateHelpers: {
            getMealText: function (specialMealId) {
                var specialMeal = _.findWhere(this.special_meals, { special_meal_id: specialMealId });
                return specialMeal ? specialMeal.name : null;
            }
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