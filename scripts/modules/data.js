define([
	'jquery',
	'underscore',
	'backbone',
	'app',    
    'models/filter',
    'models/keyValue',
    'models/user',
    'models/restaurant',
    'collections/dictionary',
    'collections/restaurants',
    'collections/cities'
],

function ($, _, Backbone, app, FilterItem, KeyValue, User, Restaurant, Dictionary, Restaurants, Cities) {
    var restaurantsByMetro = {},
        restaurantExtended = {},
        cuisinesByMetro = {},
        neighborhoodsByMetro = {},
        metros = null,
        filters = {},
        currentUser = null;

    return app.module('Data', function (Data) {
        _.extend(Data, {            
            getRestaurantsByMetro: function (metroId, filter, searchQuery, callback) {
                var that = this;
                var restaurants = restaurantsByMetro[metroId];
                if (typeof restaurants == 'undefined') {
                    app.execute('API:GetRestaurantsByMetro', metroId, 1000, 1, function (err, data) {
                        if (err == null) {
                            restaurantsByMetro[metroId] = restaurants = new Restaurants(data.restaurants);
                        }
                        
                        return callback ? callback(err, that.filterRestaurants(restaurants, searchQuery, filter)) : null;
                    });
                } else {
                    return callback ? callback(null, that.filterRestaurants(restaurants, searchQuery, filter)) : null;
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

            filterRestaurants: function (restaurants, searchQuery, filter) {
                var cuisineIds = [], neighborhoodIds = [], prices = [], sortBy;

                if (filter != null) {
                    cuisineIds = filter.get('cuisineIds');
                    neighborhoodIds = filter.get('neighborhoodIds');
                    prices = filter.get('prices');
                    sortBy = filter.get('sortBy');
                }

                restaurants = new Restaurants(restaurants.filter(function (restaurant) {
                    var filteredByCuisine = filteredByNeighborhood = filteredByPrice = filteredByQuery = true;

                    if (cuisineIds.length > 0) {
                        filteredByCuisine = _.intersection(cuisineIds, restaurant.get('cuisine_type_ids')).length > 0;
                    }

                    if (neighborhoodIds.length > 0) {
                        filteredByNeighborhood = neighborhoodIds.indexOf(restaurant.get('neighborhood_id')) != -1;
                    }

                    if (prices.length > 0) {
                        filteredByPrice = prices.indexOf(restaurant.get('price_rating')) != -1;
                    }

                    if (searchQuery && searchQuery.length > 0) {
                        searchQuery = searchQuery.toLowerCase();
                        var name = restaurant.get('name').toLowerCase(),
                            cuisines = _(restaurant.get('cuisine_types')).map(function (item) { return item.name; }).join(' | ').toLowerCase();

                        filteredByQuery = name.indexOf(searchQuery) != -1 || cuisines.indexOf(searchQuery) != -1;
                    }

                    return filteredByCuisine && filteredByNeighborhood && filteredByPrice && filteredByQuery;

                }));

                return this.orderRestaurants(restaurants, sortBy);
            },

            orderRestaurants: function (restaurants, by) {
                switch (by) {
                    case 1: {
                        //Distance
                        return new Restaurants(restaurants.sortBy('distance'));
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
                        if (err == null) {
                            metros = new Cities(data.metros);
                        }
                        if (lat && lng && metros.length > 0 && app.request('GetCurrentCity') == null) {
                            app.execute('SetCurrentCity', metros.at(0))
                            return callback ? callback(err, metros, true) : null;;
                        }
                        return callback ? callback(err, metros) : null;
                    });
                } else {
                    return callback ? callback(null, metros) : null;
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
                if (filter == null) {
                    filter = new FilterItem;
                }

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
                return filters[metroId];
            },

            resetFilter: function (metroId) {
                filters[metroId] = new FilterItem;
            },

            setFilterCuisines: function (cityId, cuisines) {
                var filter = filters[cityId];
                if (filter == null) {
                    filter = new FilterItem;
                }
                filter.set('cuisineIds', cuisines);

                filters[cityId] = filter;
            },

            setFilterNeighborhoods: function (cityId, neighborhoods) {
                var filter = filters[cityId];
                if (filter == null) {
                    filter = new FilterItem;
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
                        //"{"user":{"id":931,"first_name":"Max","last_name":"K","email":"max@max.com","phone_number":"3102762251","created_at":"2013-09-13T14:57:08Z","badges":{"Available":[],"Completed":[]},"avatar_url":"default_normal_avatar.gif","favorite_cuisine_types":[],"favorite_neighborhoods":[]}}"
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
                        //"{"avatar_content_type":null,"avatar_file_name":null,"avatar_file_size":null,"avatar_updated_at":null,"birthday":null,"cached_slug":"maxk","concierge_hotel_name":null,"created_at":"2013-09-13T14:57:08Z","dietary_restrictions":null,"disabled_at":null,"email":"max@max.com","first_favorite_food":null,"first_favorite_neighborhood":null,"first_name":"Max","id":931,"invitation_accepted_at":null,"invitation_sent_at":null,"invitation_token":null,"invited_by_id":null,"invited_by_message":null,"invited_by_type":null,"is_hotel_concierge":false,"last_name":"K","location":"New York, NY","phone_number":"3102762251","postal_code":"11222","private_history":null,"referral_awarded":false,"referral_type_id":null,"reviewer":null,"search_opt_out":false,"second_favorite_food":null,"second_favorite_neighborhood":null,"terms_of_service_id":1,"terms_of_service_ip":"91.247.221.51","third_favorite_food":null,"third_favorite_neighborhood":null,"unique_id":"95f98c1d4cd2a7bbc1fde59ce38d1f5e","updated_at":"2013-09-13T15:11:49Z","success":true}"
                    } else {
                        return callback(err, false);

                    }
                });
            },

            signOut: function(){
                currentUser = null;
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
            }
        });
    });
});