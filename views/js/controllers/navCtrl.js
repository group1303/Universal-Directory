angular.module('UniDir.nav', ['ngRoute','dx'])

.controller('navCtrl', ['$scope','$http', 
    function($scope, $http) {
    $scope.message = "In shape controller";

    $scope.treeView = {
        bindingOptions: {
            dataSource: 'products',
            dataStructure: 'plain'
        }
    }

    $scope.products = [{"id": "1",
                        "text": "Электроинструмент",
                        "expanded": true,
                        "items": [{
                            "id": "1_1",
                            "text": "Дрели",
                            "price": 550
                        }, {
                            "id": "1_2",
                            "text": "Лобзики",
                            "price": 750
                        }, {
                            "id": "1_3",
                            "text": "Перфораторы",
                            "price": 1050
                        }]
                    },
                    {"id": "2",
                        "text": "Бензоинструмент",
                        "expanded": true,
                        "items": [{
                            "id": "2_1",
                            "text": "Бензопилы",
                            "price": 550
                        }, {
                            "id": "2_2",
                            "text": "Бензорезы",
                            "price": 750
                        }, {
                            "id": "2_3",
                            "text": "Газовое и сварочное оборудование",
                            "price": 1050
                        }]
                    }];
}]);