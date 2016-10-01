(function () {
  angular.module('app').controller('nodesController', nodesController);

  nodesController.$inject = [];

  function nodesController() {
    //
    var vm = this;

    console.log('nodes');
  }
})();