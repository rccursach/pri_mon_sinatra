(function() {
  var fetch_loop, parse_data, ready, start_loop, stop_loop;

  fetch_loop = null;

  actual_nodes = null;

  start_loop = function() {
    fetch_loop = setInterval(function() {
      $.get('/api/nodes').success(function(data) {
        $('#nodes').html(data);
        console.log(data);
        d = JSON.parse(data);
        $.get('/api/nodes/data/'+d[0]).success(function(data_2) {
          $('#data').html(data_2);
          console.log(data_2);
        });

      });
    }, 5000);
  };

  window.stop_loop = function() {
    clearInterval(fetch_loop);
  };

  transform_data = function(data_arr) {
    for(var i=0; i<data_arr.length; i++){
      data_arr[i][1] = eval("("+data_arr[i][1]+")");
      var data = data_arr[i][1];
      data.T1 = String(data.T1 / 16)+" ºC";
      data.T2 = String(data.T2 / 16)+" ºC";
      data.RTC = new Date(data.RTC);
      data.ACC = data.ACC/16384;
      data.W = String(data.W)+" Kg"
    }
    return data_arr;
  };

  parse_data = function(data_arr) {

    var data, i, len, results;
    $('#node_list').html("");
    //$('#node_list').append("<div class='col-md-12'>");
    results = [];
    for (i = 0, len = data_arr.length; i < len; i++) {
      data = data_arr[i];
      //$('#node_list div').append("<div id='row-" + data[0] + "' class='row well'>");
      $('#node_list').append("<div id='row-" + data[0] + "' class='row well pri-nodes'>");
      
      var obj = data[1];
      $("#row-" + data[0]).append("<div class='col-md-2'>" + data[0] + "</div>");
      $("#row-" + data[0]).append("<div class='col-md-8'>" + get_table_for_data(obj) + "</div>");
      $("#row-" + data[0]).append("<button class='btn btn-primary btn-cmd' data-id='"+data[0]+"'>Enviar a "+data[0]+"</button>");
    }

  };

  get_table_for_data = function(data_obj) {
    var str_out = "<table class='table'>";
    for(key in data_obj){
      str_out += "<tr>";
      str_out += "<td>"+key+":</td>";
      str_out += "<td>"+data_obj[key]+"</td>";
      str_out += "</tr>";
    }
    str_out += "</table>";
    return str_out;
  }

  upd_actual_nodes = function(data) {
    actual_nodes = [];
    for (var i = data.length - 1; i >= 0; i--) {
      actual_nodes.push(data[i][0]);
    };
    console.log("Actually, nodes are: ", actual_nodes);
  }

  upd_btncmd_action = function() {
    $.each($(".btn-cmd"), function(i, elem){
      $(elem).click(function(event){
        event.preventDefault();
        send_one($(this).data("id"));
      });
    });
  }

  send_all = function() {
    var cmd = $("#cmd-text").val();
    if(cmd == undefined || cmd === ""){
      alert("Debe escribir un comando");
    }
    else{
      var cmds = [];
      for (var i = actual_nodes.length - 1; i >= 0; i--) {
        cmds.push(cmd+";"+actual_nodes[i]);
      };
      alert("Se enviará el siguiente comando: "+JSON.stringify(cmds));
      $.post('/send_multi', {"cmds": cmds } )
      .success(function(data){
        alert("Comandos enviados a la cola");
      })
      .error(function(data){
        alert("Ocurrio un error");
      });
    }
  }

  send_one = function(node_name) {
    var cmd = $("#cmd-text").val();
    if(cmd == undefined || cmd === ""){
      alert("Debe escribir un comando");
    }
    else{
      cmd = cmd+";"+node_name;
      alert("Se enviará el siguiente comando: "+ cmd );
      $.post('/send', {"cmd":cmd})
      .success(function(data){
        alert("Comando enviado a la cola");
      })
      .error(function(data){
        alert("Ocurrio un error");
      });
    }
  }

  ready = function() {
    $("#btn-send-all").click(function(event){
      event.preventDefault();
      send_all();
    });
    start_loop();
  };

  $(document).ready(ready);

  $(document).on('page:load', ready);

}).call(this);
