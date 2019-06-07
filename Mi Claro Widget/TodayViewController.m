//
//  TodayViewController.m
//  Mi Claro Widget
//
//  Created by Daniel Thompson on 12/15/16.
//
//

#import "TodayViewController.h"
#import <NotificationCenter/NotificationCenter.h>
#import <QuartzCore/QuartzCore.h>
#import <math.h>

@interface TodayViewController () <NCWidgetProviding>

@property (weak, nonatomic) IBOutlet UIButton *myAccountBtn;
@property (weak, nonatomic) IBOutlet UIButton *invoiceBtn;
@property (weak, nonatomic) IBOutlet UIButton *chatBtn;
@property (weak, nonatomic) IBOutlet UILabel *balanceLabel;
@property (weak, nonatomic) IBOutlet UILabel *expireDateLabel;

@property (weak, nonatomic) IBOutlet UILabel *minConsumption;
@property (weak, nonatomic) IBOutlet UILabel *smsConsumption;
@property (weak, nonatomic) IBOutlet UILabel *dataConsumption;
@property (weak, nonatomic) IBOutlet UILabel *dataPlanLabel;
@property (weak, nonatomic) IBOutlet UIProgressView *progressBarConsumption;
@property (weak, nonatomic) IBOutlet UILabel *dataResumeLabel;

@end

@implementation TodayViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    
    // change the size of the view
    //self.preferredContentSize = CGSizeMake(0, 310);
    if ([self.extensionContext respondsToSelector:@selector(setWidgetLargestAvailableDisplayMode:)]) { // iOS 10+
        [self.extensionContext setWidgetLargestAvailableDisplayMode:NCWidgetDisplayModeExpanded];
    } else {
        self.preferredContentSize = CGSizeMake(0, 310); // iOS 10-
    }
    
    // fix progressbar height
    self.progressBarConsumption.transform = CGAffineTransformMakeScale(1.0, 6.0);
    
    self.myAccountBtn.layer.cornerRadius = 5;
    self.myAccountBtn.clipsToBounds = YES;
    
    self.invoiceBtn.layer.cornerRadius = 5;
    self.invoiceBtn.clipsToBounds = YES;
    
    self.chatBtn.layer.cornerRadius = 5;
    self.chatBtn.clipsToBounds = YES;
    
    // NSUserDefaults *defaults = [[NSUserDefaults alloc]
    //                             initWithSuiteName:@"group.com.claro.pr.MiClaro"];
    NSUserDefaults *defaults = [[NSUserDefaults alloc]
                                initWithSuiteName:@"group.com.todoclaro.miclaroapp.test"];
    // get values
    NSString* jsonResponse = [defaults stringForKey:@"json-response-object"];
    
    NSLog(@" json = %@", jsonResponse);
    
    // remove from the shared data
    [defaults removeObjectForKey:@"json-response-object"];
    [defaults synchronize];
    
    NSData *jsonData =  [jsonResponse dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error = nil;
    NSDictionary* jsonObject = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
    NSDictionary* result = nil;
    
    NSString* endDateStr = [defaults stringForKey:@"end-date"];
    //NSDate* currentDate = [NSDate date];
    NSDate* endDate = nil;
    
    // Convert string to date object
    NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
    [dateFormat setDateFormat:@"MM/dd/yyyy"];// here set format which you want...
    endDate = [dateFormat dateFromString:endDateStr];
    
    if ([jsonObject objectForKey:@"object"]) {
        
        result = [jsonObject objectForKey:@"object"];
        
        // balance label
        NSString* amount = [[result objectForKey:@"balance"] objectForKey:@"amount"];
        
        // expire label
        NSString* invoiceExpirationDate = [[result objectForKey:@"balance"] objectForKey:@"invoiceExpirationDate"];
        
        // endDate > currentDate
        // Remove cache support
        //if((endDateStr && [endDate compare: currentDate] == NSOrderedAscending) ||
        //    [defaults stringForKey:@"amount"] == nil) {
        
        self.balanceLabel.text = (amount != nil) ? [@"$" stringByAppendingFormat:@"%@", amount]: @" - ";
        self.expireDateLabel.text = (invoiceExpirationDate != nil) ? invoiceExpirationDate : @" - ";
        
        [defaults setObject:self.balanceLabel.text forKey:@"amount"];
        [defaults setObject:self.expireDateLabel.text forKey:@"invoice-expiration-date"];
        [defaults synchronize];
        
        /*
         } else {
         self.balanceLabel.text = [defaults stringForKey:@"amount"];
         self.expireDateLabel.text = [defaults stringForKey:@"invoice-expiration-date"];
         }
         */
        
        // minute consumption label
        NSString* min = [[result objectForKey:@"consumption"] objectForKey:@"voice"];
        self.minConsumption.text = (min !=nil) ? [min stringByAppendingFormat:@" Minutos Usados"] : @"0 Minutos Usados";
        
        // sms consumption label
        NSString* sms = [[result objectForKey:@"consumption"] objectForKey:@"sms"];
        self.smsConsumption.text = (sms != nil) ? [sms stringByAppendingFormat:@" SMS"] : @"0 SMS";
        
        if([[result objectForKey:@"balance"] objectForKey:@"invoiceExpirationDateComplete"]) {
            
            [defaults setObject:[[result objectForKey:@"balance"] objectForKey:@"invoiceExpirationDateComplete"] forKey:@"end-date"];
            [defaults synchronize];
            
        }
        
        
        // plan name
        if([result objectForKey:@"consumption"] &&
           [[[result objectForKey:@"consumption"] objectForKey:@"data"] objectForKey:@"plan"]) {
            
            // plan label
            self.dataPlanLabel.text = [[[result objectForKey:@"consumption"] objectForKey:@"data"] objectForKey:@"plan"];
        } else {
            self.dataPlanLabel.text = @" - ";
        }
        
        // progress bar data
        if ([[[result objectForKey:@"consumption"] objectForKey:@"data"] objectForKey:@"used"] &&
            [[[result objectForKey:@"consumption"] objectForKey:@"data"] objectForKey:@"total"]) {
            
            // total data label
            float used = [[[[result objectForKey:@"consumption"] objectForKey:@"data"] objectForKey:@"used"] floatValue];
            float total = [[[[result objectForKey:@"consumption"] objectForKey:@"data"] objectForKey:@"total"] floatValue];
            self.dataResumeLabel.text = [@"" stringByAppendingFormat:@" %@ de %@ Usados", [self readableFileSize:used], [self readableFileSize:total]];
            
            float usedData = used / total;
            
            // progress bar
            self.progressBarConsumption.progress = usedData;
        } else {
            
            // progress bar
            self.progressBarConsumption.progress = 0;
            
            self.dataResumeLabel.text = @" 0 de 0 Usados";
            
        }
        
        
        
    }
    
}

- (UIEdgeInsets)widgetMarginInsetsForProposedMarginInsets:(UIEdgeInsets)margins
{
    margins.bottom = 10.0;
    return margins;
}

- (id)initWithCoder:(NSCoder *)aDecoder {
    if (self = [super initWithCoder:aDecoder]) {
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(userDefaultsDidChange:)
                                                     name:NSUserDefaultsDidChangeNotification
                                                   object:nil];
    }
    return self;
}

- (void)userDefaultsDidChange:(NSNotification *)notification {
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)widgetPerformUpdateWithCompletionHandler:(void (^)(NCUpdateResult))completionHandler {
    // Perform any setup necessary in order to update the view.
    
    NSLog(@" **** Reload ****");
    UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MiClaroWidget" bundle:nil];
    UIViewController *vc = [mainStoryboard instantiateViewControllerWithIdentifier:@"loginViewController"];
    
    completionHandler(NCUpdateResultNewData);
    [self presentViewController:vc animated:YES completion:nil];
    
    
    // If an error is encountered, use NCUpdateResultFailed
    // If there's no update required, use NCUpdateResultNoData
    // If there's an update, use NCUpdateResultNewData
    
}

/*********
 * Utils
 **********/

- (NSString*)readableFileSize:(NSInteger)size {
    if (size <= 0) return @"0 MB";
    NSArray *units = @[ @"B", @"KB", @"MB", @"GB", @"TB"];
    NSInteger digitGroups = (int)(log10(size)/log10(1024));
    
    // number format precision
    int precision = (fmod((size/pow(1024,digitGroups)), 1.0) == 0.0) ? 0 : 2;
    
    return [[NSString stringWithFormat:@"%.*f", precision, (size/pow(1024,digitGroups))] stringByAppendingFormat:@"%@",units[digitGroups]];
}

/*********
 * Events
 **********/

- (IBAction)myAccountClick:(id)sender {
    NSLog( @" ------ account -----*" );
    NSURL *url = [NSURL URLWithString:@"miclaropr://account"];
    // Get "UIApplication" class name through ASCII Character codes.
    NSString *className = [[NSString alloc] initWithData:[NSData dataWithBytes:(unsigned char []){0x55, 0x49, 0x41, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E} length:13] encoding:NSASCIIStringEncoding];
    if (NSClassFromString(className)) {
        id object = [NSClassFromString(className) performSelector:@selector(sharedApplication)];
        [object performSelector:@selector(openURL:) withObject:url];
    }
    
}

- (IBAction)invoiceClick:(id)sender {
    NSLog( @" ------ invoice -----" );
    NSURL *url = [NSURL URLWithString:@"miclaropr://invoice"];
    // Get "UIApplication" class name through ASCII Character codes.
    NSString *className = [[NSString alloc] initWithData:[NSData dataWithBytes:(unsigned char []){0x55, 0x49, 0x41, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E} length:13] encoding:NSASCIIStringEncoding];
    if (NSClassFromString(className)) {
        id object = [NSClassFromString(className) performSelector:@selector(sharedApplication)];
        [object performSelector:@selector(openURL:) withObject:url];
    }
}

- (IBAction)chatClick:(id)sender {
    NSLog( @" ------ chat -----" );
    NSURL *url = [NSURL URLWithString:@"miclaropr://chat"];
    // Get "UIApplication" class name through ASCII Character codes.
    NSString *className = [[NSString alloc] initWithData:[NSData dataWithBytes:(unsigned char []){0x55, 0x49, 0x41, 0x70, 0x70, 0x6C, 0x69, 0x63, 0x61, 0x74, 0x69, 0x6F, 0x6E} length:13] encoding:NSASCIIStringEncoding];
    if (NSClassFromString(className)) {
        id object = [NSClassFromString(className) performSelector:@selector(sharedApplication)];
        [object performSelector:@selector(openURL:) withObject:url];
    }
}

- (void)widgetActiveDisplayModeDidChange:(NCWidgetDisplayMode)activeDisplayMode
                         withMaximumSize:(CGSize)maxSize {
    
    if (activeDisplayMode == NCWidgetDisplayModeExpanded) {
        self.preferredContentSize = CGSizeMake(maxSize.width, 330.0);
    } else if (activeDisplayMode == NCWidgetDisplayModeCompact) {
        self.preferredContentSize = maxSize;
    }
}

@end


