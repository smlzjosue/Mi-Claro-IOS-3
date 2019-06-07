//
//  AES.m
//  Mi Claro
//
//  Created by Daniel Thompson on 8/7/13.
//
//

#import "AES.h"
#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>

#import <CommonCrypto/CommonCryptor.h>
#import "NSData+CommonCrypto.h"
#import "NSData+Base64.h"
#import "NSData+Conversion.h"

@implementation AES 

- (void)encryp:(CDVInvokedUrlCommand*)command
{	

    CDVPluginResult* pluginResult = nil;
    NSString* plainText = [command.arguments objectAtIndex:0 ];    
    NSData *data = [plainText dataUsingEncoding:NSASCIIStringEncoding];
    NSData *pass = [@"qcPQK9012G3G7DCt" dataUsingEncoding:NSASCIIStringEncoding];
    NSData *ivy = [@"4W4NtvbLf85vUTZ3" dataUsingEncoding:NSASCIIStringEncoding];
    CCCryptorStatus status = kCCSuccess;    
    
    NSData * encrypted = [data dataEncryptedUsingAlgorithm:kCCAlgorithmAES128 key:pass initializationVector:ivy options:kCCOptionPKCS7Padding error:&status];

    if (plainText != nil && [plainText length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[encrypted base64EncodedString]];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
