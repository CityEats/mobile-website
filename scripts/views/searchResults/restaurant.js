define(['marionette', 'underscore', 'text!templates/searchResults/restaurant.html', 'text!templates/searchResults/restaurantSimple.html'],

function (Marionette, _, restaurantHtml, restaurantSimpleHtml) {

    var ItemView = Marionette.ItemView.extend({
        getTemplate: function () {            
            return this.options.showSimple ? _.template(restaurantSimpleHtml) : _.template(restaurantHtml);
        },
        tagName: 'article',
        className: 'resultsListItem',
        ui: {
            rateit: '.rateit'
        },
        events: {
            'click' : 'rootClick',
            'click .resultsListTitle a': 'goToRestaurantInfo',
            'click .btnSlot': 'gotoReservation',
        },

        onRender: function () {
            this.ui.rateit.rateit();
        },

        goToRestaurantInfo: function (evt) {
            evt.preventDefault();

            var id = this.model.get('id'), url;

            if (this.options.showSimple === true) {
                url = 'restaurants/' + id + '/info';
            } else {
                url = 'restaurants/' + id + '/party/' + this.options.party + '/date/' + this.options.date + '/time/' + this.options.time + '/info';
            }

            app.router.navigate(url, { trigger: true });
        },

        gotoReservation: function (evt) {
            evt.preventDefault();
            var selected = this.$(evt.target).data('time');
            var id = this.model.get('id'),
                date = this.options.date,
                time = this.options.time,
                party = this.options.party;

            app.router.navigate('restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/search/complete-reservation/' + selected, { trigger: true });
        },

        rootClick: function (evt) {
            if (this.options.showSimple === true) {
                this.goToRestaurantInfo(evt);
            }
        },
    });

    return ItemView;
});