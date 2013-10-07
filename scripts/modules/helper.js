define([	
	'underscore',
	'backbone',
	'app'	
],

function (_, Backbone, app) {
    var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday ', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
     
    function getNumber(num) {
        switch (num) {
            case 1:
                return '1st';
            case 2:
                return '2nd';            
            default:
                return num + 'th';

        }
    }

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
                //return date.getFullYear()
                //    + '-' + pad(date.getMonth() + 1)
                //    + '-' + pad(date.getDate())
                //    + 'T' + pad(date.getHours())
                //    + ':' + pad(date.getMinutes())
                //    + ':' + pad(date.getSeconds())
                //    + '-' + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                //    + 'Z';
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
                    value: hours + ':' + m,
                    textSimple: h + ':' + m,
                    amText: am ? 'a' : 'p',
                    amTextFull: am ? 'am' : 'pm'
                };
            },

            formatDate: function (date) {
                if (typeof date == 'string') {
                    return date;
                }

                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            },

            formatDateLong: function (date) {
                if (typeof date == 'string') {
                    date = new Date(date);
                }
                return monthNamesShort[date.getMonth()] + ' ' + getNumber(date.getDate()) + ', ' + date.getFullYear();
            },

            formatDateShort: function (date) {
                if (typeof date == 'string') {
                    date = new Date(date);
                }
                return daysOfWeek[date.getDay()] + ' ' + monthNamesShort[date.getMonth()] + ' ' + getNumber(date.getDate());
            },
            

            equalDates: function (date1, date2) {
                if (typeof date1 == 'string') {
                    date1 = new Date(date1);
                }

                if (typeof date2 == 'string') {
                    date2 = new Date(date2);
                }

                return date1.getFullYear() == date2.getFullYear() &&
                date1.getMonth() == date2.getMonth() &&
                date1.getDate() == date2.getDate();
            },

            getErrorMessage: function (err) {
                if (err.responseText && err.responseText.length > 0) {
                    var text = JSON.parse(err.responseText);
                    return text.error;
                }
                return null;
            },

            getTimes: function (isToday) {
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
                    time.value = start.getHours() + ':' + m;

                    times.push(time);
                    start.setMinutes(start.getMinutes() + 15);
                }

                return times;
            }
        });
    });
});