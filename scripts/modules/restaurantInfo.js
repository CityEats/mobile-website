define([
	'jquery',
	'underscore',
	'backbone',
	'app',
    'models/topBar',
    'models/keyValue',
    'models/reviewItem',
    'models/menuItem',
    'models/menuCategory',
    'models/dish',
    'collections/reviews',
    'collections/menus',
    'collections/menuCategories',
    'collections/dishes',
    'views/shared/topBar',
    'views/restaurantInfo/content',
    'views/restaurantInfo/info/info',
    'views/restaurantInfo/topMenu',
    'views/restaurantInfo/info/book',
    'views/restaurantInfo/info/exclusiveEatsOffer',
    'views/restaurantInfo/info/fullOverview',
    'views/restaurantInfo/info/images',
    'views/restaurantInfo/info/main',
    'views/restaurantInfo/info/textBlock',
    'views/restaurantInfo/info/map',
    'views/restaurantInfo/reviews/reviews',
    'views/restaurantInfo/menus/menus',
    //'views/restaurantInfo/menus/categoryItem',
    //'views/restaurantInfo/menus/menuItem',
    //'views/restaurantInfo/menus/reviews',
],

function ($, _, Backbone, app,
    TopBar, KeyValue, ReviewItem, MenuItem, MenuCategory, Dish,
    Reviews, Menus, MenuCategirues, Dishes,
    TopBarView, ContentLayout, InfoView, TopMenuView,
    BookView, ExclusiveEatsOfferView, FullOverviewView, ImagesView, MainView, TextBlockView, MapView, ReviewsView,
    MenusView
    //, CategoryItemView, MenuItemView, ReviewsView
    ) {
    return app.module('RestaurantInfo', function (RestaurantInfo) {
        _.extend(RestaurantInfo, {
            //cuisines: new Dictionary([new KeyValue({ key: 1, value: 'ccc1' }), new KeyValue({ key: 2, value: 'ccc2' }), new KeyValue({ key: 3, value: 'ccc3' })]),
            //neighborhoods: new Dictionary([new KeyValue({ key: 1, value: 'nnn1' }), new KeyValue({ key: 2, value: 'nnn2' }), new KeyValue({ key: 3, value: 'nnn3' })]),
            topBar: new TopBar({
                leftText: 'Back',
                leftUrl: 'browse-all',
                title: 'Station Grill'
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
                reviews: new Reviews([new ReviewItem({
                    title: 'Great Food and Lots of Options',
                    rating: 4,
                    author: 'Nevin Martell',
                    date: 'Aug 1st, 2012',
                    body: "The type of crowd here could also be found BLT.Central.Distrcit Commons. The food made me Excited to come back!. I'd go back for All of it !The atmosphere was fun and vibrant. The noise level was a little too loud. If you want a quieter meal, request to sit in the back room."
                }),
                new ReviewItem({
                    title: 'Great Food and Lots of Options 2',
                    rating: 5,
                    author: 'Nevin Martell',
                    date: 'Aug 1st, 2012',
                    body: "The type of crowd here could also be found BLT.Central.Distrcit Commons. The food made me Excited to come back!. I'd go back for All of it !The atmosphere was fun and vibrant. The noise level was a little too loud. If you want a quieter meal, request to sit in the back room."
                }), new ReviewItem({
                    title: 'Great Food and Lots of Options 3',
                    rating: 3,
                    author: 'Nevin Martell',
                    date: 'Aug 1st, 2012',
                    body: "The type of crowd here could also be found BLT.Central.Distrcit Commons. The food made me Excited to come back!. I'd go back for All of it !The atmosphere was fun and vibrant. The noise level was a little too loud. If you want a quieter meal, request to sit in the back room."
                })]),

                ReviewsView: ReviewsView,
            },
            menus: {
                menus: new Menus([new MenuItem({
                    title: 'Dinner Menu _1',
                    categories: new MenuCategirues([new MenuCategory({ title: 'APPETIZERS 1', dishes: new Dishes([new Dish({ title: 'Guacamole 11' })]) }), new MenuCategory({ title: 'APPETIZERS 1', dishes: new Dishes([new Dish({ title: 'Guacamole 22', price: 12.00 })]) })])
                }),
                new MenuItem({
                    title: 'Dinner Menu _2',
                    categories: new MenuCategirues([new MenuCategory({ title: 'APPETIZERS 2', dishes: new Dishes([new Dish({ title: 'Guacamole' })]) }), new MenuCategory({ title: 'APPETIZERS 2', dishes: new Dishes([new Dish({ title: 'Guacamole', price: 0.99  })]) })])
                }),
                new MenuItem({
                    title: 'Dinner Menu _3',
                    categories: new MenuCategirues([new MenuCategory({ title: 'APPETIZERS 3', dishes: new Dishes([new Dish({ title: 'Guacamole' })]) }), new MenuCategory({ title: 'APPETIZERS 3', dishes: new Dishes([new Dish({ title: 'Guacamole' })]) })])
                })]),
                MenusView: MenusView
            },
            KeyValue: KeyValue,
            TopMenuView: TopMenuView,
            ContentLayout: ContentLayout,
            TopBarView: TopBarView
        });
    });
});