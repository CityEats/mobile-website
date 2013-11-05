﻿define(['marionette', 'underscore', 'views/restaurant/menus/menuItem', 'views/shared/noResults'], function (Marionette, _, MenuItemView, NoItemsView) {

    var ItemView = Marionette.CollectionView.extend({        
        itemView: MenuItemView,
        emptyView: NoItemsView,
        collectionEvents: {
            'showPrev': 'showPrev',
            'showNext': 'showNext'
        },

        showPrev: function (model) {            
            var target = (this.collection.at(this.collection.indexOf(model) - 1));
            if (!target) {
                target = (this.collection.at(this.collection.size() - 1));                
            }

            if (target) {
                model.trigger('hide');
                target.trigger('show');
            }
        },

        showNext: function (model) {
            var target = (this.collection.at(this.collection.indexOf(model) + 1));
            if (!target) {
                target = (this.collection.at(0));
            }

            if (target) {
                model.trigger('hide');
                target.trigger('show');
            }
        },

        onRender: function () {
            var target = this.collection.at(0);
            if (target) {
                target.trigger('show');
            }
        }
    });

    return ItemView;
});