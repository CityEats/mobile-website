define(['marionette', 'underscore', 'modules/helper', 'text!templates/restaurant/info/main.html'], function (Marionette, _, Helper, itemHtml) {
    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        ui: {
            rateit: '.rateit'
        },
        templateHelpers: {
            getOpenHours: function () {
                var result = [],
                    groups = _.groupBy(this.restaurant_open_hours, 'day_of_week'),
                    lastDay = null;

                for (var dayOfWeek in groups) {
                    if (groups.hasOwnProperty(dayOfWeek))
                        //compare start times and end times
                        if (lastDay && lastDay.items.length == groups[dayOfWeek].length &&
                        _.pluck(lastDay.items, 'end_time').join(';') == _.pluck(groups[dayOfWeek], 'end_time').join(';') &&
                        _.pluck(lastDay.items, 'start_time').join(';') == _.pluck(groups[dayOfWeek], 'start_time').join(';')) {
                            lastDay.days_of_week.push(groups[dayOfWeek][0].day_of_week);
                        } else {                            
                            lastDay = {
                                days_of_week: [groups[dayOfWeek][0].day_of_week],
                                items: groups[dayOfWeek]
                            }
                            result.push(lastDay);
                        }
                }

                return _.map(result, function (item) {
                    return {
                        days: Helper.getDayOfWeek(item.days_of_week[0], 3) + (item.days_of_week.length > 1 ? ('-' + Helper.getDayOfWeek(_.max(item.days_of_week), 3)) : ''),
                        hours: _.map(item.items, function (h) { return Helper.formatTime(h.start_time).valueSimpleAmTextFull + ' - ' + Helper.formatTime(h.end_time).valueSimpleAmTextFull })
                    };
                });
            }
        },
        onRender: function () {
            this.ui.rateit.rateit();
        }
    });

    return ItemView;
});