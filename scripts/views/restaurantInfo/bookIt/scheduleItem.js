define(['app', 'marionette', 'underscore', 'text!templates/restaurantInfo/bookIt/scheduleItem.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'scheduleItem',
        template: _.template(itemHtml)
    });

    return ItemView;
});