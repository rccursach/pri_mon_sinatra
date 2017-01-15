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
    var tasks_interval = undefined;
    
    vm.data = [];
    vm.data.push({ key: 'Acceleracion', values: [] });

    if($scope.current_node != null){
      vm.a = nodeFastService.query({_id: $scope.nodes[$scope.current_node].id});
    }
    else{
      console.log('current_node is null!');
      vm.a = nodeFastService.query();
    }
    
    vm.a.$promise.then(function(){
      console.log(vm.a);
      load_series(vm.a);
      // Load interval tasks that manipulates this data!
      // subsequent calls will be ignored because of 'interval_tasks_not_loaded'
      // variable being changed to false
      load_interval_tasks();
    });


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

    function load_series(series_data) {
      var serie = [];
      for (var i = series_data.length - 1; i >= 0; i--) {
        series_data[i] = JSON.parse(series_data[i]);
        var k = 16384;
        var module_accel = Math.sqrt(Math.pow((series_data[i].accel_x/k), 2) + Math.pow((series_data[i].accel_y/k), 2) + Math.pow((series_data[i].accel_z/k), 2));
        module_accel -= 1;
        //var module_gyro = Math.sqrt(Math.pow(series_data[i].gyro_x, 2) + Math.pow(series_data[i].gyro_y, 2) + Math.pow(series_data[i].gyro_z, 2))
        var t = parseFloat(series_data[i].time);
        t = t === NaN ? 0 : t*1000;
        serie.push([ t, module_accel ]);
        //vm.data[0].values.push([ series_data[i].time, module_accel ]);
        //vm.data[1].values.push([ series_data[i].time, module_gyro ]);
      }
      serie = _.sortBy(serie, 0);
      serie.forEach(function(s) {
        vm.data[0].values.push(s);
      });
    }

    function load_interval_tasks() {
      if(interval_tasks_not_loaded){
        tasks_interval = $interval(periodic_tasks, 4000);
        $scope.$on("$destroy", function( event ) {
          stop_tasks_interval();
          console.log("tasks_interval canceled")
        });
      }
      interval_tasks_not_loaded = false;
    }
    function stop_tasks_interval() {
      $interval.cancel(tasks_interval);
      tasks_interval = undefined;
      interval_tasks_not_loaded = true;
    }

    function periodic_tasks() {
      get_new_records();
      remove_old_records();
    }

    function get_new_records() {
      console.log('getting new records!');
      // var time = (((new Date()).getTime() /1000) - 4);
      // poll new values
      var new_data = nodeFastService.query({_id: $scope.nodes[$scope.current_node].id, nsec: 4});
      new_data.$promise.then(function(data) {
        console.log(data);
        load_series(data);
      },
      function(err) {
        console.log(err);
      });

    }

    function remove_old_records() {
      console.log('cleaning up!');
      var last_hour = (((new Date()).getTime() /1000) - 3600) * 1000;
      vm.data.forEach(function (serie) {
        var vals = serie.values;
        // remove left values until keep the one hour margin!
        try {
          while(vals.length) {
            console.log("" + vals[0][0] + " < " + last_hour + "?");
            if(vals[0][0] < last_hour) {
              vals.shift();
              console.log('droped old record!');
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