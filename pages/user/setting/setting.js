// pages/user/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      cache:'0',
      height0:1000
  },
    /*goResetPass:function () {
        wx.redirectTo({
            url:'../forget_password/forget_password'
        })
    },*/
    clearCache:function () {
        wx.showToast({
            title: '清除成功',
            icon: 'none',
            duration: 1000,
            mask:true
        });
        // wx.clearStorage({
        //     success:function(res){
        //         wx.showToast({
        //             title: '清除成功',
        //             icon: 'none',
        //             duration: 1000,
        //             mask:true
        //         });
        //     },
        //     fail:function(res){
        //
        //     }
        // });
        this.setData({
            cache:'0'
        });
    },
    logout:function () {
      //是否要清除登录信息？？？
        wx.removeStorageSync('Authorization');
        //wx.removeStorageSync("account");
        wx.redirectTo({
            url:'../login/login'
        })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      /* 计算整个页面扣除顶部的高度 */
      var that = this;
      var query = wx.createSelectorQuery();
      query.select('#navigationBar').boundingClientRect();
      query.exec(function (res){
          that.setData({
              height0:wx.getSystemInfoSync().windowHeight -10   //res[0].bottom
          })
      });
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
      var that = this;
      wx.getStorageInfo({
          success: function(res) {
              that.setData({
                  cache:res.currentSize
              });
          },
          fail:function(){

          }
      })
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