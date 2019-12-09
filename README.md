文章目录

一、 WKWebView的代理方法

1.WKNavigationDelegate

2.WKUIDelegate

3.WKScriptMessageHandler

二、WKWebView加载JS

1.首先需要引入WebKit库

3.创建WKWebView

4.实现协议方法

5.HTML文件中JS调用代码

6.OC调用JS

总结：

WKWebView新特性

在开发过程中，iOS 中实现加载 web 页面主要有两种控件，UIWebView 和 WKWebview，两种控件对应具体的实现方法不同。WKWebView是苹果公司在iOS8系统推出的，这里我们主要概述WebKit中更新的WKWebView控件的新特性与使用方法。

一、 WKWebView的代理方法

1.WKNavigationDelegate

该代理提供的方法，可以用来追踪加载过程（页面开始加载、加载完成、加载失败）、决定是否执行跳转。

// 页面开始加载时调用

-(void)webView:(WKWebView *)webView didStartProvisionalNavigation:(WKNavigation *)navigation;

// 当内容开始返回时调用

- (void)webView:(WKWebView *)webView didCommitNavigation:(WKNavigation *)navigation;

// 页面加载完成之后调用

-(void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation;

// 页面加载失败时调用

-(void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation;



页面跳转的代理方法有三种，分为（收到跳转与决定是否跳转两种）：

// 接收到服务器跳转请求之后调用

-(void)webView:(WKWebView *)webView didReceiveServerRedirectForProvisionalNavigation:(WKNavigation *)navigation;

// 在收到响应后，决定是否跳转

-(void)webView:(WKWebView *)webView decidePolicyForNavigationResponse:(WKNavigationResponse *)navigationResponse decisionHandler:(void (^)(WKNavigationResponsePolicy))decisionHandler;

// 在发送请求之前，决定是否跳转

-(void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler;

2.WKUIDelegate

//创建一个新的webView

  -(WKWebView**)webView:(WKWebView***)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration forNavigationAction:(WKNavigationAction *)navigationAction windowFeatures:(WKWindowFeatures *)windowFeatures;

下面代理方法全都是与界面弹出提示框相关的，针对于web界面的三种提示框（警告框、确认框、输入框）分别对应三种代理方法。下面只列举了警告框的方法。

-(void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(void (^)())completionHandler;

3.WKScriptMessageHandler

// 从web界面中接收到一个脚本时调用

  -(void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message;

二、WKWebView加载JS

NSString *js = @"";

// 根据JS字符串初始化WKUserScript对象

WKUserScript *script = [[WKUserScript alloc] initWithSource:js injectionTime:WKUserScriptInjectionTimeAtDocumentEnd forMainFrameOnly:YES];

// 根据生成的WKUserScript对象，初始化WKWebViewConfiguration

WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];

[config.userContentController addUserScript:script];

下面开始进入正题

1.首先需要引入WebKit库

  #import <WebKit/WebKit.h>

#####2.MessageHandler

创建WKWebViewConfiguration，配置各个API对应的MessageHandler

WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];

WKUserContentController *userContentController = [[WKUserContentController alloc] init];

[userContentController addScriptMessageHandler:self name:@"Share"];

[userContentController addScriptMessageHandler:self name:@"Camera"];

configuration.userContentController = userContentController;

WKPreferences *preferences = [WKPreferences new];

preferences.javaScriptCanOpenWindowsAutomatically = YES;

preferences.minimumFontSize = 40.0;

configuration.preferences = preferences;

3.创建WKWebView

//loadFileURL方法通常用于加载服务器的HTML页面或者JS，而loadHTMLString通常用于加载本地HTML或者JS

NSString *htmlPath = [[NSBundle mainBundle] pathForResource:@"WKWebViewMessageHandler" ofType:@"html"];

NSString *fileURL = [NSString stringWithContentsOfFile:htmlPath encoding:NSUTF8StringEncoding error:nil];

NSURL *baseURL = [NSURL fileURLWithPath:htmlPath];

[self.webView loadHTMLString:fileURL baseURL:baseURL];

self.webView.UIDelegate = self;

[self.view addSubview:self.webView];



4.实现协议方法

#pragma mark -- WKScriptMessageHandler

-(void)userContentController:(WKUserContentController *)userContentController didReceiveScriptMessage:(WKScriptMessage *)message

{

//JS调用OC方法

//message.boby就是JS里传过来的参数

NSLog(@"body:%@",message.body);

if ([message.name isEqualToString:@"Share"]) {

    [self ShareWithInformation:message.body];



} else if ([message.name isEqualToString:@"Camera"]) {

    [self camera];

}

}



WKScriptMessage有两个关键属性name 和 body。因为我们给每一个OC方法取了一个name，所以就可以根据name 来区分执行不同的方法。body 中存着JS 要给OC 传的参数。

#pragma mark - Method

-(void)ShareWithInformation:(NSDictionary *)dic

{

if (![dic isKindOfClass:[NSDictionary class]]) {

    return;

}

NSString *title = [dic objectForKey:@"title"];

NSString *content = [dic objectForKey:@"content"];

NSString *url = [dic objectForKey:@"url"];

//在这里写分享操作的代码

NSLog(@"要分享了哦?");

//OC反馈给JS分享结果

NSString *JSResult = [NSString stringWithFormat:@"shareResult('%@','%@','%@')",title,content,url];

//OC调用JS

[self.webView evaluateJavaScript:JSResult completionHandler:^(id _Nullable result, NSError * _Nullable error) {

    NSLog(@"%@", error);

}];

}

-(void)camera

{

//在这里写调用打开相册的代码

[self selectImageFromPhotosAlbum];

}

5.HTML文件中JS调用代码

<!DOCTYPE html>

<html>

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf8">

        <script language="javascript">

        //JS执行window.webkit.messageHandlers.Share.postMessage(<messageBody>)

        function shareClick() {

            window.webkit.messageHandlers.Share.postMessage({title:'测试分享的标题',content:'测试分享的内容',url:'https://github.com/maying1992'});

        }



        //分享回调结果显示

        function shareResult(channel_id,share_channel,share_url) {

            var content = channel_id+","+share_channel+","+share_url;

            alert(content);

            document.getElementById("returnValue").value = content;

        }



        //JS执行window.webkit.messageHandlers.Camera.postMessage(<messageBody>)

        function cameraClick() {

            window.webkit.messageHandlers.Camera.postMessage(null);

        }



        //调用相册回调结果显示

        function cameraResult(result) {

            alert(result);

            document.getElementById("returnValue").value = result;

        }

            </script>

        </head>

<body>

    <h1>这是按钮调用</h1>

    <input type="button" value="分享" onclick="shareClick()" />

    <input type="button" value="相机" onclick="cameraClick()" />

    <h1>回调展示区</h1>

    <textarea id ="returnValue" type="value" rows="5" cols="40">



    </textarea>

</body>

</html>

代码解释：

//在中JS 执行window.webkit.messageHandlers.<name>.postMessage(<messageBody>)时，OC端被添加的ScriptMessageHandler就会执行实现的WKScriptMessageHandler协议的方法 即

-(void)userContentController:(WKUserContentController*)userContentController didReceiveScriptMessage:(WKScriptMessage*)message

{

}

这样在代理方法里面实现相应本地原生方法的代码，就完成了JS调用OC本地的过程。

6.OC调用JS

NSString *JSResult = [NSString stringWithFormat:@"shareResult('%@','%@','%@')",title,content,url];

[self.webView evaluateJavaScript:JSResult completionHandler:^(id _Nullable result, NSError * _Nullable error) {

    NSLog(@"%@", error);

}];

代码解释：

通过 -evaluateJavaScript:completionHandler:实现OC调用JS，跟JavaScriptCore中的evaluateScript方法类似。

效果图：

点击分享按钮





总结：

WKWebView新特性

1.在性能、稳定性、功能方面有很大提升（最直观的体现就是加载网页是占用的内存，模拟器加载百度与开源中国网站时，WKWebView占用23M，而UIWebView占用85M）；

2.允许JavaScript的Nitro库加载并使用（UIWebView中限制）；

3.支持了更多的HTML5特性；

4.高达60fps的滚动刷新率以及内置手势；

5.将UIWebViewDelegate与UIWebView重构成了14类与3个协议。

WKWebview-MessageHandler 、WebViewJavaScriptBridge、JavaScriptCore优缺点

1.WebViewJavaScriptBridge缺点就是要固定的加入相关代码，JS端代码要在固定的函数内添加，使用拦截协议URL的方式传递参数需要把参数拼接在后面，遇到要传递的参数有特殊字符，例如& 、= 、？等解析容易出问题;

bridge.callHandler('callme', {'blogURL': 'https://github.com/HQGod&content=每天都是好心情&img=图片'}, function(response) {

        log('JS端 得到 response', response)

2.WKWebview-MessageHandler在JS中写起来更简单一点，JS传递参数更方便，减少参数中特殊字符引起的错误,WKWebView在性能、稳定性方面更加强大；

3.JavaScriptCore使用起来比较简单，方便web端和移动端的统一。



