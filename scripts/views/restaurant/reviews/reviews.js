define(['marionette', 'underscore', 'views/restaurant/reviews/reviewItem', 'text!templates/restaurant/reviews/reviews.html'], function (Marionette, _, ReviewItemView, reviewHtml) {

    var ItemView = Marionette.CompositeView.extend({
        template: _.template(reviewHtml),
        itemViewContainer: '.mainBox',
        itemView: ReviewItemView,
    });

    return ItemView;
});