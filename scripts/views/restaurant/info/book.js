define(['marionette', 'underscore', 'modules/Helper', 'text!templates/restaurant/info/book.html'], function (Marionette, _, Helper, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            'click .scheduleLink': 'goToCompleteReservation',
            'change .ddlSpecialMeals': 'ddlSpecialMealsChanged'
        },
        ui: {
            ddlSpecialMeals: '.ddlSpecialMeals'
        },

        serializeData: function () {
            var result = this.model.toJSON();
            return _.extend(result, { specialMealId: this.specialMealId });
        },

        templateHelpers: {
            formatDateRelative: function () {
                return Helper.formatDateRelative(this.selectedDate);
            }
        },

        initialize: function () {
            if (this.model.get('has_special_meals')) {
                this.specialMealId = this.model.get('special_meals_slots')[0].id;
            }
        },

        onRender: function () {
            this.specialMealId = this.specialMealId || this.options.specialMealId;
            if (this.specialMealId) this.ui.ddlSpecialMeals.val(this.specialMealId);
        },

        goToCompleteReservation: function (evt) {
            evt.preventDefault();
            var time = this.$(evt.target).data('time');
            this.trigger('slotChosen', time, this.specialMealId);
        },

        ddlSpecialMealsChanged: function () {
            var specialMealId = parseInt(this.ui.ddlSpecialMeals.val(), 10);
            this.specialMealId = !isNaN(specialMealId) ? specialMealId : null;
            this.render();
        }
    });

    return ItemView;
});