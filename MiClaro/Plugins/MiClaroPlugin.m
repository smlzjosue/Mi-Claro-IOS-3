//
//  MiClaroPlugin.m
//  MiClaro
//
//  Created by Daniel Thompson on 6/23/14.
//
//

#import "MiClaroPlugin.h"
#import "CJSONDeserializer.h"
#import "AES.h"
#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>

#import <CommonCrypto/CommonCryptor.h>
#import "NSData+CommonCrypto.h"
#import "NSData+Base64.h"
#import "NSData+Conversion.h"


@implementation MiClaroPlugin

NSString * IV_SALT=@"123456";

- (void)build:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString*	version = nil;
    
    version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:version];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)version:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString*	version = nil;
    
    version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:version];

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)sendPaymentInfo:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSDictionary* response = nil;

    // The URL of the Webserver
	NSString* url = [command.arguments objectAtIndex:0 ];
    
    NSString* jsonStr = [command.arguments objectAtIndex:1 ];
    NSData* jsonData = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];
    NSError *failure;
    NSMutableDictionary *resJSON = [[NSMutableDictionary alloc] init];
    NSDictionary *json = [NSJSONSerialization JSONObjectWithData:jsonData
                                                                 options:kNilOptions
                                                                   error:&failure];
	@try {
    
        // Adding tu mutable dictionary
        [resJSON addEntriesFromDictionary:json];
        [resJSON setObject:[self encrypt:[json objectForKey:@"cardNum"] salt:IV_SALT] forKey:@"cardNum"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"expDate"] salt:IV_SALT] forKey:@"expDate"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"nameOnCard"] salt:IV_SALT] forKey:@"nameOnCard"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"amount"] salt:IV_SALT] forKey:@"amount"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"zip"] salt:IV_SALT] forKey:@"zip"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"street"] salt:IV_SALT] forKey:@"street"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"cvNum"] salt:IV_SALT] forKey:@"cvNum"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"street"] salt:IV_SALT] forKey:@"street"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"accountNumber"] salt:IV_SALT] forKey:@"accountNumber"];
        [resJSON setObject:[self encrypt:[json objectForKey:@"pcrftransaID"] salt:IV_SALT] forKey:@"pcrftransaID"];
       
        //NSString *post = json;
        NSData *postData = [NSJSONSerialization dataWithJSONObject:resJSON
                                                           options:0
                                                             error:&failure];
        
        NSString *postLength = [NSString stringWithFormat:@"%lu",(unsigned long)[postData length]];
        
        NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
        [request setURL:[NSURL URLWithString:url]];

        // http parameters
        [request setHTTPMethod:@"POST"];
        [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setHTTPBody:postData];
        NSLog(@" Before conection");
        NSURLConnection *connection;
        connection = [[NSURLConnection alloc]initWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:url]] delegate:self];
        NSLog(@" ******* conection ******* %@", url);
        

        NSData *returnData = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:nil];
        NSLog(@" ******* conection past *******");
        if(connection) {
            // response json
            response = @{ @"message": @"Success",
                                        @"error": @"false",
                                        @"response": [NSJSONSerialization JSONObjectWithData:returnData
                                                          options:NSJSONReadingAllowFragments
                                                            error:NULL]};
            jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:nil];
            NSString* jsonString = [[NSString alloc] initWithBytes:[jsonData bytes] length:[jsonData length] encoding:NSUTF8StringEncoding];

            // return value
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jsonString];
        } else {
            // response json
            response = @{ @"message": @"Disculpe hubo un error tratando de realizar el pago, por favor intente nuevamente",
                                        @"error": @"true",
                                        @"response" : [NSJSONSerialization JSONObjectWithData:returnData
                                                                        options:NSJSONReadingAllowFragments
                                                                          error:NULL]};
            jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:nil];
            NSString* jsonString = [[NSString alloc] initWithBytes:[jsonData bytes] length:[jsonData length] encoding:NSUTF8StringEncoding];

            // return value
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jsonString];
        }
    }
    @catch (NSException *exception) {
    	NSLog(@" ******* Exceptiom *******");
    
        // response json
        response = @{ @"message": @"Disculpe hubo un error tratando de realizar el pago, por favor intente nuevamente",
                      @"error": @"true",
                      @"response" : @""};
        jsonData = [NSJSONSerialization dataWithJSONObject:response options:0 error:nil];
        NSString* jsonString = [[NSString alloc] initWithBytes:[jsonData bytes] length:[jsonData length] encoding:NSUTF8StringEncoding];
        
        // return value
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:jsonString];
        
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)sendPostForm:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* url = [command.arguments objectAtIndex:0 ];
    //NSString* json = [command.arguments objectAtIndex:1 ];
    NSString* json = [NSString stringWithFormat:@"%@", [command.arguments objectAtIndex:1] ];
    NSLog(@"url = %@", url);
    NSLog(@"parameters =  %@", json);
    
    //NSString *post = json;
    NSData *postData = [json dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
    NSString *postLength = [NSString stringWithFormat:@"%lu",(unsigned long)[postData length]];
    
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    [request setURL:[NSURL URLWithString:url]];
    
    // http parameters
    [request setHTTPMethod:@"POST"];
    [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:postData];
    
    NSURLConnection *connection; //= [[NSURLConnection alloc]initWithRequest:request delegate:self];
    connection = [[NSURLConnection alloc]initWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:url]] delegate:self];
    NSData *returnData = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:nil];
    NSString* returnString = [[NSString alloc] initWithData:returnData encoding:NSUTF8StringEncoding];
    
    if(connection) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:returnString];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:returnString];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (NSString*)encrypt:(NSString *)text salt:(NSString *)salt
{

    NSString* plainText = text;
    NSData *data = [plainText dataUsingEncoding:NSASCIIStringEncoding];
    NSData *pass = [salt dataUsingEncoding:NSASCIIStringEncoding];
    CCCryptorStatus status = kCCSuccess;
    
    NSData * encrypted = [data dataEncryptedUsingAlgorithm:kCCAlgorithmAES128 key:pass initializationVector:pass options:kCCOptionPKCS7Padding error:&status];
    
    if (plainText != nil && [plainText length] > 0) {
        plainText = [encrypted base64EncodedString];
    }

	return plainText;
}

@end
