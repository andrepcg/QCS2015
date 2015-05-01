/**
 * Created by André on 30/04/2015.
 */


var soap = require('soap');
var util = require('util');
var async = require("async");
var util = require("util");

var func = function(client, apiMethodName, args, callback){

    //console.log(util.inspect(client, { showHidden: false, depth: null, colors: true }));
    var clientURI = client.wsdl.uri;

    client[apiMethodName](args, function(err, result) {
        //console.log(result)
        if(result === undefined)
            result = {return: null};

        result.endpoint = clientURI;

        if(err)
            return callback(null, result);

        callback(null, result);

    }, {timeout: 3000});


}


var processResults = function(results, callback){

    var f = {source: results};

    f.result = majorityVoter(results);

    callback(f);
};

// TODO nao fazer comparacao caracter a caracter
var majorityVoter = function(results){
    var o = {};
    var availableRes = 0;
    results.forEach(function(ret){
        if(ret.return !== null) {
            availableRes++;
            if(o.hasOwnProperty(ret.return))
                o[ret.return]++;
            else
                o[ret.return] = 1;
        }
    });
    var max = 0;
    var res;
    for (var key in o) {
        if (o.hasOwnProperty(key)) {
            if(o[key] > max){
                max = o[key];
                res = key;
            }
        }
    }

    if(availableRes > 2)
        return res;

    return null;
}


function Voter(wsdls){
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

Voter.prototype.getMealtimeInsulinDose = function(carbohydrateAmount, carbohydrateToInsulinRatio, preMealBloodSugar, targetBloodSugar, personalSensitivity, cb){
    this.callNvoters("mealtimeInsulinDose", {arg0: carbohydrateAmount, arg1: carbohydrateToInsulinRatio, arg2: preMealBloodSugar, arg3: targetBloodSugar, arg4: personalSensitivity}, function(err, results){
        //if(err) console.log( err);

        processResults(results, function(processed){
            cb(processed);
        })
    });
};

Voter.prototype.getPersonalSensitivityToInsulin = function(physicalActivityLevel, physicalActivitySamples, bloodSugarDropSamples, cb){
    this.callNvoters("personalSensitivityToInsulin", {arg0: physicalActivityLevel, arg1: physicalActivitySamples, arg2: bloodSugarDropSamples}, function(err, results){
        //if(err) console.log( err);

        processResults(results, function(processed){
            cb(processed);
        })
    });
};


module.exports = Voter;



