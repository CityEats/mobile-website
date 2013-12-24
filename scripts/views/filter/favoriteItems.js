define(['app', 'marionette', 'underscore', 'views/shared/checkboxesListItem', 'text!templates/filter/cuisinesAndNeighborhoods.html'], function (app, Marionette, _, CheckboxesListItemView, neighborhoodsHtml) {

    var ItemView = Marionette.CompositeView.extend({
        template: _.template(neighborhoodsHtml),
        itemViewContainer: '.checkboxesList',
        itemView: CheckboxesListItemView,

        initialize: function () {
            var that = this;
            if (this.options.isFavorite) {
                this.collection.each(function (item) {
                    if (that.options.items.some(function (i) { return i.get('value').toLowerCase() === item.get('value').toLowerCase() || i.get('key') === item.get('key') })) {
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