package server;

import javax.xml.ws.Endpoint;

/**
 * Created by joni on 11/04/15.
 */
public class InsulinEndpoint {

    public static void main(String[] argv) {
        Insulin insulin = new Insulin ();
        String address = "http://localhost:8081/insulin";
        Endpoint.publish(address, insulin);
    }
}
