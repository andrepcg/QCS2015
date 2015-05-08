package server;

import javax.xml.namespace.QName;
import javax.xml.ws.Endpoint;
import java.util.HashMap;
import java.util.Map;

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

        String address = "http://0.0.0.0:8080/insulin/";
        /*
        Endpoint.publish(address, insulin);
        System.out.println("Webservices online at: " + address);
*/

        Map<String, Object> properties = new HashMap<String, Object>();

        properties.put(
                Endpoint.WSDL_PORT,
                new QName(
                        "http://www.yournamespace.com/",
                        "ExamplePort"));
        properties.put(
                Endpoint.WSDL_SERVICE,
                new QName(
                        "http://www.yournamespace.com/",
                        "insulin"));

        Endpoint endpoint = Endpoint.create(insulin);
        endpoint.setProperties(properties);
        Endpoint.publish(address, insulin);
        System.out.println("Webservices online at: " + address);
    }
}
