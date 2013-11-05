define(['marionette', 'underscore', 'text!templates/restaurant/reviews/reviewItem.html'], function (Marionette, _, reviewItemHtml) {

    var ItemView = Marionette.ItemView.extend({
        tagName: 'article',
        className: 'review',
        template: _.template(reviewItemHtml),
        ui: {
            btnShowMore: '.btnShowMore',
            rateit: '.rateit'
        },
        events: {
            'click .btnShowMore': 'showMoreClick'
        },

        initialize: function () {
            this.fullContent = this.model.get('madlibs');
            this.shortContent = this.model.getShortContent();
            this.model.set('madlibs', this.shortContent);
        },

        onRender: function () {
            if (this.fullContent.length < this.model.maxLength) this.ui.btnShowMore.hide();

            this.ui.rateit.rateit();
        },

        showMoreClick: function (evt) {
            evt.preventDefault();
            this.model.set('madlibs', this.fullContent);
            this.render();
            this.ui.btnShowMore.hide();
        }
    });

    return ItemView;
});