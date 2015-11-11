var UniDir = angular.module('UniDir', ['dx']);

UniDir.controller('myController', function ($scope) {
	$scope.randomValue = "0000000000";
	$scope.clickHandler = function () {
		var result = "";
		for (var i = 0; i < 10; i++)
				result += Math.round(Math.random() * 9);
		$scope.randomValue = result;
	};
});

UniDir.controller('itemsController', function ($scope, $http) {

    $http.get('http://localhost:8080/api')
    .success(function(data, status, headers, config) {
        console.log(data);
        $scope.items = data;
    })
    .error(function(error, status, headers, config) {
         console.log(status);
         console.log("Error occured");
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
              dataField: 'SHORT_NAME',
              caption: "SHORT_NAME",
              width: 70
          },
          'ID_CLASS',
          'NAME', 
          {
              dataField: 'MAIN_CLASS',
              caption: "MAIN_CLASS",
              width: 170
          }, {
            dataField: 'BASE_EI',
            caption: 'BASE_EI',
            width: 90
          }
      ]
}
});