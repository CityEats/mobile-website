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
    //init data methods
    //setup temporary DB logic    
    var API_PATH = 'http://qa-beta.cityeats.com/api/v2';
    var WEB_PATH = 'https://qa-beta.cityeats.com';

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

    var getJSON = function () {
        return function (url, callback) {
            var request = getJSONStatic(API_PATH + url);
            request(callback);
        }
    };

    var basicAuthPost = function (url) {        
        return function (data, callback) {       
            $.ajax({
                type: 'POST',
                url: url,
                data: "text=test",
                crossDomain: true,
                username: '2many',
                password: 'curlyfries',
                headers:{ 
                    'X-Foo': 'bar'
                }, 
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("test", "test");
                    xhr.setRequestHeader("Authorization", "Basic Mm1hbnk6Y3VybHlmcmllcw==");
                },
            })
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

    //cuisines
    app.commands.setHandler('SaveFavCuisines', function (items) {
        //data.favCuisines = items;
        debugger
        Data.filter.set('cuisineIds', items);
    });

    app.reqres.setHandler('GetFavCuisines', function (checked) {
        return Data.getAllCuisines(Data.filter.get('cuisineIds'));
    });

    //neighborhoods
    app.commands.setHandler('SaveFavNeighborhoods', function (items) {
        //data.favNeighborhoods = items;
        debugger
        Data.filter.set('neighborhoodIds', items);
    });    

    app.reqres.setHandler('GetFavNeighborhoods', function (checked) {
        return Data.getAllNeighborhoods(Data.filter.get('neighborhoodIds'));
    });

    //filter
    app.reqres.setHandler('GetFilter', function () {
        Data.filter.set('cuisines', Data.getAllCuisines(Data.filter.get('cuisineIds')));
        Data.filter.set('neighborhoods', Data.getAllNeighborhoods(Data.filter.get('neighborhoodIds')));
        return Data.filter;
    });

    app.commands.setHandler('SaveFilter', function (item) {
        Data.filter = item;
    });

    //cities
    app.commands.setHandler('API:GetMetros', function(callback){
        var handler = getJSONStatic(API_PATH + '/metros');
        handler(callback);
    });
        
    app.commands.setHandler('GetMetros', function (callback) {
        Data.getMetros(callback);
    });

    app.reqres.setHandler('GetCurrentCity', function () {
        var result = localStorage.getItem('CurrentCity');
        if (result)
            return new City(JSON.parse(result));
        else
            return null;
    });

    app.commands.setHandler('SetCurrentCity', function (currentCity) {        
        localStorage.setItem('CurrentCity', JSON.stringify(currentCity));
    });

    //user
    app.commands.setHandler('API:SignUp', basicAuthPost(WEB_PATH + '/users/sign_up'));

    //restaurants
    app.commands.setHandler('API:GetAvailableSlots', function (cityId, start, end, party, callback) {
        var handler = getJSONStatic(API_PATH +
            '/metros/' + cityId +
            '/available_slots?start_time=' + Helper.formatDateForApi(start) +
            '&end_time=' + Helper.formatDateForApi(end) +
            '&party_size=' + party);
        handler(callback);
    });

    app.commands.setHandler('GetRestaurants', function (cityId, start, end, party, time, callback) {        
        app.execute('GetRestaurantsByMetro', cityId, function (err, restaurants) {
            if (err) {
                return callback(err);
            }

            app.execute('API:GetAvailableSlots', cityId, start, end, party, function (err, slots) {
                if (err) {
                    return callback(err);
                }                
                
                var restaurantIds = restaurants.map(function (item) { return item.get('id') });
                slots = slots.filter(function (item) {                    
                    return _(restaurantIds).contains(item.id)                    
                });                

                var result = new Restaurants(
                    _(slots).map(function (item) {
                        var restaurant = restaurants.get(item.id).clone();
                        restaurant.set('slots', item.slots);
                        restaurant.set('selectedTime', time);
                        
                        return restaurant;
                    })
                );

                callback(null, result);
            });

        });
    });

    app.commands.setHandler('API:GetRestaurantsByMetro', function (metroId, perPage, pageNumber, callback) {
        var handler = getJSONStatic(API_PATH + '/metros/' + metroId + '/restaurants?per_page=' + perPage + '&page_number=' + pageNumber);
        handler(callback);
    });

    app.commands.setHandler('GetRestaurantsByMetro', function (metroId, callback) {
        Data.getRestaurantsByMetro(metroId, callback);
    })

    return {};
});