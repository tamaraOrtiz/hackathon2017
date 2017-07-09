/* 
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com  
*/
var NivelRender = function () {
  var nivel, nivelList;
  var showTemplate  = Handlebars.compile($("#nivel-show-tpl").html());
  var listTemplate  = Handlebars.compile($('#niveles-list-tpl').html());
  var nivelService  = new NivelService();
  var institucionService = new InstitucionService();
  var institucionRender  = new InstitucionRender();
  var programaRender = new ProgramaRender();

  this.initialize = function () {
    nivelService.initialize();
    institucionService.initialize();
    institucionRender.initialize();
    programaRender.initialize();
  };

  this.setNivelList = function (object) {
    nivel = object;
  };

  this.setNivelList = function (objectList) {
    nivelList = objectList;
  };

  function showProgramas() {
    $( ".int_programa" ).each(function( index ) {
      var id = $(this).data('id');
      var nivel_id = $(this).data('nivel_id');
      var cantidad= 0;
      var programa_tag= $(this);
      var item_tag= $(".entidad_list_"+id);
      institucionService.getResumenPrograma(nivel_id, id).done(function (result) {
        $.each(result.rows, function( index, programa ) {
          programa_tag.append( "<span class='chip_label entidad_tag' data-programa_nombre="+programa["programa_nombre"].toLowerCase() +" data-nivel_id="+nivel_id+" data-entidad_id="+id+" data-programa_id="+programa["programa_id"]+" data-tipo_presupuesto_id="+programa["tipo_presupuesto_id"]+">"+programa['programa_nombre'].toLowerCase()+"</span>" );
          cantidad = cantidad + programa['cantidad_total'];
          $($('.entidad_tag:last')[0]).on('click', function () {
            var entidadId = $(this).data('entidad_id');
            var nivelId = $(this).data('nivel_id');
            var programaId = $(this).data('programa_id');
            var tipoPresupuestoId =  $(this).data('tipo_presupuesto_id');
            programaRender.show($(".principal_content"), nivelId, entidadId, programaId, tipoPresupuestoId );
            $(".navegacion_principal").html("");
            $(".navegacion_principal").append("<a href='#!' class='breadcrumb'>"+$(this).data("programa_nombre")+"</a>");
            $(".navegacion_principal").append("<a href='#!' class='breadcrumb'>Programas</a>");
          });
        });

        item_tag.append("<span class='chip_second_label'><i class='fa fa-child' aria-hidden='true'></i>"+cantidad+"</span>");

      });

    });
  };


  function showTpl (wrapper) {
    wrapper.html(showTemplate({nivel: nivel}));
    $(".navegacion_principal").html("");
    $(".navegacion_principal").append("<a href='#!' class='breadcrumb'>"+nivel.nivel_nombre+"</a>");
    $(".navegacion_principal").append("<a href='#!' class='breadcrumb'>Entidades</a>");
    institucionService.findAll("nivel_id = '"+nivel.nivel_id+"'").done(function (result) {
      var institucionWrapper = $('#instituciones');
      var instituciones = result.rows;
      var l = instituciones.length;
      var e;
      $(".button-collapse").sideNav('hide');
      institucionRender.setInstitucionList(instituciones);
      institucionRender.list(institucionWrapper);

      showProgramas();
    });
  }

  this.show = function (wrapper) {
    showTpl(wrapper);
  }

  this.list = function (wrapper) {
    nivelService.findAll().done(function (result) {
      nivelList = result.rows;
      var l = nivelList.length;
      var e;
      wrapper.html(listTemplate({nivelList: nivelList}));
      $('.nivel-item').on('click', function () {
        var id = $(this).data('id');
        nivel = $.grep(nivelList, function(e){ return e.nivel_id == id; })[0];
        showTpl($('.principal_content'));
      });
    });
  };



};
