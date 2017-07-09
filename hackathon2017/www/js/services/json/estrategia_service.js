/* 
Autores: Tamara Ortiz y Ruben Bordon
Correo: tamara.tfs@gmail.com bordonwork@gmail.com  
*/
var StrategyService = function() {
    var url;
    var all_strategy= "/sql?q=SELECT%20eje_estrategico_id,eje_estrategico_nombre%20FROM%20pnd_meta_fisica";
    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://geo.stp.gov.py/user/stp/api/v2/";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.getStrategiesByPNDId = function(id) {
        return $.ajax({url: url + all_strategy + "%20where%20plan_id%20=%20%271%27" });
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url+"?"+searchKey});
    }


}
