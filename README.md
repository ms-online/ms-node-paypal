项目介绍：PayPal支付
知识点：PayPal-REST-SDK API


<!-- PayPal开发测试页：https://developer.paypal.com/developer/accounts/ -->
<!-- 创建app 获得你的id和secret -->
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': '<你的PayPal-APP-client_id>',
    'client_secret': '<你的PayPal-APP-client_secret>'
  });