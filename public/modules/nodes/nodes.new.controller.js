(function () {
  angular.module('app').controller('nodesNewController', nodesNewController);

  nodesNewController.$inject = ['nodesService'];

  function nodesNewController(nodesService) {
    //
    var vm = this;

    vm.node = new nodesService();
    vm.params = '';

    vm.create = function () {
      if(vm.params.length){
        vm.node.params = JSON.parse(vm.params);
      }
      console.log(vm.node);
      vm.node.$save(function(res){
        alert(res.name + " se creó con exito");
      },
      function(res){
        alert("Ocurrió un error creando el nuevo nodo");
      });
    };

    console.log('nodes new');
  }
})();