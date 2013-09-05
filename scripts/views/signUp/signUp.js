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
            //var user = {
            //    user=User{userId=897, firstName='Oleg101', lastName='Soroka101', email='40a.oleg+101@gmail.com', phone='3102762251', postalCode='null', dietRestrict='null', birthday='null', createdAt='2013-09-04T12:46:32Z', badges=BadgesContainer{available=[], completed=[]}, avatarUrl='/assets/default_normal_avatar.gif', favorite_cuisine_types=[], favorite_neighborhoods=[], password='null', passwordConfirmation='null', emailConfirmation='null', cookie='null', userDetails=null, exceptionMsg='null', isLoggedIn=false}, error='null'
            //}
            app.execute('SignUp:save', { Z: 1 }, function (err, data) {
                debugger
                if (err == null) {
                    
                }
            });
        }
    });

    return ItemView;
});