/*
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com
*/
var InstitucionService = function() {

  var url;

  this.initialize = function(serviceURL) {
    url = serviceURL ? serviceURL : "http://geo.stp.gov.py/user/stp/api/v2/sql";
    var deferred = $.Deferred();
    deferred.resolve();
    return deferred.promise();
  }

  this.getResumenPrograma = function(nivel_id, entidad_id, conditions) {
    var where = "WHERE nivel_id = '"+nivel_id+"' AND entidad_id = '"+entidad_id+"'";
    where = conditions !== undefined ? where+" AND "+conditions : where;
    return $.ajax({url: url + "?q=SELECT programa_nombre, programa_id, tipo_presupuesto_id, tipo_presupuesto_nombre, SUM(CAST(cantidad as NUMERIC(9, 2))) as cantidad_total FROM public.destinatarioproducto "+where+" GROUP BY tipo_presupuesto_id, tipo_presupuesto_nombre, programa_id, programa_nombre ORDER BY tipo_presupuesto_id ASC, programa_id ASC;"})
  }

  this.getMetaById = function(entidad_id, nivel_id) {
    return $.ajax({url: url + "?q=SELECT eje_estrategico_id, eje_estrategico_nombre, linea_transversal_id, linea_transversal_nombre, estrategia_id, estrategia_nombre, objetivo_estrategico_id, objetivo_estrategico_nombre, resultado_esperado_id, resultado_esperado_nombre, prod_id, producto_nombre, cant_destinatarios FROM public.pnd_destinatarios WHERE entidad_id = " + entidad_id + " AND nivel_id = "+ nivel_id +" ORDER BY eje_estrategico_nombre ASC, linea_transversal_nombre ASC, estrategia_nombre ASC, objetivo_estrategico_nombre ASC"});
  }

  this.findByName = function(searchKey) {
    return $.ajax({url: url + "?name=" + searchKey});
  }

  this.findAll = function(conditions) {
    var where = conditions !== undefined ? " WHERE "+conditions : "";
    return $.ajax({ url: url + "?q=SELECT DISTINCT nivelid, entidadid, nombre FROM public.instituciones "+where+" ORDER BY nombre ASC LIMIT 20;" })
  }

};