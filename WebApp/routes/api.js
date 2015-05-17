var express = require('express');
var router = express.Router();

var wsdl_sources = ["http://localhost:8080/insulin/?wsdl",
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
    "http://qcs18.dei.uc.pt:8080/insulin?wsdl"];
//var wsdl_sources = ["http://liis-lab.dei.uc.pt:8080/Server?wsdl"];
var soap = require("../voter");
var NVoter = new soap(wsdl_sources);


router.get('/mealtime_insulin_dose', function(req, res, next) {

    var a1 = req.query.carbohydrateAmount;
    var a2 = req.query.carbohydrateToInsulinRatio;
    var a3 = req.query.preMealBloodSugar;
    var a4 = req.query.targetBloodSugar;
    var a5 = req.query.personalSensitivity;

    NVoter.getMealtimeInsulinDose(a1, a2, a3, a4, a5, function(r){
        res.json(r);
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


    NVoter.getPersonalSensitivityToInsulin(a1, a2, a3, function(r){
        res.json(r);
    });

});

module.exports = router;
