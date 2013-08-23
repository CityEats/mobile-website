define(['app', 'marionette', 'underscore', 'text!templates/shared/topBar.html'], function (app, Marionette, _, topBarHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(topBarHtml),
        events: {
            'click .topBarLink': 'goToPage',            
        },

        goToPage: function (evt) {            
            var url = this.$(evt.target).data('url')            
            app.router.navigate(url, { trigger: true });

            evt.preventDefault();
        }
    });
    
    return ItemView;
})