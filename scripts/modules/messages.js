define([
    'jquery',
    'underscore',
    'app',
    'modules/data',
    'models/city',
],
function ($, _, app, Data, City) {    
    //init data methods
    //setup temporary DB logic    
    var API_PATH = 'http://build-beta.cityeats.com/api/v2';
    var WEB_PATH = 'http://build-beta.cityeats.com';

    var basicGetJSON = function (url) {
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

    var basicAuthPost = function (url) {        
        return function (data, callback) {
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                crossDomain: true,
                //username: '2many',
               // password: 'curlyfries',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization",                        
                        "Basic Basic Mm1hbnk6Y3VybHlmcmllcw==");
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
    app.commands.setHandler("FavCuisines:save", function (items) {
        //data.favCuisines = items;
        debugger
        Data.filter.set('cuisineIds', items);
    });

    app.reqres.setHandler("FavCuisines:get", function (checked) {
        return Data.getAllCuisines(Data.filter.get('cuisineIds'));
    });

    //neighborhoods
    app.commands.setHandler("FavNeighborhoods:save", function (items) {
        //data.favNeighborhoods = items;
        debugger
        Data.filter.set('neighborhoodIds', items);
    });    

    app.reqres.setHandler("FavNeighborhoods:get", function (checked) {
        return Data.getAllNeighborhoods(Data.filter.get('neighborhoodIds'));
    });

    //filter
    app.reqres.setHandler("Filter:get", function () {
        Data.filter.set('cuisines', Data.getAllCuisines(Data.filter.get('cuisineIds')));
        Data.filter.set('neighborhoods', Data.getAllNeighborhoods(Data.filter.get('neighborhoodIds')));
        return Data.filter;
    });

    app.commands.setHandler("Filter:save", function (item) {
        Data.filter = item;
    });

    //cities
    app.commands.setHandler("Metros:get", basicGetJSON(API_PATH + '/metros'));

    app.reqres.setHandler("CurrentCity:get", function () {
        var result = localStorage.getItem('CurrentCity');
        if (result)
            return new City(JSON.parse(result));
        else
            return null;
    });

    app.commands.setHandler("CurrentCity:set", function (currentCity) {        
        localStorage.setItem('CurrentCity', JSON.stringify(currentCity));
    });

    //user
    app.commands.setHandler("SignUp:save", basicAuthPost(WEB_PATH + '/users/sign_up'));

    return {};
});