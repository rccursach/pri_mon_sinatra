(function () {
  angular.module('app').controller('homeController', homeController);

  homeController.$inject = [];

  function homeController() {
    //
    var vm = this;

    console.log('home');
  }
})();