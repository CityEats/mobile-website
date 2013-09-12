define(['app', 'marionette', 'underscore', 'text!templates/signUp/content.html'], function (app, Marionette, _, signUpHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(signUpHtml),
        events: {
            'click .btnSubmit': 'btnSubmitClick'
        },
        ui: {
            txtFirstName: '.txtFirstName',
            txtLastName: '.txtLastName',
            txtEmail: '.txtEmail',
            txtPassword: '.txtPassword',
            txtPassword2: '.txtPassword2',
            txtZip: '.txtZip',
            txtPhone: '.txtPhone',
        },

        btnSubmitClick: function () {
            var user = {
                'first_name': 'Alexey',
                'last_name': 'Grachov',
                'email': 'grachov.alexey@gmail.com',
                'password': 'secret',
                'password_confirmation': 'secret',
                'postal_code': '03110',
                'phone_number': '',
                'birthday': ''
            };

            var user = {
                user: {
                    "first_name": "Alexey",
                    "last_name": "Grachov",
                    "email": "grachov.alexey@gmail.com",
                    "password": "secret",
                    "password_confirmation": "secret",
                    "postal_code": "03110",
                    "phone_number": "",
                    "birthday": ""
                }
            };

            app.execute('API:SignUp', user, function (err, data) {
                debugger
                if (err == null) {
                    
                }
            });
        }
    });

    return ItemView;
});