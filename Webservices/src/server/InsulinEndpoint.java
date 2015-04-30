package server;

import javax.xml.ws.Endpoint;

/**
 * Created by joni on 11/04/15.
 */
public class InsulinEndpoint {

    public static void main(String[] argv) {
        System.setProperty("com.sun.xml.ws.transport.http.client.HttpTransportPipe.dump", "true");
        System.setProperty("com.sun.xml.internal.ws.transport.http.client.HttpTransportPipe.dump", "true");
        System.setProperty("com.sun.xml.ws.transport.http.HttpAdapter.dump", "true");
        System.setProperty("com.sun.xml.internal.ws.transport.http.HttpAdapter.dump", "true");

        Insulin insulin = new Insulin ();
        String address = "http://localhost:8081/insulin/";
        Endpoint.publish(address, insulin);
        System.out.println("Webservices online at: " + address);

        System.out.println(insulin.mealtimeInsulinDose(60, 12, 200, 100, 25));
    }
}
