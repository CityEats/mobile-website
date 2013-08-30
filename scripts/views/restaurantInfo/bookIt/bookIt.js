define(['marionette', 'underscore', 'text!templates/restaurantInfo/bookIt/bookIt.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            chooseTime: '.chooseTimeSelect',
            schedule: '.chooseTimeSchedule',
            nextDays: '#nextDays',
        }
    });

    return ContentLayout;
});