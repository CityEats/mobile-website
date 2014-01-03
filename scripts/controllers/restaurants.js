define([
	'underscore',
	'app',
    'modules/helper',
    'BaseController',
	'models/restaurant',
    'models/topBar',
    'models/searchBar',
    'views/shared/topBar',
	'collections/restaurants',
    'collections/dictionary',
    'views/searchResults/searchResults',
    'views/searchResults/searchBar',
    'views/searchResults/restaurantsPages',
    'views/shared/calendar',
    'views/searchResults/restaurant',
    'views/searchResults/restaurants',
],

function (_, app, Helper, BaseController, Restaurant, TopBar, SearchBar, TopBarView, Restaurants, Dictionary, RestaurantsContentLayout, SearchBarView, RestaurantsPagesView, CalendarView, RestaurantView, RestaurantsView) {
    var Controller = BaseController.extend({
        //restaurants
        index: function () {
            var that = this, filter, cityId, contentView,
                currentCity = app.request('GetCurrentCity');

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            filter = app.request('GetFilterSimple', cityId);

            var searchBarView = new SearchBarView({
                model: new SearchBar({ showSearchBar: true }),
                showFindButton: true
            });

            var topBarView = this.getResraurantsTopBarView(currentCity, filter);
            app.execute('GetEditorsPicksByMetro', cityId, function (err, editorsPicks) {
                if (err) return that.errorPartial();

                var getRestaurantsHandler = function (err, restaurants) {
                    if (err) return that.errorPartial();

                    if (contentView == null) {
                        contentView = new RestaurantsContentLayout;
                        that.contentLayout.show(contentView);
                        contentView.searchBar.show(searchBarView);
                    }

                    var restaurantsPagesView = new RestaurantsPagesView({
                        collection: that.getRestaurantSet(editorsPicks, restaurants),
                        isBrowseAll: true,
                        showSimple: true
                    });
                    contentView.resultsHolder.show(restaurantsPagesView);
                    that.topBarLayout.show(topBarView);
                };

                searchBarView.on('searchParametersChanged', function (data) {
                    app.execute('GetRestaurantsByMetro', cityId, filter, data.searchQuery, getRestaurantsHandler);
                });

                app.execute('GetRestaurantsByMetro', cityId, filter, null, getRestaurantsHandler);
            });
        },

        getResraurantsTopBarView: function (currentCity, filter) {
            var topBar = new TopBar({
                leftText: 'Home',
                leftUrl: '/find-table',
                rightText: 'Filter',
                rightUrl: 'restaurants/filter',
                subTitle: 'Search for a restaurant in:',
                title: currentCity.get('display_name'),
                rightCss: (filter && !filter.isDefault()) ? 'red' : ''
            });

            return new TopBarView({ model: topBar });
        },

        getRestaurantSet: function (editorsPicks, restaurants) {
            if (editorsPicks.length < 3 || restaurants.length == 0) return new Dictionary([{ key: null, value: restaurants }]);

            var result = _.map(_.range(Math.ceil(restaurants.length / 11)), function (item, index) {
                var start = index * 11;
                return {
                    key: new Restaurants(editorsPicks.shuffle().slice(0, 3)),
                    value: new Restaurants(restaurants.toArray().slice(start, start + 11))
                };
            });

            return new Dictionary(result);
        },

        //search result
        search: function (party, date, time, newParty, newDate, newTime, searchQuery) {
            var currentCity = app.request('GetCurrentCity');
            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            var that = this,
                filter = app.request('GetFilterSimple', cityId),
                rendered = false;

            var start = Helper.parseDate(date, time);
            var end = new Date(start);

            start.setMinutes(start.getMinutes() - 15);
            end.setMinutes(end.getMinutes() + 15);

            var topBarView = this.getSearchTopBarView({
                rightUrl: 'search-results/party/' + party + '/date/' + encodeURIComponent(date) + '/time/' + time + '/filter',
                title: currentCity.get('display_name'),
                rightCss: (filter && !filter.isDefault()) ? 'red' : ''
            });

            searchBar = new SearchBarView({
                model: that.getSearchModel(newParty || party, newDate || date, newTime || time, searchQuery),
                defaults: {
                    party: party,
                    date: date,
                    time: time
                },
                showFindButton: true
            });

            var contentView = new RestaurantsContentLayout;
            var calendarView = new CalendarView({ date: newDate || date });
            var calendarTopBarView = this.getCalendarTopBarView();

            searchBar
                .on('datePickerClicked', function () {
                    that.topBarLayout.show(calendarTopBarView);
                    that.contentLayout.show(calendarView);

                    calendarTopBarView.on('btnLeftClick', function () {
                        that.search(party, date, time, searchBar.model.get('party'), newDate, searchBar.model.get('time'), searchBar.model.get('searchQuery'));
                    });

                    calendarView.on('dateSelected', function (selectedDate) {
                        that.search(party, date, time, searchBar.model.get('party'), Helper.formatDate(selectedDate), searchBar.model.get('time'), searchBar.model.get('searchQuery'));
                    });
                })
                .on('timeExpired', function () { return app.router.navigate('find-table', { trigger: true }); });

            var getRestaurantsHandler = function (err, data) {
                if (err) return that.errorPartial();
                that.toggleLoading(false);

                var restaurantsPagesView = new RestaurantsPagesView({
                    collection: that.getRestaurantSet([], data),
                    party: searchBar.model.get('party'),
                    date: newDate || date,
                    time: searchBar.model.get('time'),
                    cityId: cityId
                });

                if (!rendered) {
                    that.contentLayout.show(contentView);
                    contentView.searchBar.show(searchBar);
                    that.topBarLayout.show(topBarView);
                    rendered = true;
                }

                if (contentView.resultsHolder) contentView.resultsHolder.show(restaurantsPagesView); //for uniformity of another action (browse all)
            };

            searchBar.on('filterParametersChanged', function (data) {
                //apply party size, date and time filter (ie redirect with new query string)
                app.router.navigate('search-results/party/' + data.party + '/date/' + data.date + '/time/' + data.time, { trigger: true });
            });

            searchBar.on('searchParametersChanged', function (data) {
                //apply search filter
                app.execute('GetRestaurants', cityId, start, end, party, time, data.searchQuery, filter, getRestaurantsHandler);
            });

            app.execute('GetRestaurants', cityId, start, end, party, time, searchQuery, filter, getRestaurantsHandler);
        },

        getSearchTopBarView: function (options) {
            var topBar = new TopBar(_.extend({
                leftText: 'Home',
                leftUrl: 'find-table',
                rightText: 'Filter',
                subTitle: 'Search for a restaurant in:'
            }, options));

            return new TopBarView({ model: topBar });
        },

        getCalendarTopBarView: function () {
            var topBar = new TopBar({
                leftText: 'Cancel',
                leftUrl: '',
                title: 'Date'
            });

            return new TopBarView({ model: topBar, leftClickEvent: 'btnLeftClick' });
        },

        getSearchModel: function (party, date, time, query) {
            if (typeof date == 'string') date = Helper.parseDate(date, time);

            return new SearchBar({
                showTimingBar: true,
                showSearchBar: true,
                showTimes: true,
                party: party,
                date: date,
                time: time,
                query: query
            });
        },
    });

    return Controller;
});