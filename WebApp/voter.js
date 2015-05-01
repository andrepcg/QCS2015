/**
 * Created by Andr� on 30/04/2015.
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
    
    /*
    *   Calcula a moda (numero mais frequente)
    *   ignora o valor do proprio numero, tratando-o como uma string. a compara�ao � feita com base na igualdade dos caracteres
    */
    var freqs = {};
    var maxAgreements = 0;
    var res;

    console.log(typeof results[0].return);

    for(var ret in results){
        var ret = results[ret];
        if(ret.return !== null){

            freqs[ret.return] = (freqs[ret.return] || 0) + 1;
            if(freqs[ret.return] > maxAgreements){
                maxAgreements = freqs[ret.return];
                res = ret.return;
            }
        }
    }

    //res = parseFloat(res);

    // se existirem pelo menos 3 valores identicos entao temos resultado
    if(maxAgreements > 2)
        return res;

    // Se nao existirem acordo entre 3 votadores procurar numeros que distam da moda +-1 unidade (erros de arredondamento)
    if(maxAgreements === 2){
        for(var i in results){
            var valor = results[i].return;
            if(Math.abs(valor - res) === 1){
                maxAgreements++;
            }
        }
    }

    if(maxAgreements > 2)
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



