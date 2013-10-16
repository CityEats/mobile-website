define(['marionette', 'underscore', 'text!templates/searchResults/restaurant.html', 'text!templates/searchResults/restaurantSimple.html'],

function (Marionette, _, restaurantHtml, restaurantSimpleHtml) {

    var ItemView = Marionette.ItemView.extend({
        getTemplate: function () {            
            return this.options.showSimple ? _.template(restaurantSimpleHtml) : _.template(restaurantHtml);
        },

        tagName: 'article',
        className: 'resultsListItem',
        events: {
            'click' : 'rootClick',
            'click .resultsListTitle a': 'goToRestaurantInfo',
            'click .btnSlot': 'gotoReservation',
        },

        goToRestaurantInfo: function (evt) {
            evt.preventDefault();

            var id = this.model.get('id'),
                cityId = this.model.get('metro').id,
                url;

            if (this.options.showSimple === true) {
                url = 'restaurants/' + cityId + '/' + id + '/info';
            } else {
                url = 'restaurants/' + cityId + '/' + id + '/party/' + this.options.party + '/date/' + this.options.date + '/time/' + this.options.time + '/info';
            }

            app.router.navigate(url, { trigger: true });
        },

        gotoReservation: function (evt) {
            evt.preventDefault();
            var selected = this.$(evt.target).data('time');
            var id = this.model.get('id'),
                date = this.options.date,
                time = this.options.time,
                cityId = this.options.cityId,
                party = this.options.party;

            app.router.navigate('restaurants/' + cityId + '/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/search/complete-reservation/' + selected, { trigger: true });
        },

        rootClick: function (evt) {
            if (this.options.showSimple === true) {
                this.goToRestaurantInfo(evt);
            }
        },
    });

    return ItemView;
});