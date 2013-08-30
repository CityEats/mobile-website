define(['marionette', 'underscore', 'views/restaurantInfo/reviews/reviewItem', 'text!templates/restaurantInfo/reviews/reviews.html'], function (Marionette, _, ReviewItemView, reviewHtml) {

    var ItemView = Marionette.CompositeView.extend({
        template: _.template(reviewHtml),
        itemViewContainer: '.mainBox',
        itemView: ReviewItemView,
    });

    return ItemView;
});