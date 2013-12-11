define(['marionette',
    'underscore',
    'text!templates/restaurant/info/info.html',
    'models/keyValue',
    'views/restaurant/info/book',
    'views/restaurant/info/exclusiveEatsOffer',
    'views/restaurant/info/fullOverview',
    'views/restaurant/info/images',
    'views/restaurant/info/main',
    'views/restaurant/info/textBlock',
    'views/restaurant/info/map'],

function (Marionette, _, contentHtml, KeyValue, BookView, ExclusiveEatsOfferView, FullOverviewView, ImagesView, MainView, TextBlockView, MapView) {

    var ContentLayout = Backbone.Marionette.Layout.extend({
        template: _.template(contentHtml),
        regions: {
            imgBox: "#imgBox",
            bookBox: '#bookBox',
            exclusiveEatsOffer: '#exclusiveEatsOffer',
            mapBox: '#mapBox',
            mainBox: '#mainBox',
            highlightsBox: '#highlightsBox',
            goodToKnowBox: '#goodToKnowBox',
            dishesBox: '#dishesBox',
            margaritasBox: '#margaritasBox',
            fullOverviewBox: '#fullOverviewBox'
        },

        onRender: function () {
            var id = this.options.id,
                party = this.options.party,
                date = this.options.date,
                time = this.options.time,
                fromRestaurants = this.options.fromRestaurants;

            var restaurant = this.model;
            var bookView = new BookView({ model: restaurant });
            //var exclusiveEatsOfferView = new ExclusiveEatsOfferView;
            var imagesView = new ImagesView({ model: restaurant });
            var mainView = new MainView({ model: restaurant });
            var mapView = new MapView({ model: restaurant });

            var highlights = restaurant.highlights();
            if (highlights.length > 0) highlightsView = new TextBlockView({ model: new KeyValue({ key: 'Highlights', value: highlights }) });
            else highlightsView = null;

            var goodToKnow = restaurant.goodToKnow();
            if (goodToKnow.length > 0) goodToKnowView = new TextBlockView({ model: new KeyValue({ key: 'Good to Know', value: goodToKnow }) });
            else goodToKnowView = null;

            var recommendedDishes = restaurant.recommendedDishes();
            if (recommendedDishes.length > 0) recommendedDishesView = new TextBlockView({ model: new KeyValue({ key: 'Recommended Dishes', value: recommendedDishes }) });
            else recommendedDishesView = null;

            var recommendedMargaritas = restaurant.recommendedMargaritas();
            if (recommendedMargaritas.length > 0) recommendedMargaritasView = new TextBlockView({ model: new KeyValue({ key: 'Recommended Margaritas', value: recommendedMargaritas }) });
            else recommendedMargaritasView = null;

            var reviews = restaurant.get('reviews');
            if (reviews.length > 0) fullOverview = new FullOverviewView({ collection: restaurant.getReviewCollection() });
            else fullOverview = null;            

            this.imgBox.show(imagesView);
            this.bookBox.show(bookView);
            //this.exclusiveEatsOffer.show(exclusiveEatsOfferView);
            this.mainBox.show(mainView);
            this.mapBox.show(mapView);

            if (highlightsView != null) this.highlightsBox.show(highlightsView);
            else this.highlightsBox.close();

            if (goodToKnowView != null) this.goodToKnowBox.show(goodToKnowView);
            else this.goodToKnowBox.close();

            if (recommendedMargaritasView != null) this.margaritasBox.show(recommendedMargaritasView);
            else this.margaritasBox.close();

            if (recommendedDishesView != null) this.dishesBox.show(recommendedDishesView);
            else this.dishesBox.close();

            if (fullOverview != null) this.fullOverviewBox.show(fullOverview);
            else this.fullOverviewBox.close();

            bookView.on('slotChosen', function (selectedTime, specialMealId) {
                var url;
                if (selectedTime && selectedTime.length > 0) {
                    url = ['restaurants/', id,
                            '/party/', party,
                            '/date/', date,
                            '/time/', time,
                            '/', (fromRestaurants ? 'book-it' : 'book-it-ext'),
                            '/complete-reservation/', selectedTime
                    ].join('');

                    if (specialMealId) url += ('/meal/' + specialMealId);

                } else {
                    url = fromRestaurants === true ?
                    ('restaurants/' + id + '/book-it') :
                    ('restaurants/' + id + '/party/' + party + '/date/' + date + '/time/' + time + '/book-it');
                }

                app.router.navigate(url, { trigger: true });
            });
        }
    });

    return ContentLayout;
});