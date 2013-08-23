define(['marionette', 'underscore', 'text!templates/signUp/content.html'], function (Marionette, _, signUpHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(signUpHtml)
    });

    return ItemView;
});