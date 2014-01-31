define(['marionette', 'underscore', 'text!templates/searchResults/restaurant.html', 'text!templates/searchResults/restaurantSimple.html'],

function (Marionette, _, restaurantHtml, restaurantSimpleHtml) {

    var ItemView = Marionette.ItemView.extend({
        getTemplate: function () {            
            return this.options.showSimple ? _.template(restaurantSimpleHtml) : _.template(restaurantHtml);
        },
        tagName: 'article',
        className: 'resultsListItem',
        ui: {
            rateit: '.rateit',
            ddlSpecialMeals : '.ddlSpecialMeals'
        },
        events: {
            'click' : 'rootClick',
            'click .resultsListTitle a': 'goToRestaurantInfo',
            'click .btnSlot': 'gotoReservation',
            'change .ddlSpecialMeals': 'ddlSpecialMealsChanged',
            'click .resultsListItemOfferBtn': 'btnResultsListItemOfferClick'
        },

        serializeData: function () {
            var result = this.model.toJSON();
            return _.extend(result, {
                specialMealId: this.specialMealId,
                timeOffset: this.options.timeOffset,
                exclusiveEats: this.exclusiveEats
            });
        },

        initialize: function () {
            if (this.model.get('has_special_meals') && this.model.get('special_meals_slots') && this.model.get('special_meals_slots').length > 0) {
                this.specialMealId = this.model.get('special_meals_slots')[0].id;
            }

            var offers = this.model.get('offers');
            this.exclusiveEats = null;
            if (offers && offers.length > 0) {
                this.exclusiveEats = offers[0];
            }
        },

        onRender: function () {
            this.ui.rateit.rateit();
            if (this.specialMealId) this.ui.ddlSpecialMeals.val(this.specialMealId);
        },

        goToRestaurantInfo: function (evt) {
            evt.preventDefault();
            var id = this.model.get('id'), url;

            url = this.options.showSimple === true ?
                ('restaurants/' + id + '/info') :
                ('restaurants/' + id + '/party/' + this.options.party + '/date/' + this.options.date + '/time/' + this.options.time + '/info');

            app.router.navigate(url, { trigger: true });
        },

        gotoReservation: function (evt) {
            evt.preventDefault();
            var selected = this.$(evt.target).data('time');
            var id = this.model.get('id'),
                date = this.options.date,
                time = this.options.time,
                party = this.options.party;

            app.router.navigate(
                ['restaurants/', id,
                    '/party/', party,
                    '/date/', date,
                    '/time/', time,
                    '/search/complete-reservation/', selected,
                    (this.specialMealId != null ? ('/meal/' + this.specialMealId) : '')
                ].join(''), { trigger: true });
        },

        rootClick: function (evt) {
            if (this.options.showSimple === true) {
                this.goToRestaurantInfo(evt);
            }
        },

        btnResultsListItemOfferClick: function(evt){
            evt.preventDefault();            
            app.router.navigate('restaurants/' + this.model.get('id') + '/exclusive-eats/' + this.exclusiveEats.id, { trigger: true });
            return false;
        },

        ddlSpecialMealsChanged: function () {
            var specialMealId = parseInt(this.ui.ddlSpecialMeals.val(), 10);
            this.specialMealId = !isNaN(specialMealId) ? specialMealId : null;
            this.render();
        }
    });

    return ItemView;
});