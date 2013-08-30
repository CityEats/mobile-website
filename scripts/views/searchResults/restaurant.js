define(['marionette', 'underscore', 'text!templates/searchResults/restaurant.html'], function (Marionette, _, restaurantHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(restaurantHtml),
        tagName: 'article',
        className: 'resultsListItem',
        events: {
            'click .resultsListTitle a': 'goToRestaurantInfo'
        },

        goToRestaurantInfo: function (evt) {
            var id = this.model.get("id")
            app.router.navigate('restaurans/' + id + '/info', { trigger: true });
            evt.preventDefault();
        }
    });

    return ItemView;
});