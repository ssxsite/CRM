import utils from '../utils/util.js';
var app = getApp();

var CONSTANT = require('../constant/constant/constant.js');
var flag = 0;

const Promise = require('../http-request/es6-promise.min.js');

function wxPromise(method, url, data){
    var Authorization = wx.getStorageSync('Authorization')?wx.getStorageSync('Authorization'):"";
    //console.log('Authorization==========',Authorization);
    //返回一个Promise对象
    return new Promise(function (resolve, reject) {

        var fullurl = CONSTANT.URL+url;
        var header = {
                "Content-Type": "application/json;charset=UTF-8",
                'Authorization':Authorization
            };
        wx.request({
            url: fullurl,
            method: method,
            data: data,
            //在header中统一封装报文头，这样不用每个接口都写一样的报文头定义的代码
            header: header,
            success: function(res){
                //console.log("fullurl",fullurl);
                //这里可以根据自己项目服务端定义的正确的返回码来进行，接口请求成功后的处理，当然也可以在这里进行报文加解密的统一处理
                if(res.data.code == "200"){
                    resolve(res);
                }else if(res.data.code == "10002"||res.data.code == "10003"){
                    //10002 被顶号 10003 接口要求必须登录，而没有传authorization值
                    wx.removeStorageSync('Authorization');
                    var content = "";
                    if(res.data.code == "10002"){
                        content = "您的账号在别处登陆，请重新登录";
                    }else if(res.data.code == "10003"){
                        content = "登录状态过期，请重新登录";
                    }
                    if(flag==0){
                        flag = 1;
                        wx.showModal({
                            title: '提示',
                            content: content,
                            showCancel: false,
                            success(res){
                                if (res.confirm) {
                                   // console.log('用户点击确定');
                                    flag = 0
                                    wx.redirectTo({
                                        url:'/pages/user/login/login'
                                    })
                                }
                            }
                        })
                    }
                }else{
                    //console.log('请求异常111======',res);
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1000,
                        mask:true
                    });
                }
            },
            fail: function(res){
                //console.log('请求失败======',res)
                // setTimeout(function () {
                //     wx.hideLoading();
                // }, 100);
                wx.showToast({
                    title: res.errMsg,
                    icon: 'none',
                    duration: 1000,
                    mask:true
                });
                //reject(res);
            },
            complete:function () {
                // setTimeout(function () {
                //     wx.hideLoading();
                // }, 2000);
            }
        });
    });
}


function getRequest(url, data){
    return wxPromise("GET", url, data);
}

function postRequest(url, data){
    return wxPromise("POST", url, data);
}

module.exports = {
    wxPromise: wxPromise,
    postRequest: postRequest,
    getRequest: getRequest
}