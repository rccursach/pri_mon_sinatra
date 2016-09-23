(function () {
  'use strict';

  angular
    .module('app')
    .factory('nodeFastService', nodeFastService);

  nodeFastService.$inject = ['$resource'];

  function nodeFastService($resource) {
    return $resource('api/nodes/fast', {});
  }
})();

(function () {
  'use strict';

  angular
    .module('app')
    .factory('nodeSlowService', nodeSlowService);

  nodeSlowService.$inject = ['$resource'];

  function nodeSlowService($resource) {
    return $resource('api/nodes/slow', {});
  }
})();