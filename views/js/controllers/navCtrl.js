angular.module('UniDir.nav', ['ngRoute','dx'])

.controller('navCtrl', ['$scope','$http', 
  function($scope, $http) {

  $http.get('http://localhost:8080/nav')
  .success(function(data, status, headers, config) {
    $scope.nav = data;
  })
  .error(function(error, status, headers, config) {
    console.log(status);
    console.log("Error nav");
  });

  $scope.treeView = {
    bindingOptions: {
      dataSource: 'nav',
      dataStructure: 'plain'
    },
    activeStateEnabled: true
  }
}]);