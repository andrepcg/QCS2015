package server;
import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.xml.ws.Endpoint;
import java.util.Random;

/**
 * Created by joni on 11/04/15.
 */
@WebService()
public class Insulin implements InsulinDoseCalculator {

    @Override
    @WebMethod
    /**
     * @param carbohydrateAmount
     * @param carbohydrateToInsulinRatio
     * @param preMealBloodSugar
     * @param targetBloodSugar
     * @param personalSensitivity
     * @return the number of units of rapid acting insulin needed after a meal (i.e., bolus insulin replacement dose).
     */
    public int mealtimeInsulinDose(int carbohydrateAmount, int carbohydrateToInsulinRatio, int preMealBloodSugar, int targetBloodSugar, int personalSensitivity) {
        try {
            if(targetBloodSugar > preMealBloodSugar)
                return 0;

            double hbloodSugar = (double)(preMealBloodSugar - targetBloodSugar) / personalSensitivity;

            double carbDose = carbohydrateAmount / carbohydrateToInsulinRatio / personalSensitivity * 50;

            return (int)(hbloodSugar + carbDose);
        }catch (Exception e ){
            return -1;
        }
    }

    @Override
    @WebMethod
    /**
     * @param bodyWeight
     * @return Background insulin dose
     */
    public int backgroundInsulinDose(int bodyWeight) {
        try {
            return (int)Math.ceil((bodyWeight * 0.55) / 2);
        }catch (Exception e){
            return -1;
        }
    }

    @Override
    @WebMethod
    /**
     * @param physicalActivityLevel
     * @param physicalActivitySamples
     * @param bloodSugarDropSamples
     * @return the drop in blood sugar resulting from one unit of insulin, in mg/dl.
     */
    public int personalSensitivityToInsulin(int physicalActivityLevel, int[] physicalActivitySamples, int[] bloodSugarDropSamples) {
        try{
            if ( physicalActivitySamples.length > 10 && physicalActivitySamples.length != bloodSugarDropSamples.length)
                throw new Exception();

            int n = physicalActivitySamples.length;
            double Sx = 0;
            double Sy = 0 ;
            double Sxx = 0;
            double Syy = 0;
            double Sxy = 0;

            for (int i = 0; i < physicalActivitySamples.length; i++){
                Sx += physicalActivitySamples[i];
                Sy += bloodSugarDropSamples[i];
                Sxx += physicalActivitySamples[i] * physicalActivitySamples[i];
                Syy += bloodSugarDropSamples[i] * bloodSugarDropSamples[i];
                Sxy += physicalActivitySamples[i] * bloodSugarDropSamples[i];
            }

            double beta = (n * Sxy - Sx * Sy) / (n * Sxx - Sx * Sx);
            double alpha = (1.0 / n) * Sy - beta * (1.0 / n) * Sx;


            return (int)(alpha + beta * physicalActivityLevel);

        }catch (Exception e){
            return -1;
        }
    }
}
