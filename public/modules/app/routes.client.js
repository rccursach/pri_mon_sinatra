'use strict';

(function () {
  angular.module('app').config(appRoutes);

  appRoutes.$inject = ['$stateProvider', '$locationProvider'];

  function appRoutes($stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');
    
    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'modules/home/home.view.html',
      controller: 'homeController',
      controllerAs: 'vm'
    })
    .state('home.fast', {
      url: '/fast',
      templateUrl: 'modules/sensors_fast/sensorFast.view.html',
      controller: 'sensorFastController',
      controllerAs: 'vm'
    })
    .state('home.slow', {
      url: '/slow',
      templateUrl: 'modules/sensors_slow/sensorSlow.view.html',
      controller: 'sensorSlowController',
      controllerAs: 'vm'
    });
    // .state('name', {
    //   url: '',
    //   templateUrl: '',
    //   controller: '',
    //   controllerAs: 'vm'
    // })
  }
})();

// (function () {
//   angular.module('app').config(['$stateProvider', '$locationProvider',
//     function ($stateProvider, $locationProvider) {
//       $locationProvider.html5Mode(true).hashPrefix('!');
//       $stateProvider
//       .state({
//         url: '/home',
//         templateUrl: 'views/home/home.html',
//         controller: 'homeController',
//         controllerAs: 'vm'
//       });
//     }
//   ]);

// })();
