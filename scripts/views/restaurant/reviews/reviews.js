define(['marionette', 'underscore', 'views/restaurant/reviews/reviewItem', 'views/shared/noResults', 'text!templates/restaurant/reviews/reviews.html'], function (Marionette, _, ReviewItemView, NoResultsView, reviewHtml) {

    var ItemView = Marionette.CompositeView.extend({
        template: _.template(reviewHtml),
        itemViewContainer: '.mainBox',
        itemView: ReviewItemView,
        emptyView: NoResultsView
    });

    return ItemView;
});