define(['app', 'marionette', 'underscore', 'text!templates/shared/topBar.html'], function (app, Marionette, _, topBarHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(topBarHtml),
        events: {
            'click .linkLeft': 'btnLeftClick',
            'click .linkRight': 'btnRightClick',            
        },
        ui: {
            linkRight: '.linkRight'
        },

        btnLeftClick: function (evt) {
            var url = this.model.get('leftUrl');

            if (this.options.leftClickEvent) {
                this.trigger(this.options.leftClickEvent, url);
            } else {
                this.goToPage(url);
            }

            evt.preventDefault();
        },

        btnRightClick: function (evt) {            
            var url = this.model.get('rightUrl');

            if (this.options.rightClickEvent) {                
                this.trigger(this.options.rightClickEvent, url);
            } else {
                this.goToPage(url);
            }

            evt.preventDefault();
        },

        goToPage: function (url) {            
            app.router.navigate(url, { trigger: true });
        },

        hideRightButton: function () {
            this.ui.linkRight.hide();
        },

        showRightButton: function () {
            this.ui.linkRight.show();
        },
    });
    
    return ItemView;
})