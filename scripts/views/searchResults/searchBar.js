define(['marionette', 'underscore', 'modules/helper', 'text!templates/searchResults/searchHeader.html'], function (Marionette, _, Helper, searchHeaderHtml) {

    var ItemView = Marionette.ItemView.extend({
        template: _.template(searchHeaderHtml),
        events: {
            'click .searchFormClear': 'btnClearClick',
            'click .searchFormButton': 'btnSearchClick',
            'click .btnFindTable': 'btnFindTableClick',
            'click .datePicker': 'datePickerClick',
            'change .partySize, .time': 'filterParametersChanged',
            'change .partySize': 'partySizeChanged',
        },
        ui: {
            party: '.partySize',
            dateLabel: '.datePicker',
            date: '.date',
            time: '.time',
            txtSearch: '.searchField',            
            searchForm: '.searchForm',
            searchSubmit: '.searchResultsSubmit',
            ddlSpecialMeals: '.ddlSpecialMeals'
        },

        onRender: function () {
            var that = this;
            var showTimingBar = this.model.get('showTimingBar'),
                showTimes = this.model.get('showTimes'),
                party = this.model.get('party'),
                date = this.model.get('date'),
                time = this.model.get('time'),
                query = this.model.get('query'),
                specialMeals = this.model.get('special_meals');

            this.ui.searchForm.addClass('empty');

            if (showTimingBar === true) {
                if (showTimes === true) this.rerenderTime(true);

                if (typeof party != 'undefined') this.ui.party.val(party);

                if (typeof date != 'undefined') {
                    this.ui.dateLabel.text(date);
                    this.ui.date.val(date);
                }

                if (typeof time != 'undefined') this.ui.time.val(time);

                if (typeof query != 'undefined') {
                    this.ui.txtSearch.val(query)                    
                    if (query.length > 0) {
                        this.ui.searchForm.removeClass('empty');
                    } else {
                        this.ui.searchForm.addClass('empty');
                    }
                }

                var datepicker = this.ui.date,
                    dateLabel = this.ui.dateLabel;                

                that.setDateText(date, this.ui.dateLabel);
                this.filterParametersChanged(true);
            }

            if (specialMeals && this.options.specialMealId) {
                this.ui.ddlSpecialMeals.val(this.options.specialMealId);
            }
        },

        setDateText: function (date, label) {
            label.text(Helper.formatDateRelative(date));
        },

        datePickerClick: function (evt) {
            evt.preventDefault();
            this.trigger('datePickerClicked', this.model.get('date'));
        },

        btnClearClick: function (evt) {            
            evt.preventDefault();
            this.ui.txtSearch.val('');
            this.ui.searchForm.addClass('empty');

            this.searchChanged();
        },

        btnSearchClick: function (evt) {
            evt.preventDefault();
            
            if (this.ui.txtSearch.val().length > 0) {
                this.ui.searchForm.removeClass('empty');
            } else {
                this.ui.searchForm.addClass('empty');
            }

            this.searchChanged();
        },

        btnFindTableClick: function (evt) {
            evt.preventDefault();
            this.filterChanged();
        },

        filterParametersChanged: function (onRender) {
            var party, date, time, isChanged = false;

            this.model.set('party', parseInt(this.ui.party.val(), 10));
            this.model.set('time', this.ui.time.val());

            if (this.options.showFindButton !== true) {
                return true;
            }

            party = this.options.defaults.party;
            date = this.options.defaults.date;
            time = this.options.defaults.time;
            
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

        partySizeChanged: function () {
            this.trigger('partySizeChanged', parseInt(this.ui.party.val(), 10));
        },

        filterChanged: function () {
            var date = this.model.get('date'),
                dateFormated;

            if (date) {
                dateFormated = Helper.formatDate(date);
            }

            this.trigger('filterParametersChanged', {
                party: this.ui.party.val(),
                date: dateFormated,
                time: this.ui.time.val()
            });
        },

        searchChanged: function () {
            this.model.set('searchQuery', this.ui.txtSearch.val());

            this.trigger('searchParametersChanged', {
                searchQuery: this.ui.txtSearch.val()
            });
        },

        rerenderTime: function (isToday) {
            var times = Helper.getTimes();
            var select = _(times).map(function (item) { return '<option value="' + item.value + '" ' + (item.selected ? 'selected' : '') + '>' + item.text + '</option>' });

            this.ui.time.empty().append(select);
        }
    });

    return ItemView;
});