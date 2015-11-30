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

  Array.prototype.in_array = function(p_val) {
    for(var i = 0, l = this.length; i < l; i++) {
      if(this[i] == p_val) {
        return true;
      }
    }
    return false;
  }

  var parentsIds = [2,3,9,12];

  $scope.treeView = {
    bindingOptions: {
      dataSource: 'nav',
    },
    onItemClick: function(e) {
      if (parentsIds.in_array(e.itemData.ID_CLASS)){
        $rootScope.$broadcast("displayChildOrProd", {
        displayProds: false,
        id: e.itemData.ID_CLASS
      })
      } else {
        $rootScope.$broadcast("displayChildOrProd", {
        displayProds: true,
        id: e.itemData.ID_CLASS
      })
      }
    },
    dataStructure: 'plain',
    parentIdExpr: "MAIN_CLASS",
    rootValue: "0",
    keyExpr: "ID_CLASS",
    displayExpr: "NAME",
    noDataText: "Данные не найдены"
  }
}]);