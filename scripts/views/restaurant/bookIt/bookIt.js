define(['marionette', 'underscore', 'text!templates/restaurant/bookIt/bookIt.html'], function (Marionette, _, contentHtml) {

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