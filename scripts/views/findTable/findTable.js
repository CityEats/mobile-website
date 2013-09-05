define(['marionette', 'underscore', 'text!templates/findTable/content.html'], function (Marionette, _, findTableHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(findTableHtml),

        events: {
            'click .btnLogIn': 'goToLogIn',
            'click .btnSignUp': 'goToSignUp',
            'click .btnChangeCity': 'goToChangeCity',
            'click .btnFindTable': 'goToSearchResults',
            'click .btnBrowseAll': 'goToBrowseAll'
        },
        ui: {
            time: '.time',
            partySize: '.partySize',
            date: '.date'
        },

        goToLogIn: function (evt) {
            this.goTo(evt, 'login');
        },

        goToSignUp: function (evt) {
            this.goTo(evt, 'signup');
        },

        goToChangeCity: function (evt) {
            this.goTo(evt, '');
        },

        goToSearchResults: function (evt) {            
            var cityId = this.model.get('id');
            var url = 'search-results/' + cityId + '/party/' + this.ui.partySize.val() + '/date/' + this.ui.date.text() + '/time/' + this.ui.time.val();
            this.goTo(evt, url);
        },

        goToBrowseAll: function (evt) {
            this.goTo(evt, 'browse-all');
        },

        goTo: function (evt, url) {
            app.router.navigate(url, { trigger: true });
            evt.preventDefault();
        },

        onRender: function () {
            this.rerenderTime(true);
        },

        rerenderTime: function (isToday) {
            var times = [];

            var start = new Date(2000, 1, 1, 0, 0); //12:00am
            var end = new Date(2000, 1, 1, 23, 45); //11:45pm
            var selected = new Date(2000, 1, 1, 19, 00); //7:00pm
            if (isToday) {
                selected = new Date();
                var min = selected.getMinutes();
                if (min != 0 && min != 15 && min != 30 && min != 45) {
                    if (min > 0 && min < 15) {
                        min = 15;
                    } else if (min > 15 && min < 30) {
                        min = 30;
                    } else if (min > 30 && min < 45) {
                        min = 45;
                    } else {
                        min = 60;
                    }
                    selected.setMinutes(min);
                }
            }

            while (start <= end) {
                var time = {},
                    h = start.getHours(),
                    m = start.getMinutes(),
                    am = h < 12;

                if (h == selected.getHours() && m == selected.getMinutes()) {
                    time.selected = true;
                }

                h = am ? h : (h - 12);
                if (am && h == 0) {
                    h = 12;
                }

                m = m < 10 ? '0' + m : m;

                time.text = h + ':' + m + (am ? 'a' : 'p');
                time.value = h + ':' + m + (am ? 'am' : 'pm');

                times.push(time);
                start.setMinutes(start.getMinutes() + 15);
            }

            var select = _(times).map(function (item) { return '<option value="' + item.value + '" ' + (item.selected ? 'selected' : '') + '>' + item.text + '</option>' });

            this.ui.time.empty().append(select);
        }
    });

    return ItemView;
});