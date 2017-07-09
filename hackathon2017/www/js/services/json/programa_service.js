var ProgramaService = function() {

  var url;

  this.initialize = function(serviceURL) {
    url = serviceURL ? serviceURL : "http://geo.stp.gov.py/user/stp/api/v2/sql";
    var deferred = $.Deferred();
    deferred.resolve();
    return deferred.promise();
  }

  this.getMetaById = function(nivel_id, entidad_id, tipo_presupuesto_id, programa_id) {
    var where = "WHERE nivel = '"+nivel_id+"' AND entidad = '"+entidad_id+"' AND tipoprograma = '"+tipo_presupuesto_id+"' AND programa = '"+programa_id+"'";
    return $.ajax({url: url + "?q=SELECT a_p.nivel, a_p.entidad, a_p.tipoprograma, a_p.programa, a_p.anho, a_p.unidadmedida, a_p.cantidadfisica, a_p.cantidadfinanciera, a_p.totalasignacion, a_p.accionid, p_a.accion, p_a.la_meta, p_a.la_id, p_a.linea_accion, p_a.programacion_cantidad, p_a.avance_cantidad, p_a.avance_destinatarios, p_a.avance_costo, p_a.distrito_avance, p_a.departamento_avance, p_a.mes, p_a.programacion_cantidad FROM public.accionhasproducto as a_p INNER JOIN public.plandeaccion as p_a ON a_p.anho = a_p.anho and a_p.accionid = p_a.a_id "+where+";"});
  }
/*
  this.a = function () {


    require(
      [
        'echarts',
        'echarts/chart/map',   // load-on-demand, don't forget the Magic switch type.

      ],
      function (ec) {
        // Initialize after dom ready
        var myChart = ec.init(document.getElementById('main-map'));

        option = {
          title : {
            text: "Plan de accion",
            subtext: 'Acciones por departamentos'
            x:'right'
          },
          tooltip : {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2,
            formatter : function (params) {
              var value = (params.value + '').split('.');
              value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
              return params.seriesName + '<br/>' + params.name + ' : ' + value;
            }
          },
          dataRange: {
            x : 'right',
            min: 0,
            max: 300,
            color: ['blue','teal','lightskyblue'],
            text:['High','Low'],
            calculable : true
          },
          toolbox: {
            show : true,
            x: 'left',
            y: 'top',
            feature : {
              mark : {show: false},
              dataView : {show: false, readOnly: false},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          series : [
            {
              name: "Prueba",
              type: 'map',
              roam: true,
              mapType: 'PRY',
              itemStyle:{
                emphasis:{label:{show:true}}
              },

              data: datos
            }
          ]
        };

        require('echarts/util/mapData/params').params.PRY = {
          getGeoJson: function (callback) {
            $.getJSON('static/js/geoJson/py-dptos.json', callback);
          }
        };

        // Load data into the ECharts instance
        myChart.setOption(option);
      }
    );
  };
*/


  this.findByName = function(searchKey) {
    return $.ajax({url: url + "?name=" + searchKey});
  }

  this.findAll = function(conditions) {
    var where = conditions !== undefined ? "WHERE "+conditions : "";
    return $.ajax({ url: url + "?q=SELECT programa_id, programa_nombre, COUNT(DISTINCT entidad_id) FROM public.destinatarioproducto "+where+" GROUP BY programa_id, programa_nombre ORDER BY programa_nombre ASC ;" });
  }





};
