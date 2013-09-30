define(['marionette', 'underscore', 'text!templates/restaurant/info/reviewItem.html'], function (Marionette, _, itemHtml) {
    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml)
    });

    return ItemView;
});