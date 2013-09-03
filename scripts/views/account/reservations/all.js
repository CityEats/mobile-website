define(['marionette', 'underscore', 'text!templates/account/reservations/all.html'], function (Marionette, _, itemHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),

        events: {
            //'click .btnEdit': 'goToEdit'
        },

        //goToEdit: function (evt) {
        //    evt.preventDefault();
        //    var url = 'profile/edit';
        //    app.router.navigate(url, { trigger: true });
        //}
    });

    return ItemView;
});