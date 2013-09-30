define(['marionette', 'underscore', 'text!templates/restaurant/info/images.html'], function (Marionette, _, itemHtml) {
    var ItemView = Marionette.ItemView.extend({
        template: _.template(itemHtml),
        className: function () {
            return this.model.get('images').length > 0 ? 'mainBox img' : 'emptyMainBox';
        },
        events: {
            'click .carouselPrev': 'carouselPrevClick',
            'click .carouselNext': 'carouselNextClick',
        },

        ui: {
            carousel: '.carousel',
            carouselPrev: '.carouselPrev',
            carouselNext: '.carouselNext'
        },

        onRender: function () {
            if (this.model.get('images').length < 2) {
                this.ui.carouselPrev.hide();
                this.ui.carouselNext.hide();
            }
        },

        carouselPrevClick: function (evt) {
            evt.preventDefault();
            var item = this.ui.carousel.find('li:last');
            item.insertBefore(this.ui.carousel.find('li:first'));
        },

        carouselNextClick: function (evt) {
            evt.preventDefault();
            var item = this.ui.carousel.find('li:first');
            item.insertAfter(this.ui.carousel.find('li:last'));
        },
    });

    return ItemView;
});