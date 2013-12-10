/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.themobile.hotq;

import android.os.Bundle;
import org.apache.cordova.*;
import com.parse.Parse;
import com.parse.ParseAnalytics;
import com.parse.ParseInstallation;
import com.parse.PushService;


public class hotq extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        // Set by <content src="index.html" /> in config.xml
        super.loadUrl(Config.getStartUrl(),3000);
        //super.loadUrl("file:///android_asset/www/index.html")

        Parse.initialize(this, "oYvsd9hx0NoIlgEadXJsqCtU1PgjcPshRqy18kmP", "1vjxiu0XYXEFf0FPrXwN6uyog233oswadPI7U5S2");
        PushService.setDefaultPushCallback(this, hotq.class);
        PushService.subscribe(this, "", hotq.class);
        ParseInstallation.getCurrentInstallation().saveInBackground();
        ParseAnalytics.trackAppOpened(getIntent());

     }
}


