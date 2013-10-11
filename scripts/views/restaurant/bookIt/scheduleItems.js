define(['app', 'marionette', 'underscore', 'views/restaurant/bookIt/scheduleItem'], function (app, Marionette, _, ScheduleItemView) {

    var ItemView = Marionette.CollectionView.extend({
        tagName: 'ul',
        itemView: ScheduleItemView,
        itemViewOptions: function (model, i) {
            return this.options;
        }
    });

    return ItemView;
});