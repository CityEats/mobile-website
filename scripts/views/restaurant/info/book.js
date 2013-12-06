define(['marionette', 'underscore', 'text!templates/restaurant/info/book.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            'click .scheduleLink': 'goToCompleteReservation',
            'change .ddlSpecialMeals': 'ddlSpecialMealsChange'
        },
        ui: {
            ddlSpecialMeals: '.ddlSpecialMeals'
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

        ddlSpecialMealsChange: function () {
            var specialMealId = parseInt(this.ui.ddlSpecialMeals.val(), 10);
            this.specialMealId = !isNaN(specialMealId) ? specialMealId : null;
            this.model.set('slots', []); //todo: get slots
            this.render();
        }
    });

    return ItemView;
});