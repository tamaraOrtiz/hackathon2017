/* 
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com  
*/
var PndRender = function () {
  var pnd = {id: "1"};
  var pndList, institucionList;
  var showTemplate  = Handlebars.compile($('#pnd-show-tpl').html());
  //var listTemplate  = Handlebars.compile($("#institucion-list-tpl").html());
  var institucionService = new InstitucionService();
  var institucionRender  = new InstitucionRender();

  this.initialize = function () {
    institucionService.initialize();
    institucionRender.initialize();
  };

  this.setPnd = function (object) {
    pnd = object;
  };

  this.setPndList = function (objectList) {
    pndList = objectList;
  };

  this.setInstitucionList = function (objectList) {
    institucionList = objectList;
  };

  this.show = function (wrapper) {
    wrapper.html(showTemplate({pnd: pnd}));
    institucionService.findAll("plan_id = '"+pnd.id+"'").done(function (result) {
      var institucionWrapper = $('#instituciones');
      var instituciones = result.rows;
      var l = instituciones.length;
      var e;
      institucionRender.setInstitucionList(instituciones);
      institucionRender.list(institucionWrapper);
    });
  };
};
