package server;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;


public class InsulinTest {

    private Insulin insulin;

    @Before
    public void setUp() throws Exception {
        insulin = new Insulin();
    }

    @Test
    public void testMealtimeInsulinDose() throws Exception {
                assertEquals(8, insulin.mealtimeInsulinDose(120, 14, 170, 100, 60));
        assertEquals(14, insulin.mealtimeInsulinDose(60, 12, 200, 100, 25));
        assertEquals(0, insulin.mealtimeInsulinDose(95, 10, 100, 120, 50));

    }

    @Test
    public void testBackgroundInsulinDose() throws Exception {
        assertEquals(22, insulin.backgroundInsulinDose(79));
    }

    @Test
    public void testPersonalSensitivityToInsulin() throws Exception {

        assertEquals(50, insulin.personalSensitivityToInsulin(5, new int[]{0, 10}, new int[]{50, 50}));
        assertEquals(66, insulin.personalSensitivityToInsulin(6, new int[]{2, 8}, new int[]{32, 83}));
        assertEquals(53, insulin.personalSensitivityToInsulin(4, new int[]{1, 6, 8, 9}, new int[]{32, 61, 91, 88}));
        assertEquals(30, insulin.personalSensitivityToInsulin(0, new int[]{1, 3, 10}, new int[]{33, 43, 70}));
    }
}
