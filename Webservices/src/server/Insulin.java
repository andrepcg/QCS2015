package server;
import javax.jws.WebMethod;
import javax.jws.WebService;
import javax.xml.ws.Endpoint;

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
            int hbloodSugar = (preMealBloodSugar - targetBloodSugar) / personalSensitivity;

            int carbDose = carbohydrateAmount / ((carbohydrateToInsulinRatio * 50) / 12);

            return hbloodSugar + carbDose;
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
            return (int)(bodyWeight * 0.55)/2;
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
            int sumP = 0;
            int sumB = 0 ;
            int sumPP = 0;
            //int sumBB = 0;
            int sumPB = 0;

            for (int i = 0; i<physicalActivitySamples.length; i++){
                sumP += physicalActivitySamples[i];
                sumB += bloodSugarDropSamples[i];
                sumPP += Math.pow(physicalActivitySamples[i], 2);
                sumPP += Math.pow(bloodSugarDropSamples[i], 2);
                sumPB += physicalActivitySamples[i]*bloodSugarDropSamples[i];
            }

            double beta = (n * sumPB - sumP*sumB)/(n*sumPP - Math.pow(sumP,2));
            double alpha = (1/n)*sumB - beta*(1/n)*sumP;


            return (int)(alpha + beta * physicalActivityLevel);

        }catch (Exception e){
            return -1;
        }
    }
}
