define([	
	'underscore',
	'backbone',
	'app'	
],

function (_, Backbone, app) {
    return app.module('Helper', function (Helper) {

        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        };

        _.extend(Helper, {
            formatDateForApi: function (date) {
                return date.getUTCFullYear()
                    + '-' + pad(date.getUTCMonth() + 1)
                    + '-' + pad(date.getUTCDate())
                    + 'T' + pad(date.getUTCHours())
                    + ':' + pad(date.getUTCMinutes())
                    + ':' + pad(date.getUTCSeconds())
                    + '-' + String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                    + 'Z';
            },

            ratingClass: function (rating) {
                switch (rating) {
                    case 2:
                        return 'two';
                    case 3:
                        return 'three';
                    case 4:
                        return 'four';
                    case 5:
                        return 'five';
                    case 1:
                        return 'one';
                    default:
                        return '';
                }
            },

            formatTime: function (hours, minutes) {
                var am = hours < 12;
                var h = am ? hours : (hours - 12);
                if (am && h == 0) {
                    h = 12;
                }

                var m = minutes < 10 ? '0' + minutes : minutes;
                return {
                    value: hours + ':' + minutes,
                    textSimple: h + ':' + m,
                    amText: h + ':' + m + (am ? 'a' : 'p'),
                    amTextFull: h + ':' + m + (am ? 'am' : 'pm')
                };
            },

            getErrorMessage: function (err) {
                if (err.responseText && err.responseText.length > 0) {
                    var text = JSON.parse(err.responseText);
                    return text.error;
                }
                return null;
            },
        });
    });
});