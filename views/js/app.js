angular.module('UniDir', [
               'UniDir.content',
               'UniDir.help',
               'UniDir.nav',
               'ngRoute',
               'dx'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/',{
        templateUrl: '../content.html',
        controller: 'contentCtrl'
    })
    .when('/help',{
        templateUrl: '../help.html',
        controller: 'helpCtrl'
    })
    .otherwise({redirectTo: '/'});
}]);