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

//
//  AppDelegate.m
//  MiClaro
//
//  Created by Daniel Thompson on 02/12/2018.
//  Copyright Claro Puerto Rico 2018. All rights reserved.
//

#import "AppDelegate.h"
#import "MainViewController.h"
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication*)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    self.viewController = [[MainViewController alloc] init];
    [Fabric with:@[[Crashlytics class]]];
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    
    if (!url) { return NO; }
    NSString* jsString = [NSString stringWithFormat:@"window.setTimeout(function(){ app.handleOpenURL(\"%@\"); }, 1)", [url host]];
    
    if ([self.viewController.webView isKindOfClass:[UIWebView class]]) {
        [(UIWebView*)self.viewController.webView stringByEvaluatingJavaScriptFromString:jsString];
    }
    
    // all plugins will get the notification, and their handlers will be  called
    [[NSNotificationCenter defaultCenter] postNotification:[NSNotification notificationWithName:CDVPluginHandleOpenURLNotification object:url]];
    
    return YES;
}

@end
