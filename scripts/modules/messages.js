define([
    'jquery',
    'underscore',
    'app',
    'modules/data',
    'modules/helper',
    'models/city',
    'models/restaurant',
    'models/reservation',
    'collections/restaurants',
    'collections/reservations',
],
function ($, _, app, Data, Helper, City, Restaurant, Reservation, Restaurants, Reservations) {

    var API_PATH = '/api/v2',
        API_PATH1 = '/api/v1',
        API_KEY = 'k2Rw6FRzFcuS0suyVIRk96mOIyKEhtH89Fvqz377htFrymvd7IfIPonvzmt87v3';

    var getJSONStatic = function (url) {
        return function (callback) {
            $.getJSON(url)
                .success(function (response) {
                    if (callback) callback(null, response);
                })
                .error(function (response) {
                    if (callback) callback(response);
                });
        };
    };

    var postJSONStatic = function (url, data) {
        return function (callback) {            
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).success(function (response) {
                if (callback) callback(null, response);
            })
            .error(function (response) {
                if (callback) callback(response);
            });
        };
    };

    var putJSONStatic = function (url, data) {
        return function (callback) {
            $.ajax({
                type: 'PUT',
                url: url,
                data: JSON.stringify(data),
                contentType: 'application/json'
            }).success(function (response) {
                if (callback) callback(null, response);
            })
            .error(function (response) {
                if (callback) callback(response);
            });
        };
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
            getJSONStatic(API_PATH + '/metros?lat=' + lat + '&lng=' + lng) :
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

    app.commands.setHandler('API:SignOut', function (callback) {
        var handler = getJSONStatic(API_PATH + '/users/sign_out.json');
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

    app.commands.setHandler('SignOut', function (callback) {
        Data.signOut(callback);
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
            if (err) return callback(err);

            app.execute('API:GetAvailableSlots', cityId, start, end, party, function (err, slots) {
                if (err) return callback(err);

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
        if (typeof start == 'function' && typeof end == 'undefined') callback = start;

        Data.getRestaurantExtended(id, function (err, restaurant) {
            if (err) return callback(err);
            if (typeof end != 'undefined' && typeof party != 'undefined' && typeof time != 'undefined') {
                app.execute('API:GetAvailableSlotsForRestaurant', id, start, end, party, function (err, slots) {
                    if (err) return callback(err);

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
            } else {
                callback(null, restaurant);
            }
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

    //reservations
    app.commands.setHandler('API:LockReservation', function (restaurantId, reservation, callback) {
        var handler = postJSONStatic(API_PATH + '/restaurants/' + restaurantId + '/locks', reservation);
        handler(callback);
    });

    app.commands.setHandler('LockReservation', function (restaurantId, lock, callback) {
        app.execute('API:LockReservation', restaurantId, { party_size: lock.party, time: Helper.formatDateForApi(lock.slotDate) }, function (err, response) {
            if (err == null) {
                //save lock data                
                Data.saveLock(response.lock_id, lock);
            }

            callback(err, response);
        });
    });

    app.commands.setHandler('API:ConfirmReservation', function (restaurantId, lockId, reservation, callback) {
        var request = {
            restaurant_id: restaurantId,
            key: API_KEY,
            reservation: {
                party_size: reservation.party,
                reserved_for: reservation.slotDate,
                lock_id: lockId,
                promo_code: '',
                special_request: ''
            }
        };

        if (reservation.user.isAuthorized === true) request.reservation['user'] = { id: reservation.user.id };

        request.reservation['email'] = reservation.user.email;
        request.reservation['first_name'] = reservation.user.firstName;
        request.reservation['last_name'] = reservation.user.lastName;
        request.reservation['phone_number'] = reservation.user.phone;

        var handler = postJSONStatic(API_PATH1 + '/iorders', request);
        handler(callback);
    });

    app.commands.setHandler('ConfirmReservation', function (restaurantId, lockId, reservation, callback) {
        app.execute('API:ConfirmReservation', restaurantId, lockId, reservation, function (err, response) {
            if (err == null) {
                var lock = Data.getLock(lockId);
                lock.reservationResponse = response;
                Data.saveLock(lockId, lock);
            }
            callback(err, response);
        });
    });

    app.commands.setHandler('API:CancelReservation', function (orderId, callback) {
        var handler = putJSONStatic(API_PATH + '/orders/' + id + '/cancel?key=' + API_KEY);
        handler(callback);
    });

    app.commands.setHandler('CancelReservation', function (orderId, callback) {
        app.execute('API:CancelReservation', orderId, function (err, response) {
            callback(err, response);
        });
    });

    app.commands.setHandler('API:GetReservations', function (callback) {
        var handler = getJSONStatic(API_PATH + '/reservations');
        handler(callback);
    });

    app.commands.setHandler('GetReservations', function (callback) {
        app.execute('API:GetReservations', function (err, response) {
            if (err == null) {
                if (response.error) {
                    callback(response.error);
                }
                else if (response.reservations) {
                    var reservations = response.reservations,
                        now = new Date;

                    reservations = _.filter(reservations, function (item) { return item.state != 'pending' || new Date(item.reserved_for) > now });
                    Data.saveReservations(reservations);
                    callback(null, new Reservations(reservations));
                } else {
                    callback(null, response);
                }
            } else {
                callback(err);
            }
        });
    });

    app.commands.setHandler('GetReservation', function (id, callback) {        
        Data.getReservation(id, callback);
    });

    app.commands.setHandler('CancelReservation', function (orderId, callback) {
        app.execute('API:CancelReservation', orderId, function (err, response) {
            if (err) return callback(err);

            Data.clearReservation();
            callback(null);
        });
    });

    app.commands.setHandler('API:CancelReservation', function (orderId, callback) {
        var handler = putJSONStatic(API_PATH1 + '/orders/' + orderId + '/cancel?key=' + API_KEY);
        handler(callback);
    });

    app.reqres.setHandler('GetLock', function (lockId) {
        var lock = Data.getLock(lockId);
        if (lock) return new Reservation(lock);
        else return null;
    });

    app.commands.setHandler('API:UpdateReservation', function (code, reservation, callback) {
        var handler = putJSONStatic(API_PATH + '/reservations/' + code, reservation);
        handler(callback);
    });

    app.commands.setHandler('UpdateReservation', function (code, reservation, callback) {
        app.execute('API:UpdateReservation', code, reservation, function (err, response) {
            if (err) return callback(err);

            Data.saveReservations([response.reservation]);
            return callback(null, new Reservation(response.reservation));
        });
    });

    return {};
});