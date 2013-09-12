define([
	'jquery',
	'underscore',
	'backbone',
	'app',    
    'models/filter',
    'models/keyValue',
    'collections/dictionary',
    'collections/restaurants',
    'collections/cities'
],

function ($, _, Backbone, app, FilterItem, KeyValue, Dictionary, Restaurants, Cities) {
    var restaurantsByMetro = {},
        cuisinesByMetro = {},
        neighborhoodsByMetro = {},
        metros = null,
        filters = {}

    return app.module('Data', function (Data) {
        _.extend(Data, {            
            getRestaurantsByMetro: function (metroId, filter, callback) {
                var that = this;
                var restaurants = restaurantsByMetro[metroId];
                if (typeof restaurants == 'undefined') {
                    app.execute('API:GetRestaurantsByMetro', metroId, 1000, 1, function (err, data) {
                        if (err == null) {
                            restaurantsByMetro[metroId] = restaurants = new Restaurants(data.restaurants);
                        }
                        
                        console.log(restaurants);
                        return callback ? callback(err, that.filterRestaurants(restaurants, filter)) : null;
                    });
                } else {
                    return callback ? callback(null, that.filterRestaurants(restaurants, filter)) : null;
                }
            },

            filterRestaurants: function (restaurants, filter) {
                var cuisineIds, neighborhoodIds, prices;

                if (filter != null) {
                    cuisineIds = filter.get('cuisineIds');
                    neighborhoodIds = filter.get('neighborhoodIds');
                    prices = filter.get('prices');
                } else {
                    return this.orderRestaurants(restaurants);
                }

                restaurants = new Restaurants(restaurants.filter(function (restaurant) {
                    var filteredByCuisine = filteredByNeighborhood = filteredByPrice = true;

                    if (cuisineIds.length > 0) {
                        filteredByCuisine = _.intersection(cuisineIds, restaurant.get('cuisine_type_ids')).length > 0;
                    }

                    if (neighborhoodIds.length > 0) {
                        filteredByNeighborhood = neighborhoodIds.indexOf(restaurant.get('neighborhood_id')) != -1;
                    }

                    if (prices.length > 0) {
                        filteredByPrice = prices.indexOf(restaurant.get('price_rating')) != -1;
                    }

                    return filteredByCuisine && filteredByNeighborhood && filteredByPrice;

                }));

                return this.orderRestaurants(restaurants, filter.get('sortBy'));
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
                        return new Restaurants(restaurants.sortBy('popularity'));
                    }
                }                
            },

            getMetros: function (callback, lat, lng) {
                if (metros == null) {
                    app.execute('API:GetMetros', lat, lng, function (err, data) {
                        if (err == null) {
                            metros = new Cities(data.metros);
                        }
                        if (lat && lng && metros.length > 0) {
                            app.execute('SetCurrentCity', metros.at(0));
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
        });
    });
});