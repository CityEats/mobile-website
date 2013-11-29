define(['marionette', 'underscore', 'views/searchResults/restaurantsPage', ], function (Marionette, _, restaurantsPageView) {

    var ItemView = Marionette.CollectionView.extend({
        itemView: restaurantsPageView,
        itemViewOptions: function (model, i) {
            return this.options;
        }
    });

    return ItemView;
});