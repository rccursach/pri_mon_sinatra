(function () {
  angular.module('app').controller('sensorFastController', sensorFastController);

  sensorFastController.$inject = ['$window', 'nodeFastService', '$scope'];

  function sensorFastController($window, nodeFastService, $scope) {
    //
    var vm = this;
    var d3 = $window.d3;
    var _ = $window._;
    vm.a = [];

    if($scope.current_node != null){
      vm.a = nodeFastService.query({_id: $scope.nodes[$scope.current_node].id});
    }
    else{
      vm.a = nodeFastService.query();
    }
    vm.a.$promise.then(function(){
      console.log(vm.a);
      for (var i = vm.a.length - 1; i >= 0; i--) {
        vm.a[i] = JSON.parse(vm.a[i]);
        var k = 16384;
        var module_accel = Math.sqrt(Math.pow((vm.a[i].accel_x/k), 2) + Math.pow((vm.a[i].accel_y/k), 2) + Math.pow((vm.a[i].accel_z/k), 2));
        module_accel -= 1;
        //var module_gyro = Math.sqrt(Math.pow(vm.a[i].gyro_x, 2) + Math.pow(vm.a[i].gyro_y, 2) + Math.pow(vm.a[i].gyro_z, 2))
        var t = parseFloat(vm.a[i].time);
        t = t === NaN ? 0 : t*1000;
        vm.data[0].values.push([ t, module_accel ]);
        //vm.data[1].values.push([ vm.a[i].time, module_gyro ]);
      }
    });

    vm.data = [
      {
        key: "Accel",
        values:[]
      }
      // ,{
      //   key: "Gyro",
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