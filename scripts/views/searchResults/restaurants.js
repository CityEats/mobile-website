define(['marionette', 'underscore', 'views/searchResults/restaurant', ], function (Marionette, _, RestaurantView) {

    var ItemView = Marionette.CollectionView.extend({
        itemView: RestaurantView
    });

    return ItemView;
});