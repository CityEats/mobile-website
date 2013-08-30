define(['marionette', 'underscore', 'text!templates/restaurantInfo/menus/dishItem.html'], function (Marionette, _, dishItemHtml) {
    var ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'menuListItem',
        template: _.template(dishItemHtml)
    });

    return ItemView;
});

