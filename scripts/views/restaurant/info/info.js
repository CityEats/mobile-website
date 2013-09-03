define(['marionette', 'underscore', 'text!templates/restaurant/info/info.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            imgBox: "#imgBox",
            bookBox: '#bookBox',
            exclusiveEatsOffer: '#exclusiveEatsOffer',
            mapBox : '#mapBox',
            mainBox: '#mainBox',
            highlightsBox: '#highlightsBox',
            goodToKnowBox: '#goodToKnowBox',
            dishesBox: '#dishesBox',
            margaritasBox: '#margaritasBox',
            fullOverviewBox: '#fullOverviewBox'
        }
    });

    return ContentLayout;
});