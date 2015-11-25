angular.module('UniDir.nav', ['ngRoute','dx'])

.controller('navCtrl', ['$scope','$http','$rootScope',
  function($scope, $http, $rootScope) {

  $http.get('http://localhost:8080/nav')
  .success(function(data, status, headers, config) {
    var navObj = data;
    navObj[0].MAIN_CLASS = 0;
    navObj[0].expanded = true;
    $scope.nav = navObj;
  })
  .error(function(error, status, headers, config) {
    console.log(status);
    console.log("Error nav");
  });

  $scope.treeView = {
    bindingOptions: {
      dataSource: 'nav',
    },
    onItemClick: function(e) {
      $rootScope.$broadcast("navClassId", {
        id: e.itemData.ID_CLASS
      })
    },
    dataStructure: 'plain',
    parentIdExpr: "MAIN_CLASS",
    rootValue: "0",
    keyExpr: "ID_CLASS",
    displayExpr: "NAME",
    noDataText: "Данные не найдены"
  }
}]);