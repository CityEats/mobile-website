define(['marionette', 'underscore', 'modules/helper', 'text!templates/searchResults/searchHeader.html'], function (Marionette, _, Helper, searchHeaderHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(searchHeaderHtml),
        events: {
            'click .searchFormClear': 'btnClearClick',
            'click .searchFormButton': 'btnSearchClick',
            'click .btnFindTable': 'btnFindTableClick',
            'click .datePicker': 'datePickerClick',
            'change .partySize, .time': 'searchParametersChanged'
        },
        ui: {
            party: '.partySize',
            dateLabel: '.datePicker',
            date: '.date',
            time: '.time',
            txtSearch: '.searchField',
            btnSearchClear: '.searchFormClear',
            searchSubmit: '.searchResultsSubmit'
        },

        onRender: function () {            
            var that = this;
            
            var showTimingBar = this.model.get('showTimingBar'),
                party = this.model.get('party'),
                date = this.model.get('date'),
                time = this.model.get('time');            
            
            if (showTimingBar === true) {
                this.rerenderTime(true);
                if (typeof party != 'undefined') {
                    this.ui.party.val(party);
                }

                if (typeof date != 'undefined') {
                    this.ui.dateLabel.text(date);
                    this.ui.date.val(date);
                }

                if (typeof time != 'undefined') {
                    this.ui.time.val(time);
                }

                var datepicker = this.ui.date,
                    dateLabel = this.ui.dateLabel;                

                //this.ui.date.datepicker({
                //    minDate: new Date(),
                //    maxDate: "+90d",
                //    dateFormat: 'yy-mm-dd',
                //    onSelect: function (dateText) {
                //        var selectedDate = datepicker.datepicker('getDate');
                //        that.setDateText(selectedDate, dateLabel);
                //        that.searchParametersChanged();
                //    }
                //});

                //this.ui.date.datepicker('setDate', date);

                that.setDateText(date, this.ui.dateLabel);
                this.searchParametersChanged(true);
            }
        },

        setDateText: function (date, label) {
            var current = new Date;

            if (current.getDate() == date.getDate() &&
                current.getMonth() == date.getMonth() &&
                current.getFullYear() == date.getFullYear()) {
                    label.text('Today');
            } else {
                current.setDate(current.getDate() + 1);
                if (current.getDate() == date.getDate() &&
                    current.getMonth() == date.getMonth() &&
                    current.getFullYear() == date.getFullYear()) {
                        label.text('Tomorrow');
                }
                else {                    
                    label.text(Helper.formatDate(date));
                }
            }
        },

        datePickerClick: function () {
            //this.ui.date.datepicker('show');
            this.trigger('datePickerClicked', this.model.get('date'));
        },

        btnClearClick: function (evt) {            
            evt.preventDefault();
            this.searchQuery = '';
            this.ui.txtSearch.val('');
            this.ui.btnSearchClear.hide();

            this.refreshResults();
        },

        btnSearchClick: function (evt) {
            evt.preventDefault();
            this.searchQuery = this.ui.txtSearch.val();
            if (this.searchQuery.length > 0) {
                this.ui.btnSearchClear.show();
            } else {
                this.ui.btnSearchClear.hide();
            }

            this.refreshResults();
        },

        btnFindTableClick: function (evt) {
            evt.preventDefault();
            this.refreshResults();
        },

        searchParametersChanged: function (onRender) {
            var party = this.options.defaults.party,
                date = this.options.defaults.date,
                time = this.options.defaults.time,
                isChanged = false;
            
            this.model.set('party', parseInt(this.ui.party.val(), 10));
            this.model.set('time', this.ui.time.val());
            if (this.options.showFindButton !== true) {
                return true;
            }
            
            if (party.toString().toLowerCase() == this.model.get('party').toString().toLowerCase()) {
                this.ui.party.removeClass('updated');
            } else {
                this.ui.party.addClass('updated');
                isChanged = true;
            }
            
            if (Helper.formatDate(date) == Helper.formatDate(this.model.get('date'))) {
                this.ui.dateLabel.removeClass('updated');
            } else {
                this.ui.dateLabel.addClass('updated');
                isChanged = true;
            }

            if (time.toLowerCase() == this.model.get('time').toLowerCase()) {
                this.ui.time.removeClass('updated');
            } else {
                this.ui.time.addClass('updated');
                isChanged = true;
            }

            if (onRender !== true || isChanged) {
                this.ui.searchSubmit.show();
            } else {
                this.ui.searchSubmit.hide();
            }            
        },

        refreshResults: function () {            
            var date = this.model.get('date'),
                dateFormated;
            if (date) {
                dateFormated = Helper.formatDate(date);
            }

            this.trigger('searchParametersChanged', {
                party: this.ui.party.val(),
                date: dateFormated,
                time: this.ui.time.val(),
                searchQuery: this.searchQuery
            });
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
                time.value = start.getHours() + ':' + m;

                times.push(time);
                start.setMinutes(start.getMinutes() + 15);
            }

            var select = _(times).map(function (item) { return '<option value="' + item.value + '" ' + (item.selected ? 'selected' : '') + '>' + item.text + '</option>' });

            this.ui.time.empty().append(select);
        }
    });

    return ItemView;
});