define([
	'underscore',
	'app',
    'modules/helper',
    'BaseController',
	'models/topBar',
    'models/filter',
    'models/keyValue',
    'collections/dictionary',
    'views/shared/topBar',
    'views/filter/filter',
    'views/filter/favoriteItems'
],

function (_, app, Helper, BaseController, TopBar, FilterItem, KeyValue, Dictionary, TopBarView, ContentLayout, FavoriteItemsView) {
    var Controller = BaseController.extend({
        index: function (isRestaurants, party, date, time) {
            var that = this, cityId;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified            

            var backUrl = isRestaurants ?
                'restaurants' :
                'search-results/party/' + party + '/date/' + date + '/time/' + time;

            var topBarView = this.getTopBarView({ leftUrl: backUrl });

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err) return that.errorPartial();

                var contentView = new ContentLayout({
                    model: filter,
                    isLocation: app.request('GetLocation') != null,
                    isRestaurants: isRestaurants,
                    searchSettings: {
                        party: party,
                        date: date,
                        time: time
                    }
                });

                that.contentLayout.show(contentView);
                that.topBarLayout.show(topBarView);

                contentView.on('filterChanged', function (isDefault) {
                    if (isDefault) this.hideRightButton();
                    else this.showRightButton();
                }, topBarView);

                topBarView.on('btnRightClick', function () {
                    app.execute('ResetFilter', cityId);
                    this.resetFilter();
                }, contentView);

                if (filter.isDefault()) topBarView.hideRightButton();
                else topBarView.showRightButton();
            });
        },

        cuisines: function (isRestaurants, party, date, time) {
            this.basicCorNAction(true, isRestaurants, party, date, time);
        },

        neighborhoods: function (isRestaurants, party, date, time) {
            this.basicCorNAction(false, isRestaurants, party, date, time);
        },

        basicCorNAction: function(isCuisines, isRestaurants, party, date, time){
            var that = this, cityId;

            if (!(cityId = this.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            var backUrl = isRestaurants ?
                'restaurants/filter' :
                'search-results/party/' + party + '/date/' + date + '/time/' + time + '/filter';

            var topBarView = this.getTopBarCorNView({
                leftUrl: backUrl,
                rightUrl: backUrl,
                tutle: isCuisines ? 'Cuisines' : 'Neighborhoods'
            });

            app.execute('GetFilter', cityId, function (err, filter) {
                if (err) return that.errorPartial();

                var contentView = new FavoriteItemsView({
                    collection: filter.get(isCuisines ? 'cuisines' : 'neighborhoods'),
                    cityId: cityId,
                    isCuisines: isCuisines,
                    isRestaurants: isRestaurants
                });

                topBarView.on('btnRightClick', function (url) {
                    this.saveItems();
                    app.router.navigate(url, { trigger: true });
                }, contentView);

                that.contentLayout.show(contentView);
                that.topBarLayout.show(topBarView);
            });
        },

        getTopBarView: function (options) {
            var topBar = new TopBar(_.extend({
                leftText: 'Cancel',
                rightText: 'Reset',
                rightCss: 'hide red',
                rightUrl: '',
                title: 'Filter'
            }, options));

            return new TopBarView({
                model: topBar,
                rightClickEvent: 'btnRightClick'
            });
        },

        getTopBarCorNView: function (options) {
            var topBar = new TopBar(_.extend({
                leftText: 'Cancel',
                rightText: 'Done',
                rightCss: 'blue',
            }, options));

            return new TopBarView({
                model: topBar,
                rightClickEvent: 'btnRightClick'
            });
        },
    });

    return Controller;
});