(function () {
  angular.module('app').controller('sensorSlowController', sensorSlowController);

  sensorSlowController.$inject = ['$window', 'nodeSlowService', '$scope'];

  function sensorSlowController($window, nodeSlowService, $scope) {
    //
    var vm = this;
    var d3 = $window.d3;
    var _ = $window._;
    vm.a = [];
    var wfactor = null;

    if($scope.current_node != null){
      vm.a = nodeSlowService.query({_id: $scope.nodes[$scope.current_node].id});
      // wfactor = $scope.nodes[$scope.current_node].params.wfactor || 1;
    }
    else{
      // vm.a = nodeSlowService.query();
    }
    vm.a.$promise.then(function(){
      console.log(vm.a);
      for (var i = vm.a.length - 1; i >= 0; i--) {
        vm.a[i] = JSON.parse(vm.a[i]);
        var t = parseFloat(vm.a[i].rtc_time);
        t = t === NaN ? 0 : t*1000;
        vm.data[0].values.push([ t, vm.a[i].t1 ]);
        vm.data[1].values.push([ t, vm.a[i].t2 ]);
        // vm.data[2].values.push([ t, (vm.a[i].weight/wfactor)*1007 ]);
      }
    });

    vm.data = [
      {
        key: "T1",
        values:[]
      },
      {
        key: "T2",
        values:[]
      }
      // ,
      // {
      //   key: "Peso",
      //   values:[]
      // }
    ];

    vm.options = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 30,
          left: 40
        },
        x: function (d) {
          return d[0];
        },
        y: function (d) {
          return d[1];
        },
        useVoronoi: false,
        clipEdge: true,
        duration: 100,
        useInteractiveGuideline: true,
        xAxis: {
          //showMaxMin: false,
          tickFormat: function (d) {
            return d3.time.format('%X')(new Date(d));
            //return d;
          }
        },
        yAxis: {
          tickFormat: function (d) {
            return d3.format(',.2f')(d);
          }
        },
        zoom: {
          enabled: false,
          scaleExtent: [1, 10],
          useFixedDomain: false,
          useNiceScale: false,
          horizontalOff: false,
          verticalOff: true,
          unzoomEventType: 'dblclick.zoom'
        }
      }
    };

    console.log('home');
  }
})();