// 引入模块
const express = require('express');
const ejs = require('ejs');
const paypal = require('paypal-rest-sdk');

// 配置PayPal
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': '<你的PayPal-APP-client_id>',
    'client_secret': '<你的PayPal-APP-client_secret>'
  });

// 创建express app
const app = express();

// 设置视图引擎
app.set('view engine', 'ejs');

// index路由 返回渲染页面
app.get('/', (req,res) => {
    res.render('index')
})
// post pay
app.post('/pay', (req,res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:8888/success",
            "cancel_url": "http://localhost:8888/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "node.js",
                    "sku": "001",
                    "price": "58.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "58.00"
            },
            "description": "node.js course"
        }]
    };

    // 创建支付
    paypal.payment.create(create_payment_json, function(error, payment) {
        if(error){
            throw error
        }else{        
            // console.log(payment);
            // 通过循环获取发送给用户的付款准许地址
            for(let i = 0; i<payment.links.length; i++){
                if(payment.links[i].rel === "approval_url"){
                    res.redirect(payment.links[i].href);
                }
            }
        }
    })
})

// 付费成功 get success
app.get('/success', (req,res)=> {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    // 创建付款对象
    const execute_payment_json ={
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "58.00"
            }
        }]
    }

    // 付费
    paypal.payment.execute(paymentId, execute_payment_json, function(error, payment){
        if(error){
            console.log(error.response);
            throw error;
        }else{
            console.log(payment);
            res.send('交易成功');
        }
    })
})

// 取消
app.get('/cancel', (req,res) => res.send('交易取消'))
// 监听端口号
app.listen('8888',(req,res) => console.log('服务器已运行...') );