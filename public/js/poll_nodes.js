(function() {
  var fetch_loop, parse_data, ready, start_loop, stop_loop;

  fetch_loop = null;

  start_loop = function() {
    fetch_loop = setInterval(function() {
      $.get('/feed').success(function(data) {
        console.log('updated');
        console.log(data);
        parse_data( eval("("+data+")") );
      });
    }, 5000);
  };

  window.stop_loop = function() {
    clearInterval(fetch_loop);
  };

  parse_data = function(data_arr) {
    var data, i, len, results;
    $('#node_list').html("");
    $('#node_list').append("<table class='table'>");
    results = [];
    for (i = 0, len = data_arr.length; i < len; i++) {
      data = data_arr[i];
      $('#node_list table').append("<tr id='row-" + data[0] + "' class='well'>");
      
      var obj = eval("("+data[1]+")");
      $("#row-" + data[0]).append("<td>" + data[0] + "</td>");
      $("#row-" + data[0]).append("<td>" + get_table_for_data(obj) + "</td>");
      $("#row-" + data[0]).append("<button class='btn btn-primary btn-cmd' data-id='"+data[0]+"'>Enviar a "+data[0]+"</button>");
      //results.push($("#row-" + data[0]).append("<td>" + data[1] + "</td>"));
      //results.push();
    }
    //return results;
  };

  get_table_for_data = function(data_obj) {
    var str_out = "<table class='table'>";
    for(key in data_obj){
      str_out += "<tr>";
      str_out += "<td>"+key+":</td>";
      str_out += "<td>"+data_obj[key]+":</td>";
      str_out += "</tr>";
    }
    str_out += "</table>";
    return str_out;
  }

  ready = function() {
    start_loop();
  };

  $(document).ready(ready);

  $(document).on('page:load', ready);

}).call(this);
