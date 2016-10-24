(function () {
  angular.module('app').controller('vizController', vizController);

  vizController.$inject = ['$scope', 'nodesService'];

  function vizController($scope, nodesService) {
    //
    var vm = this;
    $scope.nodes = nodesService.query();

    $scope.nodes.$promise.then(function(res){ console.log(res); });

    $scope.current_node = null;

    console.log('viz');
  }
})();