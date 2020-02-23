// pages/user/login/login.js
import utils from '../../../utils/util.js';
import MD5 from '../../../utils/md5.js';
var network = require("../../../http-request/user-service.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
      account:"",
      password:"",
      isShow:false,
      isAccountShow:false,
      isPassShow:false
  },
  resetPassword:function(){
      wx.redirectTo({
          url:'../forget_password/forget_password'
      })
  },
  wxLogin:function(){
        var that = this;
        /* 获取临时登录凭证 */
        wx.login({
            success: function(res) {
                utils.log("临时凭证1：",res);

                if(res.code){
                    // 登录
                    network.login('',{
                        account: that.data.account,
                        code: res.code,
                        newPassword: "",
                        password: MD5.hex_md5(that.data.password)
                    }).then(function(res){
                        if(res.data.code='200'){
                            wx.setStorageSync("Authorization", res.data.datas);
                            wx.setStorageSync("account", that.data.account);
                            wx.setStorageSync("password",that.data.password);
                            wx.redirectTo({
                                url:'/pages/index/index'
                            });
                        }else{
                            //console.log("===========");
                            wx.showToast({
                                title: res.data.message,
                                icon: 'none',
                                duration: 1500,
                                mask:true
                            });
                        }
                    });
                }else{
                    wx.showToast({
                        title: '获取用户登录态失败！'+ res.errMsg,
                        icon: 'none',
                        duration: 1500,
                        mask:true
                    });
                }
            },
            fail: function(){
                wx.showToast({
                    title: '启用wx.login函数，失败！',
                    icon: 'none',
                    duration: 1500,
                    mask:true
                });
            }
        });
    },
  login:function(){
      var that = this;
      //防止重复点击
      if(this.isClick){
          utils.log("isClick",this.isClick);
          this.loginFn();
          this.isClick = false;
          setTimeout(function(){
              that.isClick = true;
          },1500) //点击1500ms后可重新点击
      }
  },
  loginFn:function(){
      if(this.data.account==""){
          wx.showToast({
              title: '请输入账号',
              icon: 'none',
              duration: 1000,
              mask:true
          });
          return;
      }
      /*if(!utils.checkPhomeNumber(this.data.account)){
          wx.showToast({
              title: '请输入正确的手机号',
              icon: 'none',
              duration: 1000,
              mask:true
          });
          return;
      }*/
      if(this.data.password==""){
          wx.showToast({
              title: '请输入密码',
              icon: 'none',
              duration: 1000,
              mask:true
          });
          return;
      }

      this.wxLogin();
  },
  close:function(e){
      //console.log(e.currentTarget)
      if(e.currentTarget.dataset.type==0){
          this.setData({
              account: "",
              isAccountShow:false
          })
      }else if(e.currentTarget.dataset.type==1){
          this.setData({
              password: "",
              isPassShow:false
          })
      }
    },
  accountInput:function(e){
        this.setData({
            account: e.detail.value,
            isAccountShow:true
        })
  },
  passwordInput:function(e){
        this.setData({
            password: e.detail.value,
            isPassShow:true
        })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.isClick = true;
      this.setData({
          account:wx.getStorageSync('account')
      })
    //utils.log("===",wx.getStorageSync('account'));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})