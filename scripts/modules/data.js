define([
	'jquery',
	'underscore',
	'backbone',
	'app',    
    'models/filter',
    'models/keyValue',
    'collections/dictionary',
    'collections/restaurants',
    'collections/cities',
],

function ($, _, Backbone, app, FilterItem, KeyValue, Dictionary, Restaurants, Cities) {
    var restaurantsByMetro = {},
        metros = null;    

    return app.module('Data', function (Data) {
        _.extend(Data, {
            allNeighborhoods: new Dictionary([new KeyValue({ key: 1, value: 'nnn1' }), new KeyValue({ key: 2, value: 'nnn2' }), new KeyValue({ key: 3, value: 'nnn3' })]),
            allCuisines: new Dictionary([new KeyValue({ key: 1, value: 'ccc1' }), new KeyValue({ key: 2, value: 'ccc2' }), new KeyValue({ key: 3, value: 'ccc3' })]),
            filter: new FilterItem({
                sortBy: 2,
                price: 3,
                cuisines: [],
                neighborhoods: []
            }),

            getAllNeighborhoods: function (ckecked) {                
                if (ckecked) {
                    return new Dictionary(this.allNeighborhoods.map(function (item) {
                        item.set('checked', ckecked.indexOf(item.get('key')) != -1);
                        return item;
                    }));
                }
                else {
                    return this.allNeighborhoods;
                }
                
            },

            getAllCuisines: function (ckecked) {                
                if (ckecked) {
                    return new Dictionary(this.allCuisines.map(function (item) {
                        item.set('checked', ckecked.indexOf(item.get('key')) != -1);
                        return item;
                    }));

                }
                else {
                    return this.allCuisines;
                }
            },

            getRestaurantsByMetro: function (metroId, callback) {
                var restaurants = restaurantsByMetro[metroId];                
                if (typeof restaurants == 'undefined') {
                    app.execute('API:GetRestaurantsByMetro', metroId, 1000, 1, function (err, data) {
                        if (err == null) {
                            restaurantsByMetro[metroId] = restaurants = new Restaurants(data.restaurants);
                        }
                        return callback ? callback(err, restaurants) : null;
                    });
                } else {
                    return callback ? callback(null, restaurants) : null;
                }
            },

            getMetros: function (callback) {
                if (metros == null) {
                    app.execute('API:GetMetros', function (err, data) {
                        if (err == null) {
                            metros = new Cities(data.metros);
                        };                        
                        return callback ? callback(err, metros) : null;
                    });
                } else {
                    return callback ? callback(null, metros) : null;
                }
            }
        });
    });
});