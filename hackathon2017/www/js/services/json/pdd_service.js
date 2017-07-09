var PDDService = function() {

    var url;
    var all_departamentos= "/sql?q=SELECT%20distinct%20dpto%20dpto,dpto_desc%20FROM public.planes_desarrollo_departamental";
    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://geo.stp.gov.py:80/user/stp/api/v2";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.getDepartamentos = function() {
        return $.ajax({url: url + all_departamentos });
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url+"?"+searchKey});
    }


}
