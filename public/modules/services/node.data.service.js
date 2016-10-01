(function () {
  'use strict';

  angular
    .module('app')
    .factory('nodeFastService', nodeFastService);

  nodeFastService.$inject = ['$resource'];

  function nodeFastService($resource) {
    return $resource('api/data/fast/:id', {});
  }
})();

(function () {
  'use strict';

  angular
    .module('app')
    .factory('nodeSlowService', nodeSlowService);

  nodeSlowService.$inject = ['$resource'];

  function nodeSlowService($resource) {
    return $resource('api/data/slow/:id', {id: '@_id'});
  }
})();