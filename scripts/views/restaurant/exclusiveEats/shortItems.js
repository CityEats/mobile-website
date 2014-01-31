define(['marionette', 'underscore', 'collections/exclusiveEatsItems', 'views/restaurant/exclusiveEats/shortItem'], function (Marionette, _, ExclusiveEatsItems, ExclusiveEatsShortView) {

    var ItemView = Marionette.CollectionView.extend({
        itemView: ExclusiveEatsShortView,
        itemViewOptions: function (model, i) {
            return {
                restaurantId: this.model.get('id')
            };
        },

        initialize: function () {
            this.collection = new ExclusiveEatsItems(this.model.get('offers'));
        }
    });

    return ItemView;
});