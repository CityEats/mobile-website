define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'modules/helper',
    'models/filter',
    'models/keyValue',
    'models/user',
    'models/restaurant',
    'models/reservation',
    'collections/dictionary',
    'collections/restaurants',
    'collections/cities'
],

function ($, _, Backbone, app, Helper, FilterItem, KeyValue, User, Restaurant, Reservation, Dictionary, Restaurants, Cities) {
    var restaurantsByMetro = {},
        restaurantExtended = {},
        cuisinesByMetro = {},
        neighborhoodsByMetro = {},
        metros = null,
        filters = {},
        currentUser = null,
        reservations = {},
        locks = {};

    return app.module('Data', function (Data) {
        _.extend(Data, {
            getRestaurantsByMetro: function (metroId, filter, isEditorsPicks, searchQuery, callback) {
                var that = this;
                var restaurants = restaurantsByMetro[metroId];
                if (typeof restaurants == 'undefined') {
                    var location = app.request('GetLocation');
                    app.execute('API:GetRestaurantsByMetro', metroId, 1000, 1, location ? location.lat : null, location ? location.lng : null, function (err, data) {
                        if (err == null) {
                            restaurantsByMetro[metroId] = restaurants = new Restaurants(data.restaurants);
                        }

                        return callback ? callback(err, that.filterRestaurants(restaurants, searchQuery, filter, isEditorsPicks)) : null;
                    });

                } else {
                    return callback ? callback(null, that.filterRestaurants(restaurants, searchQuery, filter, isEditorsPicks)) : null;
                }
            },

            getRestaurantExtended: function (id, callback) {
                var restaurant = restaurantExtended[id];
                if (typeof restaurant == 'undefined') {
                    app.execute('API:GetRestaurantExtended', id, function (err, resposneRestaurant) {
                        if (err == null) {
                            app.execute('API:GetRestaurant', id, function (err, resposneExtRestaurant) {
                                if (err == null) {
                                    _.extend(resposneRestaurant, resposneExtRestaurant.restaurants);
                                    restaurantExtended[id] = restaurant = new Restaurant(resposneRestaurant);
                                }

                                callback(err, restaurant);
                            });
                        } else {
                            callback(err);
                        }
                    });
                } else {
                    return callback(null, restaurant);
                }
            },

            filterRestaurants: function (restaurants, searchQuery, filter, isEditorsPicks) {
                var cuisineIds = [], neighborhoodIds = [], prices = [], sortBy;

                if (typeof restaurants == 'undefined' || restaurants == null) return null;

                if (filter != null) {
                    cuisineIds = filter.get('cuisineIds');
                    neighborhoodIds = filter.get('neighborhoodIds');
                    prices = filter.get('prices');
                    sortBy = filter.get('sortBy');
                }

                restaurants = new Restaurants(restaurants.filter(function (restaurant) {
                    var filteredByCuisine = filteredByNeighborhood = filteredByPrice = filteredByQuery = filteredByEditorsPicks = true;

                    if (cuisineIds.length > 0) filteredByCuisine = _.intersection(cuisineIds, restaurant.get('cuisine_type_ids')).length > 0;

                    if (neighborhoodIds.length > 0) filteredByNeighborhood = neighborhoodIds.indexOf(restaurant.get('neighborhood_id')) != -1;

                    if (prices.length > 0) filteredByPrice = prices.indexOf(restaurant.get('price_rating')) != -1;

                    if (isEditorsPicks) filteredByEditorsPicks = restaurant.get('is_editors_picks');

                    if (searchQuery && searchQuery.length > 0) {
                        searchQuery = searchQuery.toLowerCase();
                        var name = restaurant.get('name').toLowerCase(),
                            cuisines = _(restaurant.get('cuisine_types')).map(function (item) { return item.name; }).join(' | ').toLowerCase();

                        filteredByQuery = Helper.stringSearch(searchQuery, name) ||
                            Helper.stringSearch(searchQuery, cuisines) ||
                            Helper.stringSearch(searchQuery, restaurant.get('neighborhood').name);
                    }

                    return filteredByCuisine && filteredByNeighborhood && filteredByPrice && filteredByQuery && filteredByEditorsPicks;

                }));
                return this.orderRestaurants(restaurants, sortBy);
            },

            orderRestaurants: function (restaurants, by) {
                switch (by) {
                    case 1: {
                        //Distance
                        return new Restaurants(restaurants.sortBy('distance_to_restaurant'));
                    }
                    case 3: {
                        //A - Z
                        return new Restaurants(restaurants.sortBy('name'));
                    }
                    case 2:
                    default: {
                        //Popular                        
                        return new Restaurants(restaurants.sortBy('popularity').reverse());
                    }
                }
            },

            getMetros: function (callback, lat, lng) {
                if (metros == null) {
                    app.execute('API:GetMetros', lat, lng, function (err, data) {
                        if (err) return callback ? callback(err) : null;

                        metros = new Cities(_.where(data.metros, { active: true }));
                        if (lat && lng && metros.length > 0 && app.request('GetCurrentCity') == null) {
                            var firstMetro = metros.at(0);
                            if (firstMetro.get('distance_to_metro') && (firstMetro.get('distance_to_metro') * 1000) <= 100) {
                                app.execute('SetCurrentCity', firstMetro);
                            }

                            return callback ? callback(err, metros) : null;;
                        }
                        return callback ? callback(err, metros) : null;
                    });
                } else {
                    return callback ? callback(null, metros) : null;
                }
            },

            getMetro: function (id, callback) {
                if (metros == null) {
                    app.execute('API:GetMetros', null, null, function (err, data) {
                        if (err == null) {
                            metros = new Cities(_.where(data.metros, { active: true }));
                        }
                        return callback ? callback(err, metros.get(id)) : null;
                    });
                } else {
                    return callback ? callback(null, metros.get(id)) : null;
                }
            },

            getCuisinesByMetro: function (metroId, callback) {
                var cuisines = cuisinesByMetro[metroId];
                if (typeof cuisines == 'undefined') {
                    app.execute('API:GetCuisines', metroId, function (err, data) {
                        if (err == null) {
                            cuisinesByMetro[metroId] = cuisines = new Dictionary(data.cuisine_types.map(function (item) { return { key: item.id, value: item.name } }));
                        }
                        return callback ? callback(err, cuisines) : null;
                    });
                } else {
                    return callback ? callback(null, cuisines) : null;
                }
            },

            getNeighborhoodsByMetro: function (metroId, callback) {
                var neighborhoods = neighborhoodsByMetro[metroId];
                if (typeof neighborhoods == 'undefined') {
                    app.execute('API:GetNeighborhoods', metroId, function (err, data) {
                        if (err == null) {
                            neighborhoodsByMetro[metroId] = neighborhoods = new Dictionary(data.neighborhoods.map(function (item) { return { key: item.id, value: item.name } }));
                        }
                        return callback ? callback(err, neighborhoods) : null;
                    });
                } else {
                    return callback ? callback(null, neighborhoods) : null;
                }
            },

            getFilter: function (metroId, callback) {
                var filter = filters[metroId];
                if (filter == null) filter = new FilterItem;

                var cuisineIds = filter.get('cuisineIds') || [],
                    neighborhoodIds = filter.get('neighborhoodIds') || [],
                    that = this;

                this.getCuisinesByMetro(metroId, function (err, cuisines) {
                    if (err) {
                        return callback(err);
                    }

                    filter.set('cuisines', cuisines);

                    that.getNeighborhoodsByMetro(metroId, function (err, neighborhoods) {
                        if (err) {
                            return callback(err);
                        }

                        filter.set('neighborhoods', neighborhoods);

                        filters[metroId] = filter;
                        callback(null, filter);
                    });
                });
            },

            getFilterSimple: function (metroId) {
                var filter = filters[metroId];
                if (filter == null) {
                    filter = new FilterItem;
                    filters[metroId] = filter;
                }

                return filter;
            },

            setFilterCuisines: function (cityId, cuisines) {
                var filter = filters[cityId];
                if (filter == null) {
                    filter = new FilterItem;
                    filters[cityId] = filter;
                };

                filter.set('cuisineIds', cuisines);

                filters[cityId] = filter;
            },

            setFilterNeighborhoods: function (cityId, neighborhoods) {
                var filter = filters[cityId];
                if (filter == null) {
                    filter = new FilterItem;
                    filters[cityId] = filter;
                }

                filter.set('neighborhoodIds', neighborhoods);

                filters[cityId] = filter;
            },

            signUp: function (user, callback) {
                app.execute('API:SignUp', { user: user }, function (err, data) {
                    currentUser = null;
                    if (err == null) {
                        app.execute('GetCurrentUser');
                        return callback(err, true);
                    } else {
                        return callback(err, false);

                    }
                });
            },

            signIn: function (user, callback) {
                user['remember_me'] = 1;
                app.execute('API:SignIn', { user: user }, function (err, data) {
                    currentUser = null;
                    if (err == null) {
                        app.execute('GetCurrentUser');
                        return callback(err, true);
                    } else {
                        return callback(err, false);
                    }
                });
            },

            signOut: function (callback) {
                app.execute('API:SignOut', function (err) {
                    if (err) return callback(err);

                    currentUser = null;
                    callback(null);
                });
            },

            getCurrentUser: function (callback) {
                if (currentUser) {
                    return callback ? callback(null, currentUser) : null;
                } else {
                    app.execute('API:GetUser', function (err, data) {
                        if (err == null && typeof data.error == 'undefined') {
                            currentUser = new User(data.user);
                        } else {
                            currentUser = null;
                        }

                        return callback ? callback(err, currentUser) : null;
                    });
                }
            },

            updateCurrentUser: function (id, user, cuisineItems, neighborhoodItems, callback) {
                app.execute('API:UpdateUser', id, user, cuisineItems, neighborhoodItems, function (err, data) {
                    if (err == null && typeof data.error == 'undefined') {
                        currentUser = new User(data.user);
                    }

                    return callback ? callback(err, currentUser) : null;
                });
            },

            saveLock: function (lockId, lock) {
                locks[lockId] = lock;
            },

            getLock: function (lockId) {
                return locks[lockId];
            },

            saveReservations: function (items) {
                for (var i = 0; i < items.length; i++) {
                    reservations[items[i].confirmation_code] = items[i];
                }
            },

            getReservation: function (code, callback) {
                var reservation = reservations[code],
                    that = this;
                if (reservation) return callback(null, new Reservation(reservation));

                app.execute('API:GetReservation', code, function (err, reservation) {
                    if (err) return callback(err);

                    that.saveReservations([reservation]);
                    callback(null, new Reservation(reservation));
                });
            },

            clearReservation: function (id) {
                reservations = {};
            },
        });
    });
});