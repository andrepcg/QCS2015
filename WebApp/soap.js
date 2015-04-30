/**
 * Created by André on 30/04/2015.
 */


var soap = require('soap');
var util = require('util');
var async = require("async");

var func = function(client, apiMethodName, args, callback){

    client[apiMethodName](args, function(err, result) {
        if(err)
            return callback(null, null);
        callback(null, result);
    }, {timeout: 3000});


}

// TODO processar varios resultados dos nvoters
// TODO tem de retornar os resultados individuais de cada endpoint
var processResults = function(results, callback){
    results.forEach(function(ret){

    });

    callback(results);
};


function Voter (wsdls){
    this.clients = [];

    var that = this;

    wsdls.forEach(function(url){
        soap.createClient(url, function(err, client) {
            if (err) throw err;
            that.clients.push(client);
        });
    });

    this.callNvoters = function(apiMethodName, params, callback){
        var funcArray = [];

        that.clients.forEach(function(client){
            funcArray.push(function(cb){
                func(client, apiMethodName, params, cb);
            });
        });
        async.parallel(funcArray, callback);
    }

}

Voter.prototype.getBackgroundInsulinDose = function(bodyWeight, cb){
    this.callNvoters("backgroundInsulinDose", {arg0: bodyWeight}, function(err, results){
        //if(err) console.log( err);

        processResults(results, function(processed){
            cb(processed);
        })
    });

};

Voter.prototype.getMealtimeInsulinDose = function(carbohydrateAmount, carbohydrateToInsulinRatio, preMealBloodSugar, targetBloodSugar, personalSensitivity){
    callNvoters("mealtimeInsulinDose", {arg0: carbohydrateAmount, arg1: carbohydrateToInsulinRatio, arg2: preMealBloodSugar, arg3: targetBloodSugar, arg4: personalSensitivity});
};

Voter.prototype.getPersonalSensitivityToInsulin = function(physicalActivityLevel, physicalActivitySamples, bloodSugarDropSamples){
    callNvoters("personalSensitivityToInsulin", {arg0: physicalActivityLevel, arg1: physicalActivitySamples, arg2: bloodSugarDropSamples});
};


module.exports = Voter;



