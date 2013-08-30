define(['app', 'marionette', 'underscore', 'text!templates/shared/topBar.html'], function (app, Marionette, _, topBarHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(topBarHtml),
        events: {
            'click .linkLeft': 'btnLeftClick',
            'click .linkRight': 'btnRightClick',            
        },        

        btnLeftClick: function (evt) {
            var url = this.$(evt.target).data('url')

            if (this.options.leftClickEvent) {
                this.trigger(this.options.leftClickEvent, url);
            } else {
                this.goToPage(url);
            }

            evt.preventDefault();
        },

        btnRightClick: function (evt) {
            var url = this.$(evt.target).data('url')

            if (this.options.rightClickEvent) {                
                this.trigger(this.options.rightClickEvent, url);
            } else {
                this.goToPage(url);
            }

            evt.preventDefault();
        },

        goToPage: function (url) {            
            app.router.navigate(url, { trigger: true });
        }        
    });
    
    return ItemView;
})