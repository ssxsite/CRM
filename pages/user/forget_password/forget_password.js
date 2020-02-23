// pages/user/forget_password/forget_password.js
import utils from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      account:"",
      password1:"",
      password2:"",
      showFirst:true,
      showSecond:false,
      showThird:false,
      numList:[],
      confirmstatus:'',
      code:'',
      timer: '',//定时器名字
      countDownNum: '60',//倒计时初始值
      showTips:true
  },
    countDown: function () {
        var that = this;
        var countDownNum = '60';//获取倒计时初始值
        that.setData({
            showTips:true
        });
        //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
        that.setData({
            timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
                //每隔一秒countDownNum就减一，实现同步
                countDownNum--;
                //然后把countDownNum存进data，好让用户知道时间在倒计着
                that.setData({
                    countDownNum: countDownNum
                });
                //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
                if (countDownNum == 0) {
                    //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
                    //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
                    clearInterval(that.data.timer);
                    that.setData({
                        showTips:false
                    });
                    //关闭定时器之后，可作其他处理codes go here
                }
            }, 1000)
        })
    },
    inputcatch:function(e){
        var that = this;
        var value = e.detail.value;
        var valueArray = value.split("");
        that.setData({
            numList: valueArray,
            code: value
        });
        if (!/^\d{4}$/.test(e.detail.value)) {
            that.setData({
                confirmstatus: ''
            });
            return;
        } else {
            that.setData({
                confirmstatus: 'active',
                showSecond:false,
                showThird:true
            })
        }
    },
    getCode:function(){
        if(this.data.account==""){
            wx.showToast({
                title: '请输入手机号',
                icon: 'none',
                duration: 1000,
                mask:true
            });
            return;
        }

        if(!utils.checkPhomeNumber(this.data.account)){
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none',
                duration: 1000,
                mask:true
            });
            return;
        }
      this.setData({
          showFirst:false,
          showSecond:true
      });
    },
    submit:function(){
        if(this.data.password1==""){
            wx.showToast({
                title: '请输入密码',
                icon: 'none',
                duration: 1000,
                mask:true
            });
            return;
        }
        if(this.data.password2==""){
            wx.showToast({
                title: '请再次确认密码',
                icon: 'none',
                duration: 1000,
                mask:true
            });
            return;
        }
        if(this.data.password1==this.data.password2){
            if(this.data.password1.length<6){
                wx.showToast({
                    title: '密码为6-12个字符',
                    icon: 'none',
                    duration: 1000,
                    mask:true
                });
                return;
            }else{
                wx.showToast({
                    title: '密码已重置',
                    icon: 'none',
                    duration: 2000,
                    mask:true
                });
                setTimeout(function(){
                    wx.redirectTo({
                        url:'/pages/user/login/login'
                    });
                },1000);
            }
        }else{
            wx.showToast({
                title: '两次输入的密码不一致',
                icon: 'none',
                duration: 1000,
                mask:true
            });
        }
    },
    accountInput:function(e){
        this.setData({
            account: e.detail.value
        })
    },
    passwordInput:function(e){
        this.setData({
            password1: e.detail.value
        })
    },
    passwordInput2:function(e){
        this.setData({
            password2: e.detail.value
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      this.countDown();
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