angular.module('UniDir.content', ['ngRoute','dx'])



.controller('contentCtrl', ['$scope','$http', 
  function($scope, $http) {

$http.get('http://localhost:8080/classes')
.success(function(data, status, headers, config) {
    $scope.items = data;
})
.error(function(error, status, headers, config) {
     console.log(status);
     console.log("Error data_content.js");
});

$scope.dataGridOptions = {
  bindingOptions: { 
    dataSource: 'items'
  },
  paging: {
      enabled: false
  },
  editing: {
    editMode: 'row',
    editEnabled: true,
    removeEnabled: true,
    insertEnabled: true,
    removeConfirmMessage: 
        "Вы точно хотите удалить запись?"
  },
  selection: {
    mode: 'multiple'
  },
  columns: [
    {
      dataField: 'ID_CLASS',
      caption: "ID",
      width: 50
    },
    {
      dataField: 'SHORT_NAME',
      caption: "Короткое название",
      width: 200
    },
    {
      dataField: 'NAME', 
      caption: "Полное название"
    },
    {
      dataField: 'MAIN_CLASS',
      caption: "Родительский класс",
      width: 200
    }, 
    {
      dataField: 'BASE_EI',
      caption: 'Ед. измерения',
      width: 200
    }
  ]
}
}]);