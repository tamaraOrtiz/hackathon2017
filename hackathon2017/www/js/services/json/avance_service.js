/* 
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com  
*/
var AvanceService = function() {

    var url;

    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://geo.stp.gov.py/user/stp/api/v2/sql";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.findById = function(id) {
        return $.ajax({url: url + "/" + id});
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url + "?name=" + searchKey});
    }

    this.findAll = function() {
      return $.ajax({ url: url + "?q=SELECT * FROM avance LIMIT 20;" })
    }


}
