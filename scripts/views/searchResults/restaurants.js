define(['marionette', 'underscore', 'views/searchResults/restaurant', 'views/shared/noResults'], function (Marionette, _, RestaurantView, NoResultsView) {

    var ItemView = Marionette.CollectionView.extend({
        itemView: RestaurantView,
        emptyView: NoResultsView,
        itemViewOptions: function (model, i) {            
            return this.options;
        }
    });

    return ItemView;
});