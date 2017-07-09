/* 
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com  
*/
var DerpatamentoRender = function () {
  var departamento, departamentoList;
  //var showTemplate  = Handlebars.compile($("#institucion-show-tpl").html());
  var listTemplate  = Handlebars.compile($("#menu-list-tpl").html());
  var pdd_service = new PDDService();

  this.setInstitucionList = function (objectList) {
    departamentoList = objectList;
  };

  this.show = function (wrapper) {
    wrapper.html(avanceListTpl({institucion: institucion}));
  }

  this.list = function (wrapper) {
    pdd_service.initialize();
    pdd_service.getDepartamentos().done(function (result) {
      var departamentos = result.rows;
      var l = departamentos.length;
      var e;
      wrapper.html(listTemplate({departamentoList: departamentos}));
    });
    
  };

};
