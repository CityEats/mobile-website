define(['jquery', 'marionette', 'underscore'], function ($, Marionette, _, contentHtml) {

    var ContentLayout = Marionette.ItemView.extend({
        template: _.template(''),
        onRender: function () {
            var that = this;
            this.$el.html('<iframe width="100%" height="100%" src="' + this.options.url + '" id="cardFrame"/>');

            this.$('#cardFrame').load(function () {
                var frame = window.frames['cardFrame'];
                if (frame && frame.document && frame.document.body) {
                    var body = $(frame.document.body),
                        data;

                    if (body.find('pre').length == 0) return false;

                    try {
                        data = JSON.parse(body.find('pre').text());
                        if (data.error) return that.trigger('responseError', data);
                        else if (data.order) return that.trigger('responseSuccess', data);
                        else return that.trigger('responseUnknown');
                    }
                    catch (ex) {
                        return that.trigger('responseUnknown');
                    }
                }
            });
        }
    });

    return ContentLayout;
});