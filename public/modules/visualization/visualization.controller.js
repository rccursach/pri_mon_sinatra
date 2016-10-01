(function () {
  angular.module('app').controller('vizController', vizController);

  vizController.$inject = ['$scope', 'nodesService'];

  function vizController($scope, nodesService) {
    //
    var vm = this;
    vm.nodes = nodesService.query();

    vm.nodes.$promise.then(function(res){ console.log(res); });

    $scope.current_node = null;

    console.log('viz');
  }
})();