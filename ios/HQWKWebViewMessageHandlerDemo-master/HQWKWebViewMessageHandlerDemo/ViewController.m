//
//  ViewController.m
//  WKWebViewMessageHandlerDemo
//
//  Created by mac on 2019/12/9.
//  Copyright © 2019 mac. All rights reserved.
//

 
#import "ViewController.h"
#import <WebKit/WebKit.h>
#import "WKWebViewController.h"
@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    button.frame = CGRectMake(30, 100, 250, 30);
    button.backgroundColor = [UIColor cyanColor];
    [button setTitle:@"WKWebViewMessageHandler" forState:UIControlStateNormal];
    [button addTarget:self action:@selector(buttonAction:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:button];
    NSLog(@"123456789");
    
}

- (void)buttonAction:(id)sender
{
    WKWebViewController *webController = [[WKWebViewController alloc] init];
    [self.navigationController pushViewController:webController animated:YES];
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
