/* 
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com  
*/
var InstitucionRender = function () {
  var institucion, institucionList;
  var showTemplate  = Handlebars.compile($("#institucion-show-tpl").html());
  var listTemplate  = Handlebars.compile($('#institucion-list-tpl').html());
  var institucionService  = new InstitucionService();
  this.initialize = function () {
    institucionService.initialize();
  };

  this.setInstitucionList = function (object) {
    institucion = object;
  };

  this.setInstitucionList = function (objectList) {
    institucionList = objectList;
  };

  function showTpl (wrapper) {
    institucionService.getResumenPrograma(institucion.nivel_id, institucion.entidad_id).done(function (result) {
      institucion['resumenPrograma'] = result.rows;
      wrapper.html(showTemplate({institucion: institucion}));
      resumenProgramaChart();
    });
  }

  this.show = function (wrapper) {
    showTpl(wrapper);
  }

  this.list = function (wrapper) {
    wrapper.html(listTemplate({institucionList: institucionList}));
    $(".int_programa").initScrollable({x: 'auto', y: 'hidden'});
    $('.institucion_badge').on('click', function () {
      var id = $(this).data('id');
      var nivelId = $(this).data('nivel_id');
      institucion = $.grep(institucionList, function(e){ return e.entidad_id == id && e.nivel_id == nivelId; })[0];
      showTpl($('.principal_content'));
      $(".navegacion_principal").html("");
      $(".navegacion_principal").append("<a href='#!' class='breadcrumb'>"+institucion.entidad_nombre+"</a>");
      $(".navegacion_principal").append("<a href='#!' class='breadcrumb'>Programas</a>");
    });
  };

  function structResumenPrograma () {
    var presupuestos = {};

    $.each(institucion.resumenPrograma, function (index, row) {
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
        formatter: "{a} <br/>{b}<br/>{c} ({d}%)"
        },
        legend: {
          y: 'bottom',
          x: 'center',
          data: presupuesto.nombre_programas
        },
        label: {
          show: false,
        },
        toolbox: {
          show : false,
          feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
              show: true,
              x: '25%',
              width: '50%',
              type: ['pie', 'funnel']
            },
            restore : {show: true},
            saveAsImage : {show: true}
          }
        },

        color:['#4dd0e1', '#4db6ac', '#81c784','#f06292','#ba68c8', '#9575cd', '#7986cb', '#64b5f6','#fff59d', '#1e88e5', '#ad1457'],

        calculable : true,
        series : [
          {
            name:'Programa',
            type:'pie',
            radius : '40%',
            center : ['50%', '30%'],
            label: {
                show: false,
                normal: {

                }
            },
            data: presupuesto.programas,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,

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
