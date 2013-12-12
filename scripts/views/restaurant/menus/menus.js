define(['marionette', 'underscore', 'text!templates/restaurant/menus/menu.html', 'views/shared/noResults'], function (Marionette, _, itemHtml, NoItemsView) {
    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        className : 'mainBox'
    });

    return ItemView;
});