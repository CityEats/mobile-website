define(['app', 'marionette', 'underscore', 'text!templates/restaurantInfo/bookIt/chooseTime.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml)
    });

    return ItemView;
});