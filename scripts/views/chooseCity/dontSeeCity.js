define(['marionette', 'underscore', 'basicItemView', 'text!templates/chooseCity/dontSeeCity.html'], function (Marionette, _, BasicItemView, dontSeeCity) {

    var ItemView = BasicItemView.extend({
        template: _.template(dontSeeCity),
        events: {
            'click .btnSendNewCity': 'btnSendNewCityClick'
        },
        ui: {
            txtZip: '.txtZip',
            txtEmail: '.txtEmail',
            txtError: '.txtError',
        },

        btnSendNewCityClick: function (evt) {
            evt.preventDefault();            
            var email = this.ui.txtEmail.val(),
                zip = this.ui.txtZip.val();
            
            this.trigger('submitNewCity', email, zip);            
        }
    });

    return ItemView;
});