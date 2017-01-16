(function () {
  angular.module('app').controller('sensorSlowController', sensorSlowController);

  sensorSlowController.$inject = ['$window', 'nodeSlowService', '$scope', '$interval'];

  function sensorSlowController($window, nodeSlowService, $scope, $interval) {
    //
    var vm = this;
    var d3 = $window.d3;
    var _ = $window._;
    vm.a = [];
    var wfactor = null;
    var interval_tasks_not_loaded = true;
    var tasks_interval = undefined;

    if($scope.current_node != null){
      vm.a = nodeSlowService.query({_id: $scope.nodes[$scope.current_node].id});
      // wfactor = $scope.nodes[$scope.current_node].params.wfactor || 1;
    }
    else{
      // vm.a = nodeSlowService.query();
    }

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

    vm.a.$promise.then(function(){
      console.log(vm.a);
      load_series(vm.a);
      load_interval_tasks();
    });

    function load_series(series_data) {
      var temp_1 = [];
      var temp_2 = [];
      for (var i = series_data.length - 1; i >= 0; i--) {
        series_data[i] = JSON.parse(series_data[i]);
        var t = parseFloat(series_data[i].rtc_time);
        t = t === NaN ? 0 : t*1000;
        temp_1.push([ t, series_data[i].t1 ]);
        temp_2.push([ t, series_data[i].t2 ]);
        // vm.data[0].values.push([ t, series_data[i].t1 ]);
        // vm.data[1].values.push([ t, series_data[i].t2 ]);
        // vm.data[2].values.push([ t, (series_data[i].weight/wfactor)*1007 ]);
      }
      // Sort by time
      temp_1 = _.sortBy(temp_1, 0);
      temp_2 = _.sortBy(temp_2, 0);

      // add series to chart
      temp_1.forEach(function(s) {
        vm.data[0].values.push(s);
      });
      temp_2.forEach(function(s) {
        vm.data[1].values.push(s);
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

    function periodic_tasks() {
      get_new_records();
      remove_old_records();
    }

    function stop_tasks_interval() {
      $interval.cancel(tasks_interval);
      tasks_interval = undefined;
      interval_tasks_not_loaded = true;
    }

    function get_new_records() {
      console.log('getting new records!');
      // var time = (((new Date()).getTime() /1000) - 4);
      // poll new values
      var new_data = nodeSlowService.query({_id: $scope.nodes[$scope.current_node].id, nsec: 4});
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