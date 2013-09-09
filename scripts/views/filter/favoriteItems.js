define(['app', 'marionette', 'underscore', 'views/shared/checkboxesListItem', 'text!templates/filter/cuisinesAndNeighborhoods.html'], function (app, Marionette, _, CheckboxesListItemView, neighborhoodsHtml) {

    var ItemView = Marionette.CompositeView.extend({
        template: _.template(neighborhoodsHtml),
        itemViewContainer: '.checkboxesList',
        itemView: CheckboxesListItemView,

        saveItems: function () {
            //var that = this;
            //return _.map(this.$(':checked'), function (item) {
            //    return that.$(item).attr('itemId');
            //});
            app.execute(this.options.isCuisines ? 'SaveFavCuisines' : 'SaveFavNeighborhoods', this.collection.where({ 'checked': true }).map(function (item) { return item.get('key') }));
            console.log('saveItems call');
        }
    });

    return ItemView;
});