//
//  Information.h
//  MiClaroPlugin
//
//  Created by Daniel Thompson on 6/23/14.
//
//

#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>

@interface MiClaroPlugin : CDVPlugin

extern const NSString *IV_SALT;

- (void)build:(CDVInvokedUrlCommand*)command;
- (void)version:(CDVInvokedUrlCommand*)command;
- (void)sendPaymentInfo:(CDVInvokedUrlCommand*)command;
- (void)sendPostForm:(CDVInvokedUrlCommand*)command;
- (NSString *) encrypt:(NSString *)text salt:(NSString *)salt;

@end
