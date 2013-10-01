define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'models/keyValue',
    'views/shared/topBar',
    'views/restaurant/content',
    'views/restaurant/info/info',
    'views/restaurant/topMenu',
    'views/restaurant/info/book',
    'views/restaurant/info/exclusiveEatsOffer',
    'views/restaurant/info/fullOverview',
    'views/restaurant/info/images',
    'views/restaurant/info/main',
    'views/restaurant/info/textBlock',
    'views/restaurant/info/map',
    'views/restaurant/reviews/reviews',
    'views/restaurant/menus/menus',
],

function ($, _, Backbone, app,
    TopBar, KeyValue,
    TopBarView, ContentLayout, InfoView, TopMenuView,
    BookView, ExclusiveEatsOfferView, FullOverviewView, ImagesView, MainView, TextBlockView, MapView, ReviewsView, MenusView) {

    return app.module('RestaurantInfo', function (RestaurantInfo) {
        _.extend(RestaurantInfo, {
            topBar: new TopBar({
                leftText: 'Back',
                leftUrl: 'back',
                title: ''
            }),
            info: {
                InfoView: InfoView,
                BookView: BookView,
                ExclusiveEatsOfferView: ExclusiveEatsOfferView,
                FullOverviewView: FullOverviewView,
                ImagesView: ImagesView,
                MainView: MainView,
                TextBlockView: TextBlockView,
                MapView: MapView                
            },
            reviews: {              
                ReviewsView: ReviewsView,
            },
            menus: {                
                MenusView: MenusView
            },
            KeyValue: KeyValue,
            TopMenuView: TopMenuView,
            ContentLayout: ContentLayout,
            TopBarView: TopBarView
        });
    });
});