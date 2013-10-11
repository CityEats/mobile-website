define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/additionalInfo.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
    });

    return ItemView;
});