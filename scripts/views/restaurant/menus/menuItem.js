﻿define(['marionette', 'underscore', 'views/restaurant/menus/categoryItem', 'text!templates/restaurant/menus/menuItem.html'], function (Marionette, _, CategoryItemView, MenuItemHtml) {

    var ItemView = Marionette.CompositeView.extend({
        className: 'menuItem hide',
        template: _.template(MenuItemHtml),
        itemViewContainer: '.mainBox',
        itemView: CategoryItemView,
        events: {
            'click .restaurantReviewsPrev': 'btnPrevClick',
            'click .restaurantReviewsNext': 'btnNextClick'
        },

        modelEvents: {
            'show': 'showMe',
            'hide': 'hideMe'
        },

        btnNextClick: function (evt) {
            evt.preventDefault();
            this.model.trigger('showNext', this.model);
        },

        btnPrevClick: function (evt) {
            evt.preventDefault();
            this.model.trigger('showPrev', this.model);
        },

        showMe: function () {
            this.$el.show();
        },

        hideMe: function () {
            this.$el.hide();
        },

        initialize: function () {
            this.collection = this.model.getMenuCategories();
        }
    });

    return ItemView;
});