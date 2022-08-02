var app = angular.module('routerApp', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html'
        })
    .state('intro',{
        url: '/link',
        templateUrl:'views/link.html'
    })

        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html'
        })
    $urlRouterProvider.otherwise('index',{
        url: "/index",
        templateUrl: 'views/home.html'
    });

}]);


