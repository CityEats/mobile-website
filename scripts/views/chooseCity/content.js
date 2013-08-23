define(['marionette', 'underscore', 'text!templates/chooseCity/content.html'], function (Marionette, _, contentHtml) {    

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            locationsButtons: ".locationsButtons",
            findYourCity: '.findYourCity',
            currentCity: '#currentCity'
        },

        onRender: function () {
            if (this.options.hasCurrentCity) {
                this.$el.find('#lbChooseCity').remove();
            }
        }
    });

    return ContentLayout;
});