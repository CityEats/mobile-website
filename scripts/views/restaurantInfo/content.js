define(['marionette', 'underscore', 'text!templates/restaurantInfo/content.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            topMenu: "#topMenu",
            restaurantContent: '#restaurantContent'
        }
    });

    return ContentLayout;
});