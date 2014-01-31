define(['marionette', 'underscore', 'views/restaurant/exclusiveEats/about', 'views/restaurant/exclusiveEats/select', 'views/restaurant/exclusiveEats/book', 'text!templates/restaurant/exclusiveEats/content.html'], function (Marionette, _, AboutView, SelectView, BookView, contentHtml) {

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

        onRender: function () {
            var bookView = new BookView({ model : this.options.model });
            var selectView = new SelectView({ model: this.options.model });
            var aboutView = new AboutView({ model: this.options.model, timeOffset: this.options.timeOffset });

            this.about.show(aboutView)
            this.select.show(selectView)
            this.book.show(bookView)
        }
    });

    return ContentLayout;
});