define(['marionette', 'underscore', 'views/searchResults/restaurant', ], function (Marionette, _, RestaurantView) {

    var ItemView = Marionette.CollectionView.extend({
        itemView: RestaurantView,
        itemViewOptions: function (model, i) {            
            return {
                showSimple: this.options.showSimple
            };
        }
    });

    return ItemView;
});