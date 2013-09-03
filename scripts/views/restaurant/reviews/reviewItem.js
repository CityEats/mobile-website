define(['marionette', 'underscore', 'text!templates/restaurant/reviews/reviewItem.html'], function (Marionette, _, reviewItemHtml) {

    var ItemView = Marionette.ItemView.extend({
        tagName: 'article',
        className: 'review',
        template: _.template(reviewItemHtml)
    });

    return ItemView;
});