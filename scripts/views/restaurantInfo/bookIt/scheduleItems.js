define(['app', 'marionette', 'underscore', 'views/restaurantInfo/bookIt/scheduleItem'], function (app, Marionette, _, ScheduleItemView) {

    var ItemView = Marionette.CollectionView.extend({
        tagName: 'ul',
        itemView: ScheduleItemView
    });

    return ItemView;
});