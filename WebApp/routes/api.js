var express = require('express');
var router = express.Router();

var wsdl_sources = [
    "http://liis-lab.dei.uc.pt:8080/Server?wsdl",
    "http://qcs01.dei.uc.pt:8080/InsulinDoseCalculator?wsdl",
    "http://qcs02.dei.uc.pt:8080/insulinDosage?wsdl",
    "http://qcs04.dei.uc.pt:8080/InsulinDoseCalculator?wsdl",
    "http://qcs05.dei.uc.pt:8080/insulin?wsdl",
    "http://qcs06.dei.uc.pt:8080/insulin?wsdl",
    "http://qcs07.dei.uc.pt:8080/insulin?wsdl",
    "http://qcs08.dei.uc.pt:8080/InsulinDoseCalculator?wsdl",
    "http://qcs09.dei.uc.pt:8080/Insulin?wsdl",
    "http://qcs10.dei.uc.pt:8080/InsulinDoseCalculator?wsdl",
    "http://qcs11.dei.uc.pt:8080/insulin/?wsdl",
    "http://qcs12.dei.uc.pt:8080/insulin?wsdl",
    "http://qcs13.dei.uc.pt:8080/insulin?wsdl",
    "http://qcs18.dei.uc.pt:8080/insulin?wsdl",
    "http://52.6.174.158:8082/insulin?wsdl"];

var soap = require("../voter");
var NVoter = new soap(wsdl_sources);

router.get("/history", function(req, res, next){
    res.json({
        physicalActivitySamples: req.session.physicalActivitySamples,
        bloodSugarDropSamples: req.session.bloodSugarDropSamples
    });
});


router.get('/mealtime_insulin_dose', function(req, res, next) {

    var session = req.session;

    var a1 = req.query.carbohydrateAmount;
    var a2 = req.query.carbohydrateToInsulinRatio;
    var a3 = req.query.preMealBloodSugar;
    var a4 = req.query.targetBloodSugar;
    //var a5 = req.query.personalSensitivity;

    var a6 = req.query.physicalActivitySamples;
    var a7 = req.query.bloodSugarDropSamples;
    var a8 = req.query.physicalActivityLevel;

    if(session.physicalActivitySamples == undefined){
        session.physicalActivitySamples = [];
        for (var i = 0, len = a6.length; i < len; i++)
            session.physicalActivitySamples.push(Number(a6[i]));
    }
    else{
        //session.physicalActivitySamples.push(a6);
        for (var i = 0, len = a6.length; i < len; i++)
            session.physicalActivitySamples.push(Number(a6[i]));
    }

    if(session.bloodSugarDropSamples == undefined){
        session.bloodSugarDropSamples = [];
        for (var i = 0, len = a7.length; i < len; i++)
            session.bloodSugarDropSamples.push(Number(a7[i]));
    }
    else{
        for (var i = 0, len = a7.length; i < len; i++)
            session.bloodSugarDropSamples.push(Number(a7[i]));
        //session.bloodSugarDropSamples.push(a7);
    }

    console.log(session.physicalActivitySamples);
    console.log(session.bloodSugarDropSamples);

    NVoter.getPersonalSensitivityToInsulin(a8, session.physicalActivitySamples, session.bloodSugarDropSamples, function(personalSensitivity){
        console.log("Personal activity level", a8)
        console.log("personalSensitivity", personalSensitivity.result);

        NVoter.getMealtimeInsulinDose(a1, a2, a3, a4, personalSensitivity.result, function(r){
            res.json(r);
        }); 
    });

    

});

router.get('/background_insulin_dose', function(req, res, next) {

    var a1 = req.query.bodyWeight;

    NVoter.getBackgroundInsulinDose(a1, function(r){
        res.json(r);
    });

});

router.get('/personal_sensitivity_insulin', function(req, res, next) {

    var a1 = req.query.physicalActivityLevel;
    var a2 = req.query.physicalActivitySamples;
    var a3 = req.query.bloodSugarDropSamples;
    
    a1 = parseInt(a1);
    a2 = a2.map(Number);
    a3 = a3.map(Number);


    NVoter.getPersonalSensitivityToInsulin(a1, a2, a3, function(r){
        res.json(r);
    });

});

module.exports = router;
