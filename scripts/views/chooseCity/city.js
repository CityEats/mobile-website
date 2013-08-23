define(['marionette', 'underscore', 'text!templates/chooseCity/city.html', 'text!templates/chooseCity/current_city.html'], function (Marionette, _, cityHtml, currentCityHtml) {

    var ItemView = Marionette.ItemView.extend({
        getTemplate: function () {
            return this.model.get("isCurrent") ? _.template(currentCityHtml) : _.template(cityHtml);
        },

        events: {
            'click a.btn' : 'goToFindTable'
        },

        goToFindTable: function (evt) {
            var id = this.model.get("id")
            app.router.navigate('find-table/' + id, { trigger: true });
            evt.preventDefault();
        }
    });

    return ItemView;
});