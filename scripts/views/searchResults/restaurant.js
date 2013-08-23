define(['marionette', 'underscore', 'text!templates/searchResults/restaurant.html'], function (Marionette, _, restaurantHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(restaurantHtml),
        tagName: 'article',
        className: 'resultsListItem',
        //events: {
        //    'click a.btn': 'goToFindTable'
        //},

        //goToFindTable: function (evt) {
        //    var id = this.model.get("id")
        //    app.router.navigate('find-table/' + id, { trigger: true });
        //    evt.preventDefault();
        //}
    });

    return ItemView;
});