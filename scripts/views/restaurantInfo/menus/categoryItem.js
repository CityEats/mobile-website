define(['marionette', 'underscore', 'views/restaurantInfo/menus/dishItem', 'text!templates/restaurantInfo/menus/categoryItem.html'], function (Marionette, _, DishItemView, CategoryItemHtml) {

    var ItemView = Marionette.CompositeView.extend({
        tagName: 'article',
        className: 'menu',
        template: _.template(CategoryItemHtml),
        itemViewContainer: '.menuList',
        itemView: DishItemView,
        initialize: function () {
            this.collection = this.model.get('dishes');
        }
    });

    return ItemView;
});