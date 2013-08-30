define(['app', 'marionette', 'underscore', 'text!templates/shared/checkboxesListItem.html'], function (app, Marionette, _, checkboxesListItemHtml) {

    var ItemView = Marionette.ItemView.extend({
        tagName: 'li',
        className: 'checkboxesListItem',
        template: _.template(checkboxesListItemHtml),
        events: {
            'change input': 'change'
        },

        change: function (evt) {
            var checked = this.$(evt.target).is(':checked');
            this.model.set('checked', checked);
        }
    });

    return ItemView;
})