(function () {
  angular.module('app').controller('sensorFastController', sensorFastController);

  sensorFastController.$inject = ['$window', 'nodeFastService', '$scope', '$interval'];

  function sensorFastController($window, nodeFastService, $scope, $interval) {
    //
    var vm = this;
    var d3 = $window.d3;
    var _ = $window._;
    vm.a = [];
    var interval_tasks_not_loaded = true;

    if($scope.current_node != null){
      vm.a = nodeFastService.query({_id: $scope.nodes[$scope.current_node].id});
    }
    else{
      console.log('current_node is null!');
      vm.a = nodeFastService.query();
    }

    vm.a.$promise.then(function(){
      console.log(vm.a);
      serie = { key: 'Acceleracion', values: [] };

      for (var i = vm.a.length - 1; i >= 0; i--) {
        vm.a[i] = JSON.parse(vm.a[i]);
        var k = 16384;
        var module_accel = Math.sqrt(Math.pow((vm.a[i].accel_x/k), 2) + Math.pow((vm.a[i].accel_y/k), 2) + Math.pow((vm.a[i].accel_z/k), 2));
        module_accel -= 1;
        //var module_gyro = Math.sqrt(Math.pow(vm.a[i].gyro_x, 2) + Math.pow(vm.a[i].gyro_y, 2) + Math.pow(vm.a[i].gyro_z, 2))
        var t = parseFloat(vm.a[i].time);
        t = t === NaN ? 0 : t*1000;
        serie.values.push([ t, module_accel ]);
        //vm.data[0].values.push([ vm.a[i].time, module_accel ]);
        //vm.data[1].values.push([ vm.a[i].time, module_gyro ]);
      }
      serie.values = _.sortBy(serie.values, 0);
      vm.data.push(serie);
      // Load interval tasks that manipulates this data!
      // subsequent calls will be ignored because of 'interval_tasks_not_loaded'
      // variable being changed to false
      load_interval_tasks();
    });

    vm.data = [
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
          useNiceScale: true,
          horizontalOff: false,
          verticalOff: false,
          unzoomEventType: 'dblclick.zoom'
        }
      }
    };

    function load_interval_tasks() {
      if(interval_tasks_not_loaded){
        $interval(remove_old_records, 4000);
      }
      interval_tasks_not_loaded = false;
    }

    function remove_old_records() {
      console.log('cleaning up!');
      var last_hour = (((new Date()).getTime() /1000) - 3600);
      vm.data.forEach(function (serie) {
        var vals = serie.values;
        // remove left values until keep the one hour margin!
        try {
          while(vals.length) {
            if(vals[0][0] < last_hour) {
              vals.shift();
              cnsole.log('droped old record!');
            }
            else { break; }
          }
        }
        catch(e) {
          console.log('all elements were removed!');
        }
      });
    }
  }
})();