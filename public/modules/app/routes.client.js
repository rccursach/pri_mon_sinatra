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
    .state('viz', {
      url: '/viz',
      templateUrl: 'modules/visualization/visualization.view.html',
      controller: 'vizController',
      controllerAs: 'vm'
    })
    .state('viz.fast', {
      url: 'viz/fast',
      templateUrl: 'modules/visualization/visualization.fast.view.html',
      controller: 'sensorFastController',
      controllerAs: 'vm'
    })
    .state('viz.slow', {
      url: 'viz/slow',
      templateUrl: 'modules/visualization/visualization.slow.view.html',
      controller: 'sensorSlowController',
      controllerAs: 'vm'
    })
    .state('nodes', {
      url: '/nodes',
      templateUrl: 'modules/nodes/nodes.view.html',
      controller: 'nodesController',
      controllerAs: 'vm'
    })
    .state('nodes.new', {
      url: '/nodes/new',
      templateUrl: 'modules/nodes/nodes.new.view.html',
      controller: 'nodesNewController',
      controllerAs: 'vm'
    })
    .state('nodes.manage', {
      url: '/nodes/manage',
      templateUrl: 'modules/nodes/nodes.manage.view.html',
      controller: 'nodesManageController',
      controllerAs: 'vm'
    })
    ;
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
