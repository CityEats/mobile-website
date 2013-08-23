define(['marionette', 'underscore', 'text!templates/contactUs/content.html'], function (Marionette, _, forgotPasswordHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(forgotPasswordHtml)        
    });

    return ItemView;
});