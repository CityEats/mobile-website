define(['app', 'marionette', 'underscore', 'views/restaurant/bookIt/nextDay', 'text!templates/restaurant/bookIt/nextDays.html'], function (app, Marionette, _, NextDayView, itemHtml) {

    var ItemView = Marionette.CompositeView.extend({
        template: _.template(itemHtml),
        itemView: NextDayView,
        itemViewEventPrefix: 'newDayView'        
    });

    return ItemView;
});