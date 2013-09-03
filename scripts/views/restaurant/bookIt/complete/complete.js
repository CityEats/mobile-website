define(['marionette', 'underscore', 'text!templates/restaurant/bookIt/complete/complete.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            //about: '.aboutBox',
            //select: '.exclusiveEatsSelect',
            //book: '.bookBox'
        },
        events: {
            'click .btnComplete': 'goToCardInfo'
        },

        goToCardInfo: function (evt) {
            evt.preventDefault();
            var url = 'restaurans/5/reservation-card-info';
            app.router.navigate(url, { trigger: true });
        },
    });

    return ContentLayout;
});