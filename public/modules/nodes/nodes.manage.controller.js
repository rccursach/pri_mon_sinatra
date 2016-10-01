(function () {
  angular.module('app').controller('nodesManageController', nodesManageController);

  nodesManageController.$inject = ['nodesService'];

  function nodesManageController(nodesService) {
    //
    var vm = this;

    vm.nodes = nodesService.query();

    // vm.nodes.$promise.then(function(){
    //   console.log(vm.nodes);
    // });

    console.log('nodes manage');
  }
})();