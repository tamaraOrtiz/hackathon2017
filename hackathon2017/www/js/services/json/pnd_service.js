var PndService = function() {

    var url;
    var all_pnd= "/sql?q=SELECT%20distinct%20plan_nombre%20FROM%20pnd_meta_fisica";
    this.initialize = function(serviceURL) {
        url = serviceURL ? serviceURL : "http://geo.stp.gov.py/user/stp/api/v2/";
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
    }

    this.getPND = function(id) {
        return $.ajax({url: url + all_pnd });
    }

    this.findByName = function(searchKey) {
        return $.ajax({url: url+"?"+searchKey});
    }
};
