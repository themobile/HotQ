package org.apache.cordova.parseplugin;

//import java.util.Set;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
//import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

//import com.parse.Parse;
//    import com.parse.Parse;
import com.parse.ParseInstallation;
//    import com.parse.PushService;


public class ParsePlugin extends CordovaPlugin
    {
	    @Override
        public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
            if (action.equals("getInstallationId")) {
                this.getInstallationId(callbackContext);
                return true;
            }
            return false;
        }
	
        private void getInstallationId(final CallbackContext callbackContext) {
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    String installationId = ParseInstallation.getCurrentInstallation().getInstallationId();
                    callbackContext.success(installationId);
                }
            });
        }
}

