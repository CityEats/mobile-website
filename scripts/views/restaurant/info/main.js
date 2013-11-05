define(['marionette', 'underscore', 'text!templates/restaurant/info/main.html'], function (Marionette, _, itemHtml) {
    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        ui: {
            rateit: '.rateit'
        },
        onRender: function () {
            this.ui.rateit.rateit();
        }
    });

    return ItemView;
});