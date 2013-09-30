define(['marionette', 'underscore', 'text!templates/restaurant/info/textBlock.html'], function (Marionette, _, itemHtml) {
    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        tagName: 'article',
        className: 'mainBox text'
    });

    return ItemView;
});