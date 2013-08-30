define(['marionette', 'underscore', 'text!templates/restaurantInfo/info/main.html'], function (Marionette, _, itemHtml) {
    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml)
    });

    return ItemView;
});