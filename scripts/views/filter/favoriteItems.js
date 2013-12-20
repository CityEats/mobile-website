define(['app', 'marionette', 'underscore', 'views/shared/checkboxesListItem', 'text!templates/filter/cuisinesAndNeighborhoods.html'], function (app, Marionette, _, CheckboxesListItemView, neighborhoodsHtml) {

    var ItemView = Marionette.CompositeView.extend({
        template: _.template(neighborhoodsHtml),
        itemViewContainer: '.checkboxesList',
        itemView: CheckboxesListItemView,

        initialize: function () {
            var collection = this.options.isCuisines ? this.model.get('favorite_cuisine_types') : this.model.get('favorite_neighborhoods');
            var items = _(_.map(collection.split(','),
                function (item) { return item.toLowerCase().trim() }));

            if (this.options.isFavorite) {
                this.collection.each(function (item) {
                    if (items.some(function (i) { return i == item.get('value').toLowerCase(); })) {
                        item.set('checked', true);
                    } else {
                        item.set('checked', false);
                    }
                });
            }
        },

        saveItems: function () {
            app.execute(
                this.options.isCuisines ? 'SaveFilterCuisines' : 'SaveFilterNeighborhoods',
                this.options.cityId,
                this.collection.where({ 'checked': true }).map(function (item) { return item.get('key') }));
        }
    });

    return ItemView;
});