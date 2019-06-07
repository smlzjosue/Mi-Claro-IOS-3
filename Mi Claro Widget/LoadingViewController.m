//
//  LoadingViewController.m
//  MiClaro
//
//  Created by Daniel Thompson on 1/24/16.
//
//

#import "LoadingViewController.h"
#import <NotificationCenter/NotificationCenter.h>

@interface LoadingViewController ()

@end

@implementation LoadingViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.

    
    // change the size of the view
    //self.preferredContentSize = CGSizeMake(0, 310);
    if ([self.extensionContext respondsToSelector:@selector(setWidgetLargestAvailableDisplayMode:)]) { // iOS 10+
        [self.extensionContext setWidgetLargestAvailableDisplayMode:NCWidgetDisplayModeExpanded];
    } else {
        self.preferredContentSize = CGSizeMake(0, 310); // iOS 10-
    }
    
    // NSUserDefaults *defaults = [[NSUserDefaults alloc]
    //                             initWithSuiteName:@"group.com.claro.pr.MiClaro"];
    NSUserDefaults *defaults = [[NSUserDefaults alloc]
                                initWithSuiteName:@"group.com.todoclaro.miclaroapp.test"];
    
    NSString *login = [defaults stringForKey:@"login"];
    NSString *apiURL = [defaults stringForKey:@"api-url"];
    NSString *productType = [defaults stringForKey:@"productType"];
   
    login = [login substringWithRange:NSMakeRange(1, (login.length-2))];
    apiURL = [apiURL substringWithRange:NSMakeRange(1, (apiURL.length-2))];
    productType = [productType substringWithRange:NSMakeRange(1, (productType.length-2))];
    
    NSString* jsonRequest = [@"{\"token\":\"" stringByAppendingFormat:@"%@\" }",login];
    
    NSLog(@" ---------------- LOGIN = %@",login);
    NSLog(@" ---------------- API URL = %@",apiURL);
    NSLog(@" ---------------- PRODUCT TYPE = %@",jsonRequest);
    
    // 1
    NSURL *url = [NSURL URLWithString:apiURL];
    NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:config];
    
    // set url
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];

    // configure request parameters
    NSData *data = [jsonRequest dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
	NSString *postLength = [NSString stringWithFormat:@"%lu",(unsigned long)[data length]];
    [request setHTTPMethod:@"POST"];
    [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setValue:@"6af3982a-ce65-41a0-93d9-52bd172685cd" forHTTPHeaderField:@"api-key"];
    
    // send the content
    NSURLSessionUploadTask *uploadTask = [session uploadTaskWithRequest:request
       fromData:data completionHandler:^(NSData *data,NSURLResponse *response,NSError *error) {
       
           NSString* jsonResponse = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
           NSString* view = nil;
           
           if (login && apiURL && jsonResponse !=nil) {
               view = @"todayViewController";
           } else {
               view = @"loginViewController";
           }
           
           [defaults setObject:jsonResponse forKey:@"json-response-object"];
           [defaults synchronize];
           
           // fixed slow ui change
           dispatch_async(dispatch_get_main_queue(), ^{
               UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MiClaroWidget" bundle:nil];
               UIViewController *vc = [mainStoryboard instantiateViewControllerWithIdentifier:view];
               [self presentViewController:vc animated:YES completion:nil];
           });
       
       }];
    
    // 5
    [uploadTask resume];
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)widgetActiveDisplayModeDidChange:(NCWidgetDisplayMode)activeDisplayMode withMaximumSize:(CGSize)maxSize {
    if (activeDisplayMode == NCWidgetDisplayModeExpanded) {
        self.preferredContentSize = CGSizeMake(maxSize.width, 330.0);
    } else if (activeDisplayMode == NCWidgetDisplayModeCompact) {
        self.preferredContentSize = maxSize;
    }
}


/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
