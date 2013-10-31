define(['app', 'marionette', 'underscore', 'text!templates/restaurant/bookIt/scheduleItem.html'], function (app, Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'scheduleItem',
        template: _.template(itemHtml),
        events: {
            'click .scheduleLink': 'goToCompleteReservation'
        },

        goToCompleteReservation: function (evt) {
            evt.preventDefault();
            var url = this.options.completeUrl + this.model.get('key');
            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});