﻿define([
	'underscore',
	'app'
],

function (_, app) {
    var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday ', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    function getNumber(num) {
        switch (num) {
            case 1: return '1st';
            case 2: return '2nd';
            default: return num + 'th';
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
            formatDateForApi: function (date, offset) {
                var date = new Date(date);
                if (offset) {
                    date.setHours(date.getHours() - offset);
                }

                var dateString = date.getFullYear() +
                    '-' + pad(date.getMonth() + 1) +
                    '-' + pad(date.getDate());
                return offset ?
                    (dateString +
                    'T' + pad(date.getHours()) +
                    ':' + pad(date.getMinutes()) +
                    ':' + pad(date.getSeconds()) +
                    'Z')
                    : dateString;
            },

            newDate: function (dateString, offset) {
                var date = new Date(dateString);
                date.setHours(date.getUTCHours() + offset);
                return date;
            },

            formatTime: function (hours, minutes) {
                if (typeof minutes == 'undefined') {
                    if (typeof hours == 'string') {
                        var times = hours.split(':'),
                            hours = parseInt(times[0], 10),
                            minutes = parseInt(times[1], 10);
                    } else if (typeof hours == 'object') {
                        minutes = hours.getMinutes();
                        hours = hours.getHours();
                    }
                }

                var am = hours < 12;
                var h = am ? hours : (hours - 12);

                if (am && h == 0) h = 12;
                if (!am && h == 0) h = 12;

                var m = minutes < 10 ? '0' + minutes : minutes;
                return {
                    value: hours + ':' + m,
                    textSimple: h + ':' + m,
                    amText: am ? 'a' : 'p',
                    amTextFull: am ? 'am' : 'pm',
                    valueSimpleAmTextFull: h + ':' + m + (am ? 'am' : 'pm'),
                };
            },

            formatDate: function (date) {
                if (typeof date == 'string') return date;

                return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            },

            parseDate: function (date, time) {
                var dateFormat = new RegExp('([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})');
                if (typeof date == 'string') {
                    if (dateFormat.test(date)) {
                        var parsedDate = dateFormat.exec(date),
                            parsedTime = time ? time.split(':') : null;

                        if (parsedDate.length == 4) {
                            return new
                                Date(parseInt(parsedDate[1], 10),
                                parseInt(parsedDate[2], 10) - 1,
                                parseInt(parsedDate[3], 10),
                                parsedTime ? parseInt(parsedTime[0], 10) : null,
                                parsedTime ? parseInt(parsedTime[1], 10) : null);
                        } else {
                            return new Date(date + time ? (' ' + time) : '');
                        }
                    }
                } else {
                    return null;
                }
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

            formatDateShort2: function (date, offset) {
                if (typeof date == 'string') date = new Date(date);

                if (offset) date.setHours(date.getUTCHours() + offset);

                return daysOfWeek[date.getDay()].substr(0, 3) + ', ' + monthNamesShort[date.getMonth()] + ' ' + getNumber(date.getDate());
            },

            formatDateShort3: function (date) {
                if (typeof date == 'string') {
                    date = new Date(date);
                }

                return daysOfWeek[date.getDay()].substr(0, 3) + ' ' + monthNamesShort[date.getMonth()] + ', ' + getNumber(date.getDate());
            },

            getDayOfWeek: function (day, length) {
                return daysOfWeek[day].substr(0, length);
            },

            formatDateRelative: function (date, simple) {
                if (typeof date == 'string') date = new Date(date);

                var current = new Date;

                if (current.getDate() == date.getDate() &&
                    current.getMonth() == date.getMonth() &&
                    current.getFullYear() == date.getFullYear()) {
                    return 'Today';
                } else {
                    current.setDate(current.getDate() + 1);
                    if (current.getDate() == date.getDate() &&
                        current.getMonth() == date.getMonth() &&
                        current.getFullYear() == date.getFullYear()) {
                        return 'Tomorrow';
                    }
                    else {
                        return simple ? this.formatDateShort3(date) : this.formatDate(date);
                    }
                }
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
                    if (text.error) return typeof text.error == 'string' ? text.error : text.error[0]; //if error is an array;
                    else return null;
                }
                return null;
            },

            getTimes: function (selectedDate, offset, startTime, endTime) {
                var times = [],
                    isToday,
                    now = new Date;

                if (startTime == null) {
                    startTime = new Date;
                    startTime.setHours(0);
                    startTime.setMinutes(0);
                }

                if (endTime == null) {
                    //12:00am;
                    endTime = new Date;
                    endTime.setHours(23);
                    endTime.setMinutes(45);
                }

                isToday = selectedDate.getDate() == now.getDate() &&
                    selectedDate.getMonth() == now.getMonth() &&
                    selectedDate.getFullYear() == now.getFullYear();

                //7:00pm
                var selected = new Date;
                selected.setHours(19);
                selected.setMinutes(0);

                if (isToday) {

                    selected = this.newDate(new Date, offset);
                    var min = selected.getMinutes();
                    if (min != 0 && min != 15 && min != 30 && min != 45) {
                        if (min > 0 && min < 15) min = 15;
                        else if (min > 15 && min < 30) min = 30;
                        else if (min > 30 && min < 45) min = 45;
                        else min = 60;

                        selected.setMinutes(min);
                    }

                    startTime = new Date(selected);
                }

                while (startTime <= endTime) {
                    var time = {},
                        h = startTime.getHours(),
                        m = startTime.getMinutes(),
                        am = h < 12;

                    if (h == selected.getHours() && m == selected.getMinutes()) time.selected = true;

                    h = am ? h : (h - 12);

                    if (am && h == 0) h = 12;
                    if (!am && h == 0) h = 12;

                    m = m < 10 ? '0' + m : m;

                    time.text = h + ':' + m + (am ? 'a' : 'p');
                    time.value = startTime.getHours() + ':' + m;

                    times.push(time);
                    startTime.setMinutes(startTime.getMinutes() + 15);
                }

                return times;
            },

            formatPhone: function (phone_number) {
                if (phone_number.length > 5) {
                    return [
                        '(',
                        phone_number.substr(0, 3),
                        ') ',
                        phone_number.substr(3, 3),
                        '-',
                        phone_number.substr(6)
                    ].join('');
                } else {
                    return phone_number;
                }
            },

            stringSearch: function (search, data) {
                var rExps = [
                    { re: /[\xC0-\xC6]/g, ch: "A" },
                    { re: /[\xE0-\xE6]/g, ch: "a" },
                    { re: /[\xC8-\xCB]/g, ch: "E" },
                    { re: /[\xE8-\xEB]/g, ch: "e" },
                    { re: /[\xCC-\xCF]/g, ch: "I" },
                    { re: /[\xEC-\xEF]/g, ch: "i" },
                    { re: /[\xD2-\xD6]/g, ch: "O" },
                    { re: /[\xF2-\xF6]/g, ch: "o" },
                    { re: /[\xD9-\xDC]/g, ch: "U" },
                    { re: /[\xF9-\xFC]/g, ch: "u" },
                    { re: /[\xC7-\xE7]/g, ch: "c" },
                    { re: /[\xD1]/g, ch: "N" },
                    { re: /[\xF1]/g, ch: "n" }
                ];

                $.each(rExps, function () {
                    data = data.replace(this.re, this.ch);
                    search = search.replace(this.re, this.ch);
                });

                return data.toUpperCase()
                    .indexOf(search.toUpperCase()) >= 0;
            }
        });
    });
});