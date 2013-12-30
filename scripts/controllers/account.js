define([
	'underscore',
	'app',
    'BaseController',
    'modules/helper',
    'models/topBar',
    'models/keyValue',
    'collections/dictionary',
    'views/shared/topBar',
    'views/login/login',
    'views/signUp/signUp',
    'views/account/profile/about',
    'views/account/profile/edit',
    'views/filter/favoriteItems'
],

function (_, app, BaseController, Helper, TopBar, KeyValue, Dictionary, TopBarView, LoginContentLayout, SignUpContentLayout, ProfileContentLayout, ProfileEditContentLayout, FavoriteItemsContentLayout) {
    var Controller = BaseController.extend({

        //login
        login: function (fbRedirectUri, url) {
            var topBarView = getLoginTopBarView();

            var contentView = new LoginContentLayout({
                redirectUri: fbRedirectUri
            });

            contentView.on('loginSubmited', function (user) {
                var view = this;
                app.execute('SignIn', user, function (err, data) {
                    if (err == null) {
                        if (url) {
                            app.router.navigate(url, { trigger: true });
                        } else {
                            app.router.navigate('back', { trigger: true });
                        }
                    } else {
                        var error = Helper.getErrorMessage(err);
                        if (error) {
                            view.showError(error, null, 'main');
                        } else {
                            that.errorPartial();
                        }
                    }

                }, contentView);
            });

            this.topBarLayout.show(topBarView);
            this.contentLayout.show(contentView);
        },

        //signUp
        signUp: function (fbRedirectUri) {
            var topBarView = getSignUpTopBarView();

            var contentView = new SignUpContentLayout({
                redirectUri: fbRedirectUri
            });

            contentView.on('loginSubmited', function (user) {
                var view = this;
                app.execute('SignUp', user, function (err, data) {
                    if (err == null) {
                        app.router.navigate('back', { trigger: true });
                    } else {
                        var error = Helper.getErrorMessage(err);
                        if (error) {
                            view.showError(error, null, 'main');
                        } else {
                            that.errorPartial();
                        }
                    }
                });
            }, contentView);

            this.topBarLayout.show(topBarView);
            this.contentLayout.show(contentView);
        },

        //profile
        profile: function () {
            var that = this;

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (err) return that.errorPartial();

                if (currentUser == null) return app.router.navigate('login', { trigger: true });

                var topBarView = getProfileTopBarView();
                contentView = new ProfileContentLayout({ model: currentUser });

                app.topBar.show(topBarView);
                app.content.show(contentView);
            });
        },

        profileEdit: function (cuisineItems, neighborhoodItems) {
            var that = this;

            var currentCity = app.request('GetCurrentCity');
            if (!(cityId = that.checkCurrentCity())) return true; //set cityId to current.id or redirect to home if no current city specified

            app.execute('GetCurrentUser', function (err, currentUser) {
                if (currentUser == null) return app.router.navigate('login', { trigger: true });

                var favorite_cuisine_types = currentUser.get('favorite_cuisine_types'),
                    favorite_neighborhoods = currentUser.get('favorite_neighborhoods');

                if (cuisineItems == null) {
                    cuisineItems = new Dictionary(
                        _.map(favorite_cuisine_types.length > 0 ? favorite_cuisine_types.split(',') : [],
                            function (item) { return { value: item.trim() } }));
                }

                if (neighborhoodItems == null) {
                    neighborhoodItems = new Dictionary(
                        _.map(favorite_neighborhoods.length > 0 ? favorite_neighborhoods.split(',') : [],
                            function (item) { return { value: item.trim() } }));
                }

                var topBarView = getEditProfileTopBarView();
                contentView = new ProfileEditContentLayout({
                    model: currentUser,
                    cuisineItems: cuisineItems,
                    neighborhoodItems: neighborhoodItems
                });

                contentView.on('userSaved', function (userData) {
                    app.execute('UpdateCurrentUser', currentUser.get('id'), userData, cuisineItems, neighborhoodItems, function (err, data) {
                        if (err == null) {
                            app.router.navigate('profile', { trigger: true });
                        } else {
                            contentView.showErrors(err);
                        }
                    });
                });

                app.topBar.show(topBarView);
                app.content.show(contentView);

                contentView.on('ByNeighborhoodsClicked', function () {
                    showNeighborhoodsOrCuisines(false, cityId, neighborhoodItems, function (items) {
                        that.profileEdit(cuisineItems, items);
                    });
                })
                .on('ByCuisinesClicked', function () {
                    showNeighborhoodsOrCuisines(true, cityId, cuisineItems, function (items) {
                        that.profileEdit(items, neighborhoodItems);
                    });
                });
            });
        }
    });

    var getLoginTopBarView = function () {
        var topBarModel = new TopBar({
            leftText: 'Home',
            leftUrl: 'back',
            rightText: 'Sign Up',
            rightUrl: 'signup',
            title: 'Log In'
        });

        return new TopBarView({ model: topBarModel });
    };

    var getSignUpTopBarView = function () {
        var topBarModel = new TopBar({
            leftText: 'Home',
            leftUrl: 'back',
            rightText: 'Log In',
            rightUrl: 'login',
            title: 'Sign Up'
        });

        return new TopBarView({ model: topBarModel });
    };

    var showNeighborhoodsOrCuisines = function (isCuisines, cityId, items, callback) {
        var that = this;
        app.execute(isCuisines ? 'GetCuisines' : 'GetNeighborhoods', cityId, function (err, allItems) {
            if (err) return that.errorPartial();

            var topBarView = isCuisines ? getCuisinesTopBarView(items.length) : getNeighborhoodsTopBarView(items.length);
            var contentView = new FavoriteItemsContentLayout({
                collection: allItems,
                items: items,
                isFavorite: true
            });

            app.topBar.show(topBarView);
            app.content.show(contentView);

            contentView.on('itemview:checkboxChanged', function (childView) {
                if (contentView.collection.where({ 'checked': true }).length > 3) {
                    childView.model.set('checked', false);
                    childView.render();
                    alert('Please choose up to 3 ' + (isCuisines ? 'cuisines' : 'neighborhoods'));

                }
                else {
                    topBarView.changeTopBarTitleText('(' + contentView.collection.where({ 'checked': true }).length + ')');
                }
            });

            topBarView.on('btnLeftClick', function () {
                callback(null);
            })
            .on('btnRightClick', function () {
                callback(new Dictionary(contentView.collection.where({ 'checked': true })));
            });
        });
    };

    var getProfileTopBarView = function () {
        var topBar = new TopBar({
            leftText: 'Home',
            leftUrl: 'back',
            title: 'Account'
        });

        return new TopBarView({ model: topBar });
    };

    var getEditProfileTopBarView = function () {
        var topBar = new TopBar({
            leftText: 'Cancel',
            leftUrl: 'profile',
            title: 'Account'
        });

        return new TopBarView({ model: topBar });
    };

    var getCuisinesTopBarView = function (count) {
        var topBar = new TopBar({
            leftText: 'Cancel',
            leftUrl: '',
            rightText: 'Done',
            rightUrl: '',
            rightCss: 'blue',
            title: 'Favourite Cuisines',
            topBarTitleText: '(' + count + ')'
        });

        return new TopBarView({
            model: topBar,
            leftClickEvent: 'btnLeftClick',
            rightClickEvent: 'btnRightClick'
        });
    };

    var getNeighborhoodsTopBarView = function (count) {
        var topBar = new TopBar({
            leftText: 'Cancel',
            leftUrl: '',
            rightText: 'Done',
            rightUrl: '',
            rightCss: 'blue',
            title: 'Favourite Neighborhoods',
            topBarTitleText: '(' + count + ')'
        });

        return new TopBarView({
            model: topBar,
            leftClickEvent: 'btnLeftClick',
            rightClickEvent: 'btnRightClick'
        });
    };

    return Controller;
});