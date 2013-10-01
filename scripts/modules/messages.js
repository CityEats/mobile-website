define([
    'jquery',
    'underscore',
    'app',
    'modules/data',
    'modules/helper',
    'models/city',
    'models/restaurant',
    'collections/restaurants',
],
function ($, _, app, Data, Helper, City, Restaurant, Restaurants) {

    var API_PATH = '/api/v2';

    var getJSONStatic = function (url) {
        return function (callback) {
            
            $.getJSON(url)
                .success(function (response) {
                    if (callback)
                        callback(null, response);
                })
                .error(function (response) {
                    if (callback)
                        callback(response);
                });          
        }
    };

    var postJSONStatic = function (url, data) {
        return function (callback) {
            $.post(url, JSON.stringify(data))
                .success(function (response) {
                    if (callback)
                        callback(null, response);
                })
                .error(function (response) {
                    if (callback)
                        callback(response);
                });
        }
    };

    var getJSON = function () {
        return function (url, callback) {
            var request = getJSONStatic(API_PATH + url);
            request(callback);
        }
    };

    //cuisines
    app.commands.setHandler('SaveFilterCuisines', function (cityId, items) {
        Data.setFilterCuisines(cityId, items);
    });

    //neighborhoods
    app.commands.setHandler('SaveFilterNeighborhoods', function (cityId, items) {
        Data.setFilterNeighborhoods(cityId, items);
    });

    //filter
    app.commands.setHandler('GetFilter', function (cityId, callback) {
        Data.getFilter(cityId, callback);
    });

    app.reqres.setHandler('GetFilterSimple', function (cityid) {
        return Data.getFilterSimple(cityid);
    });    

    app.commands.setHandler('ResetFilter', function (cityid) {
        Data.resetFilter(cityid);        
    });

    //cities
    app.commands.setHandler('API:GetMetros', function (lat, lng, callback) {
        var handler = (lat && lng) ?            
            getJSONStatic(API_PATH + '/metros?lat=' + lat + '&lng=' + lng): 
            getJSONStatic(API_PATH + '/metros');
        handler(callback);
    });

    app.commands.setHandler('API:CreateMetroEmail', function (newMetroEmail, callback) {
        var handler = postJSONStatic(API_PATH + '/new_metro_emails', { new_metro_email: newMetroEmail });
        handler(callback);
    });

    app.commands.setHandler('CreateMetroEmail', function (newMetroEmail, callback) {
        app.execute('API:CreateMetroEmail', newMetroEmail, function (err, response) {
            callback(err, response);
        });
    });

    app.reqres.setHandler('GetCurrentCity', function () {
        var result = localStorage.getItem('CurrentCity');
        if (result) {
            return new City(JSON.parse(result));
        }
        else {
            return null;
        }
    });

    app.commands.setHandler('SetCurrentCity', function (currentCity) {
        localStorage.setItem('CurrentCity', JSON.stringify(currentCity));
    });

    //cuisines
    app.commands.setHandler('API:GetCuisines', function (cityId, callback) {
        var handler = getJSONStatic(API_PATH + '/metros/' + cityId + '/cuisine_types');
        handler(callback);
    });

    app.commands.setHandler('GetCuisines', function (cityId, callback) {
        Data.getCuisinesByMetro(cityId, callback);
    });

    //neighborhoods
    app.commands.setHandler('API:GetNeighborhoods', function (cityId, callback) {
        var handler = getJSONStatic(API_PATH + '/metros/' + cityId + '/neighborhoods');
        handler(callback);
    });

    app.commands.setHandler('GetNeighborhoods', function (cityId, callback) {
        Data.getNeighborhoodsByMetro(cityId, callback);
    });

    //user
    app.commands.setHandler('API:SignUp', function (user, callback) {
        var handler = postJSONStatic(API_PATH + '/users/sign_up.json', user);
        handler(callback);
    });

    app.commands.setHandler('API:SignIn', function (user, callback) {
        var handler = postJSONStatic(API_PATH + '/users/sign_in.json', user);
        handler(callback);
    });

    app.commands.setHandler('API:GetUser', function (callback) {
        var handler = getJSONStatic(API_PATH + '/user');        
        handler(callback);
    });

    app.commands.setHandler('SignUp', function (user, callback) {
        Data.signUp(user, callback);
    });

    app.commands.setHandler('SignIn', function (user, callback) {
        Data.signIn(user, callback);
    });

    app.commands.setHandler('SignOut', function () {
        Data.signOut();
    });

    app.commands.setHandler('GetCurrentUser', function (callback) {        
        Data.getCurrentUser(callback);
    });    

    //restaurants
    app.commands.setHandler('API:GetAvailableSlots', function (cityId, start, end, party, callback) {
        var handler = getJSONStatic(API_PATH +
            '/metros/' + cityId +
            '/available_slots?start_time=' + Helper.formatDateForApi(start) +
            '&end_time=' + Helper.formatDateForApi(end) +
            '&party_size=' + party);
        handler(callback);
    });

    app.commands.setHandler('GetRestaurants', function (cityId, start, end, party, time, filter, searchQuery, callback) {        
        app.execute('GetRestaurantsByMetro', cityId, searchQuery, filter, function (err, restaurants) {
            if (err) {
                return callback(err);
            }

            app.execute('API:GetAvailableSlots', cityId, start, end, party, function (err, slots) {
                if (err) {
                    return callback(err);
                }

                var result = new Restaurants(
                    restaurants.filter(function (restaurant) {
                        var slot = _(slots).findWhere({ id: restaurant.get('id') });
                        if (slot) {
                            restaurant.set('slots', slot.slots);
                            restaurant.set('selectedTime', time);
                            return true;
                        }
                        else {
                            return false;
                        }
                    })
                );

                callback(null, result);
            });

        });
    });

    //restaurant
    app.commands.setHandler('API:GetRestaurantExtended', function (id, callback) {
        var handler = getJSONStatic(API_PATH +
            '/restaurants/' + id + '/extended_attrs');
        handler(callback);
    });

    app.commands.setHandler('API:GetRestaurant', function (id, callback) {
        var handler = getJSONStatic(API_PATH +
            '/restaurants/' + id);
        handler(callback);
    });

    app.commands.setHandler('API:GetAvailableSlotsForRestaurant', function (id, start, end, party, callback) {        
        var handler = getJSONStatic(API_PATH +
            '/restaurants/' + id +
            '/available_slots?start_time=' + Helper.formatDateForApi(start) +
            '&end_time=' + Helper.formatDateForApi(end) +
            '&party_size=' + party);
        handler(callback);
    });

    app.commands.setHandler('GetRestaurant', function (id, start, end, party, time, callback) {
        Data.getRestaurantExtended(id, function (err, restaurant) {
            if (err) {
                return callback(err);
            }

            app.execute('API:GetAvailableSlotsForRestaurant', id, start, end, party, function (err, slots) {
                if (err) {
                    return callback(err);
                }                
                
                if (slots.length > 0) {
                    restaurant.set('slots', slots[0].slots);
                } else {
                    restaurant.set('slots', []);
                }

                if (time) {
                    restaurant.set('selectedTime', time);
                }

                if (party) {
                    restaurant.set('party', party);
                }

                callback(null, restaurant);
            });
        });        
    });

    app.commands.setHandler('API:GetRestaurantsByMetro', function (metroId, perPage, pageNumber, callback) {
        var handler = getJSONStatic(API_PATH + '/metros/' + metroId + '/restaurants?per_page=' + perPage + '&page_number=' + pageNumber);
        handler(callback);
    });

    app.commands.setHandler('GetRestaurantsByMetro', function (metroId, filter, searchQuery, callback) {
        Data.getRestaurantsByMetro(metroId, filter, searchQuery, callback);
    });

    app.commands.setHandler('GetMetros', function (callback) {
        var geoOptions = {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 15000
        };
        
        navigator.geolocation.getCurrentPosition(
            function success(data) {                
                Data.getMetros(callback, data.coords.latitude, data.coords.longitude);
            },
            function error(data) {
                Data.getMetros(callback);
            },
            geoOptions
        );
    });    

    return {};
});