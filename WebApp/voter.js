/**
 * Created by Andr� on 30/04/2015.
 */


var soap = require('soap');
var util = require('util');
var async = require("async");
var util = require("util");

var timeout = 1000;

var func = function(client, apiMethodName, args, callback) {


    var clientURI = client.wsdl.uri;
    var start = Date.now();

    var fFunc = client[apiMethodName];

    //console.log(args);

    if (fFunc != "undefined") {

        fFunc(args, function (err, result) {

            if (result === undefined || result["_readableState"] != null)
                result = {return: null};

            result.responseTime = Date.now() - start;

            result.endpoint = clientURI;

            if (err) {
                if (err.code === 'ETIMEDOUT')
                    result.responseTime = 'TIMEOUT';
                return callback(null, result);
            }
            callback(null, result);

        }, {timeout: timeout});
    }
    else{
        console.error(clientURI);
    }


}


function Voter(wsdls){
    this.clients = [];

    var that = this;

    /*
    *   Create WDSL clients
     */
    wsdls.forEach(function(url){
        soap.createClient(url, function(err, client) {
            if (err)
                console.error(url, err);
            else
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
    };

    this.processResults = function(results, callback){

	    var f = {source: results};

	    f.result = this.majorityVoter(results);

	    callback(f);
	};

}

Voter.prototype.getBackgroundInsulinDose = function(bodyWeight, cb){
	var that = this;
    this.callNvoters("backgroundInsulinDose", {arg0: bodyWeight}, function(err, results){
        //if(err) console.log( err);

        that.processResults(results, function(processed){
            cb(processed);
        })
    });

};

Voter.prototype.getMealtimeInsulinDose = function(carbohydrateAmount, carbohydrateToInsulinRatio, preMealBloodSugar, targetBloodSugar, personalSensitivity, cb){
    var that = this;
    this.callNvoters("mealtimeInsulinDose", {arg0: carbohydrateAmount, arg1: carbohydrateToInsulinRatio, arg2: preMealBloodSugar, arg3: targetBloodSugar, arg4: personalSensitivity}, function(err, results){
        //if(err) console.log( err);

        that.processResults(results, function(processed){
            cb(processed);
        })
    });
};

Voter.prototype.getPersonalSensitivityToInsulin = function(physicalActivityLevel, physicalActivitySamples, bloodSugarDropSamples, cb){
    var that = this;
    this.callNvoters("personalSensitivityToInsulin", {arg0: physicalActivityLevel, arg1: physicalActivitySamples, arg2: bloodSugarDropSamples}, function(err, results){
        //if(err) console.log( err);

        that.processResults(results, function(processed){
            cb(processed);
        })
    });
};

Voter.prototype.processResults = function(results, callback){

    var f = {source: results};

    f.result = this.majorityVoter(results);

    callback(f);
};

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Voter.prototype.majorityVoter = function(results){

	//console.log(results);
    
    /*
    *   Calcula a moda (numero mais frequente)
    *   ignora o valor do proprio numero, tratando-o como uma string. a compara�ao � feita com base na igualdade dos caracteres
    */
    var freqs = {};
    var maxAgreements = 2;
    var res;
    var modas = [];


    for(var ret in results){
        var ret = results[ret];
        var valor = ret.return;
        if(valor != null && valor !== -1){
            freqs[valor] = (freqs[valor] || 0) + 1;

            if(freqs[valor] >= maxAgreements){

                if(freqs[valor] > maxAgreements)
                    modas = [];

                maxAgreements = freqs[valor];
                res = valor;
                if(modas.indexOf(valor) === -1)
                	modas.push(valor);
                
            }
        }
    }

    modas.sort();
    //console.log(modas)

    // se existirem pelo menos 3 valores identicos entao temos resultado
    if(modas.length === 1 && maxAgreements > 2)
        return res;
    //else if(modas.length > 1 && maxAgreements > 2)
    //    return modas[0];

    // Se nao existir acordo entre 3 votadores procurar numeros que distam da moda +-1 unidade (erros de arredondamento)
    // moda = existir pelo menos 2 concordancias
    if(maxAgreements > 1 && modas.length > 1){

        var maxG = maxAgreements;
        var finalR = modas[0];

        for(var z in modas){
            var curAgrees = maxAgreements;
            var moda = modas[z];

            for(var i in results){
                var valor = results[i].return;
                if(valor != null && valor != -1){
                    if(Math.abs(valor - moda) === 1)
                        curAgrees++;
                    
                }
            }

            if(curAgrees > maxG){
                if(moda < finalR)
                    finalR = moda;
                maxG = curAgrees;
            }

        }

        if(maxG > 2)
            return finalR;
        
    }



    return null;
};

module.exports = Voter;



