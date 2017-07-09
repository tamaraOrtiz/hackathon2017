/* 
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com  
*/
var BasicServicesListService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "https://datos.mec.gov.py/data/servicios_basicos_lista.json";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/?codigo_establecimiento" + id});
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url + "?form_buscar_servicios_basicos[periodo]=" + searchKey});
    }


}
