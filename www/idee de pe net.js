import android.content.Context;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParseInstallation;
import com.parse.PushService;

public class MainApplication extends Application {
    private static MainApplication instance = new MainApplication();

    public MainApplication() {
        instance = this;
    }

    public static Context getContext() {
        return instance;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Parse.initialize(this, <PARSE_APPLICATION_ID>, <PARSE_CLIENT_KEY>);
        PushService.setDefaultPushCallback(this, <MainAppClass>.class);
            PushService.subscribe(this, "MainChannel", <MainAppClass>.class);
                ParseInstallation.getCurrentInstallation().saveInBackground();
                }
                }