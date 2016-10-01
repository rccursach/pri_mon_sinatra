(function () {
  'use strict';

  angular
    .module('app')
    .factory('nodesService', nodesService);

  nodesService.$inject = ['$resource'];

  function nodesService($resource) {
    return $resource('api/nodes/:nodeId', {
      nodeId: '@_id'
    });
  }
})();