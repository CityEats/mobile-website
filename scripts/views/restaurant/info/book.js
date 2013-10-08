define(['marionette', 'underscore', 'text!templates/restaurant/info/book.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            'click .scheduleLink': 'goToCompleteReservation'
        },

        goToCompleteReservation: function (evt) {
            evt.preventDefault();
            var url;
            var time = this.$(evt.target).data('time');
            if (time && time.length > 0) {
                url = 'restaurants/5/complete-reservation';
            }
            else {                
                url = this.options.infoUrl;
            }
            
            app.router.navigate(url, { trigger: true });
        }
    });

    return ItemView;
});