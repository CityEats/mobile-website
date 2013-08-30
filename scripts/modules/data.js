define([
	'jquery',
	'underscore',
	'backbone',
	'app',    
    'models/filter',
    'models/keyValue',    
    'collections/dictionary',
],

function ($, _, Backbone, app, FilterItem, KeyValue, Dictionary) {
    return app.module('Data', function (Data) {
        _.extend(Data, {
            allNeighborhoods: new Dictionary([new KeyValue({ key: 1, value: 'nnn1' }), new KeyValue({ key: 2, value: 'nnn2' }), new KeyValue({ key: 3, value: 'nnn3' })]),
            allCuisines: new Dictionary([new KeyValue({ key: 1, value: 'ccc1' }), new KeyValue({ key: 2, value: 'ccc2' }), new KeyValue({ key: 3, value: 'ccc3' })]),
            filter: new FilterItem({
                sortBy: 2,
                price: 3,
                cuisines: ['test c1', 'test c2'],
                neighborhoods: ['test n1', 'test n2']
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

            getFilter: function () {
                return this.filter;
            }
        });
    });
});