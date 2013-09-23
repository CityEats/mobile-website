define(['marionette', 'underscore', 'text!templates/restaurant/exclusiveEats/content.html'], function (Marionette, _, contentHtml) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            about: '.aboutBox',
            select: '.exclusiveEatsSelect',
            book: '.bookBox'
        },

        events: {
            'click .btnFaq': 'goToFaq'
        },

        goToFaq: function (evt) {
            evt.preventDefault();
            var url = 'restaurants/5/exclusive-eats-faq';
            app.router.navigate(url, { trigger: true });
        },
    });

    return ContentLayout;
});