var NivelService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://geo.stp.gov.py/user/stp/api/v2/sql";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.getMetaById = function(entidad_id, nivel_id) {
        return $.ajax({url: url + "?q=SELECT eje_estrategico_id, eje_estrategico_nombre, linea_transversal_id, linea_transversal_nombre, estrategia_id, estrategia_nombre, objetivo_estrategico_id, objetivo_estrategico_nombre, resultado_esperado_id, resultado_esperado_nombre, prod_id, producto_nombre, cant_destinatarios FROM public.pnd_destinatarios WHERE entidad_id = " + entidad_id + " AND nivel_id = "+ nivel_id +" ORDER BY eje_estrategico_nombre ASC, linea_transversal_nombre ASC, estrategia_nombre ASC, objetivo_estrategico_nombre ASC"});
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url + "?name=" + searchKey});
    }

    this.findAll = function(conditions) {
    var where = conditions !== undefined ? "WHERE "+conditions : "";
      return $.ajax({ url: url + "?q=SELECT nivel_id, nivel_nombre, COUNT(DISTINCT entidad_id) FROM public.destinatarioproducto "+where+" GROUP BY nivel_id, nivel_nombre ORDER BY nivel_id ASC ;" });
    }

};
