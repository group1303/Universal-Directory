angular.module('UniDir.content', ['ngRoute','dx'])



.controller('contentCtrl', ['$scope','$http', '$rootScope', 
  function($scope, $http, $rootScope) {

// $http.get('http://localhost:8080/classes')
//   .success(function(data, status, headers, config) {
//       $scope.items = data;
//   })
//   .error(function(error, status, headers, config) {
//        console.log(status);
//        console.log("Error data_content.js");
// });

$http.get('http://localhost:8080/classes2')
    .success(function(data, status, headers, config) {
        $scope.items = data;
        //console.log(data);
    })
    .error(function(error, status, headers, config) {
         console.log(status);
         console.log("Процедура Find_list не нашла данных");
  });

$scope.$on ("navClassId", function(event, args) {
  $scope.navClassId = args.id;
  $http.get('http://localhost:8080/classes' + $scope.navClassId)
    .success(function(data, status, headers, config) {
        $scope.items = data;
        //console.log(data);
    })
    .error(function(error, status, headers, config) {
         console.log(status);
         console.log("Процедура Find_list не нашла данных");
  });

})


  

// Подсчет количества строк в объекте
// function countCols(obj){
//   return Object.keys(obj).length;
// };

$scope.dataGridOptions = {
  bindingOptions: { 
    dataSource: 'items'
  },
  paging: {
      enabled: true,
      pageSize: 10
  },
  // editing: {
  //   editMode: 'row',
  //   editEnabled: true,
  //   removeEnabled: true,
  //   insertEnabled: true,
  //   removeConfirmMessage: 
  //       "Вы точно хотите удалить запись?"
  // },
  selection: {
    mode: 'multiple'
  },
  columns: [
    {
      dataField: 'OIDEL',
      caption: "ID",
      width: 50
    },
    {
      dataField: 'ONAME', 
      caption: "Полное название",
      width: 200
    },
    {
      dataField: 'ONAMECLASS',
      caption: "Родительский класс",
      width: 300
    }
  ]
}
}]);