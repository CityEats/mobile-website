﻿define(['marionette', 'underscore', 'text!templates/restaurant/info/map.html'], function (Marionette, _, itemHtml) {
    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml)
    });

    return ItemView;
});