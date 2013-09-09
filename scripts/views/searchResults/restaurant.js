define(['marionette', 'underscore', 'text!templates/searchResults/restaurant.html', 'text!templates/searchResults/restaurantSimple.html'],

function (Marionette, _, restaurantHtml, restaurantSimpleHtml) {

    var ItemView = Marionette.ItemView.extend({
        getTemplate: function () {            
            return this.options.showSimple ? _.template(restaurantSimpleHtml) : _.template(restaurantHtml);
        },

        tagName: 'article',
        className: 'resultsListItem',
        events: {
            'click .resultsListTitle a': 'goToRestaurantInfo',
            'click .btnSlot': 'gotoReservation'
        },

        goToRestaurantInfo: function (evt) {
            evt.preventDefault();

            var id = this.model.get('id')
            app.router.navigate('restaurans/' + id + '/info', { trigger: true });
        },

        gotoReservation: function (evt) {
            evt.preventDefault();
            var time = this.$(evt.target).data('time');
            var id = this.model.get('id')
            app.router.navigate('restaurans/' + id + '/complete-reservation/' + time, { trigger: true });
        }
    });

    return ItemView;
});