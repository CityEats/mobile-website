define(['marionette', 'underscore', 'app', 'text!templates/chooseCity/city.html', 'text!templates/chooseCity/currentCity.html'], function (Marionette, _, app, cityHtml, currentCityHtml) {

    var ItemView = Marionette.ItemView.extend({
        getTemplate: function () {
            return this.model.get("isCurrent") ? _.template(currentCityHtml) : _.template(cityHtml);
        },

        events: {
            'click a.btn' : 'goToFindTable'
        },

        goToFindTable: function (evt) {
            var id = this.model.get('id')
            app.execute('SetCurrentCity', this.model);
            app.router.navigate('find-table', { trigger: true });
            evt.preventDefault();
        }
    });

    return ItemView;
});