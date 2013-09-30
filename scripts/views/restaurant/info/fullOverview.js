define(['marionette', 'underscore', 'views/restaurant/info/review', 'text!templates/restaurant/info/reviews.html'], function (Marionette, _, ReviewView, reviewsHtml) {
    var ItemView = Marionette.CompositeView.extend({
        tagName: 'article',
        className: 'mainBox text',
        itemViewContainer: '#fullOverview',
        itemView: ReviewView,
        template: _.template(reviewsHtml),
        events: {
            'click .btnReadMore': 'btnReadMoreClick'
        },

        ui: {
            btnReadMore: '.btnReadMore',
            fullOverview: '#fullOverview'
        },

        initialize: function () {
            this.expanded = false;            
            this.fullCollection = this.collection.clone();
            this.shortCollection = this.collection.clone();
            this.shortCollection.reset([this.fullCollection.at(0)]);

            this.collection = this.shortCollection;
        },

        onRender: function () {
            if (this.fullCollection.length < 2) this.ui.btnReadMore.hide();
            this.renderReadMore();
        },

        renderReadMore: function () {
            if (this.expanded) {
                this.ui.btnReadMore.text('Read Less');
            } else {
                this.ui.btnReadMore.text('Read More');
            }
        },

        btnReadMoreClick: function (evt) {
            evt.preventDefault();
            this.expanded = !this.expanded;

            if (this.expanded)
                this.collection = this.fullCollection;
            else
                this.collection = this.shortCollection

            this.render();
        }
    });

    return ItemView;
});