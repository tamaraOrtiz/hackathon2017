/* 
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com  
*/
var LineaAccionRender = function () {
  var lineaAccion, lineaAccionList;
  //var showTemplate  = Handlebars.compile($("#lineaAccion-show-tpl").html());
  var listTemplate  = Handlebars.compile($('#linea_accion-list-tpl').html());
  var lineaAccionService  = new LineaAccionService();
  this.initialize = function () {
    lineaAccionService.initialize();
  };

  this.setLineaAccionList = function (object) {
    lineaAccion = object;
  };

  this.setLineaAccionList = function (objectList) {
    lineaAccionList = objectList;
  };

  function showTpl (wrapper) {
    lineaAccionService.getResumenPrograma(lineaAccion.nivel_id, lineaAccion.entidad_id).done(function (result) {
      lineaAccion['resumenPrograma'] = result.rows;
      wrapper.html(showTemplate({lineaAccion: lineaAccion}));
      resumenProgramaChart();
    });
  }

  this.show = function (wrapper) {
    showTpl(wrapper);
  }

  this.list = function (wrapper) {
    wrapper.html(listTemplate({lineaAccionList: lineaAccionList}));
    /*$('.lineaAccion-item').on('click', function () {
      var id = $(this).data('id');
      var nivelId = $(this).data('nivel_id');
      lineaAccion = $.grep(lineaAccionList, function(e){ return e.entidad_id == id && e.nivel_id == nivelId; })[0];
      showTpl($('.principal_content'));
    });*/
  };

  function structResumenPrograma () {
    var presupuestos = {};

    $.each(lineaAccion.resumenPrograma, function (index, row) {
      if(presupuestos[row.tipo_presupuesto_id] === undefined){
        presupuestos[row.tipo_presupuesto_id] = {nombre: row.tipo_presupuesto_nombre, nombre_programas: [], programas: []};
      }
      presupuestos[row.tipo_presupuesto_id].nombre_programas.push(row.programa_nombre);
      presupuestos[row.tipo_presupuesto_id].programas.push({name: row.programa_nombre, value: row.cantidad_total});
      presupuestos[row.tipo_presupuesto_id].nombre_programas = $.unique(presupuestos[row.tipo_presupuesto_id].nombre_programas.sort());
    });
    return presupuestos;
  }

  function resumenProgramaChart() {
    var data = structResumenPrograma();

    $.each(data, function (index, presupuesto) {
      var id = 'chart-'+index;
      //$('.principal_content').initScrollable({y: 'auto'});
      $('#chart-list').append('<div id=\"'+id+'\" class=\"chart-canva\"></div>');
      $('#'+id).css('width', $('.principal_content').prop('clientWidth'));
      $('#'+id).css('height', $('.principal_content').prop('clientHeight')*0.8);
      var myChart = echarts.init(document.getElementById(id));
      option = {
        title : {
          text: presupuesto.nombre,
          x:'center'
        },
        tooltip : {
          trigger: 'item',
          formatter: "{c} ({d}%)"
        },
        legend: {
          y: 'bottom',
          x: 'center',
          data: presupuesto.nombre_programas
        },
        toolbox: {
          show : false,
          feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
              show: true,
              type: ['pie', 'funnel']
            },
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },
        calculable : true,
        series : [
          {
            name:'Programa',
            type:'pie',
            radius : '40%',
            center : ['50%', '30%'],
            data: presupuesto.programas,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      $(window).on('resize', function(){
        myChart.resize();
      });
    });
    $('#chart-list').append('<div style="padding-bottom: 70px;"></div>');
  }

};
