angular.module('UniDir.nav', ['ngRoute','dx'])

.controller('navCtrl', ['$scope','$http', 
  function($scope, $http) {

  $http.get('http://localhost:8080/nav')
  .success(function(data, status, headers, config) {
    var tmp = data;
    alert(data.replace('\"', " "));
    $scope.nav = tmp;
  })
  .error(function(error, status, headers, config) {
    console.log(status);
    console.log("Error nav");
  });

  $scope.testNav = 
    [
      { ID_CLASS:2,MAIN_CLASS:null,NAME:"Электробензоинструмент"},
      { ID_CLASS:3,MAIN_CLASS:2,NAME:"Электроинструмент"},
      { ID_CLASS:4,MAIN_CLASS:3,NAME:"Дрели"},
      { ID_CLASS:5,MAIN_CLASS:3,NAME:"Лобзики"},
      { ID_CLASS:6,MAIN_CLASS:3,NAME:"Перфораторы"},
      { ID_CLASS:8,MAIN_CLASS:3,NAME:"Пилы"},
      { ID_CLASS:9,MAIN_CLASS:2,NAME:"Бензоинструмент"},
      { ID_CLASS:10,MAIN_CLASS:9,NAME:"Бензопилы"},
      { ID_CLASS:11,MAIN_CLASS:9,NAME:"Бензорезы"}
    ];

    // { id: 1, parentId: 0, text: "2123" },
    //     { id: 11, parentId: 1, text: "2123" },
    //     { id: 12, parentId: 1, text: "2123" },
    //     { id: 13, parentId: 1, text: "2123" },
    //     { id: 131, parentId: 13, text: "2123" },
    //     { id: 132, parentId: 13, text: "2123" },
    //     { id: 133, parentId: 13, text: "2123" },
    //     { id: 2, parentId: 0, text: "2123" }
    // ];

  $scope.treeView = {
    bindingOptions: {
      dataSource: 'nav',
    },
    onItemClick: function(e) {
      
    },
    dataStructure: 'plain',
    parentIdExpr: "MAIN_CLASS",
    rootValue: "null",
    keyExpr: "ID_CLASS",
    displayExpr: "NAME"
  }
}]);