define(['marionette', 'underscore', 'views/chooseCity/city', ], function (Marionette, _, CityView) {
    
    var ItemView = Marionette.CollectionView.extend({
        itemView: CityView
    });

    return ItemView;
});