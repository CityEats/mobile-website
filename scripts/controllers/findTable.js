define([
	'underscore',
	'app',
    'modules/helper',
    'BaseController',
	'models/topBar',
    'models/searchBar',
    'views/shared/topBar',
    'views/shared/calendar',
    'views/findTable/findTable',
    'views/searchResults/searchBar'
],

function (_, app, Helper, BaseController, TopBar, SearchBar, TopBarView, CalendarView, ContentLayout, SearchBarView) {
    var Controller = BaseController.extend({
        index: function (date, newParty, newTime) {
            var that = this, cityId;
            party = 2;
            if (date == null) date = new Date;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            app.execute('GetRestaurantsByMetro', cityId); //preload restaurants;
            app.execute('GetCuisines', cityId); //preload cuisines;

            var currentCity = app.request('GetCurrentCity');
            if (currentCity == null) return app.router.navigate('', { trigger: true });

            app.execute('GetCurrentUser', function (err, currentUser) {
                var name;
                if (currentUser) name = currentUser.get('first_name') + ' ' + currentUser.get('last_name');

                var contentView = new ContentLayout({
                    model: currentCity,
                    user: name
                });

                var searchBarView = new SearchBarView({
                    model: that.getSearchModel(newParty || party, date, newTime),
                    defaults: {
                        party: 2,
                        date: date,
                        time: newTime
                    }
                });

                var calendarView = new CalendarView({ date: date });
                var calendarTopBarView = that.getCalendarTopBarView();

                that.contentLayout.show(contentView);
                contentView.search.show(searchBarView);

                searchBarView.on('datePickerClicked', function () {
                    calendarTopBarView.on('btnLeftClick', function () {
                        that.index(date, searchBarView.model.get('party'), searchBarView.model.get('time'));
                    });

                    that.topBarLayout.show(calendarTopBarView);
                    that.contentLayout.show(calendarView);

                    calendarView.on('dateSelected', function (selectedDate) {
                        searchBarView.model.set('date', selectedDate);
                        that.index(selectedDate, searchBarView.model.get('party'), searchBarView.model.get('time'));
                    });
                });

                contentView.on('findTableClicked', function () {
                    var date = searchBarView.model.get('date');
                    var partySize = searchBarView.model.get('party');
                    var time = searchBarView.model.get('time');
                    var url = 'search-results/party/' + partySize + '/date/' + Helper.formatDate(date) + '/time/' + time;
                    that.toggleLoading(true);
                    app.router.navigate(url, { trigger: true });
                }).on('logOut', function () {
                    app.execute('SignOut', function (err) {
                        if (err) return that.errorPartial();
                        that.index(date, newParty, newTime);
                    });
                });
            });

            var topBarView = this.getTopBarView();
            this.topBarLayout.show(topBarView);
        },

        getTopBarView: function () {
            var topBar = new TopBar({ title: 'Find a Table' });
            return new TopBarView({ model: topBar });
        },

        getCalendarTopBarView: function () {
            var topBar = new TopBar({
                leftText: 'Cancel',
                leftUrl: '',
                title: 'Date'
            });

            return new TopBarView({
                model: topBar,
                leftClickEvent: 'btnLeftClick'
            });
        },

        getSearchModel: function (party, date, time) {
            if (typeof date == 'string') date = Helper.parseDate(date, time);

            return new SearchBar({
                showTimingBar: true,
                showTimes: true,
                party: party,
                date: date,
                time: time
            });
        }
    });

    return Controller;
});