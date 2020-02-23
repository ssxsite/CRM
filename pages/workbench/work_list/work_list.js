// pages/workbench/work_list/work_list.js
var Homeservice = require('../../../http-request/home-service.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      title: '首页',
      barBg: '#fff',
      fixed: true,
      color: '#000',
      user_detail:{},
      statusBarHeight:wx.getSystemInfoSync()['statusBarHeight']+46
  },

    getUserData:function () {
        Homeservice.userInfo_detail('',{}).then( res => {
        if(res.data.code=='200'){
            this.setData({
                user_detail:res.data.datas
            })
        }else {

        }
    })
    },
    setting: function () {
        wx.navigateTo({
            url: '../../user/setting/setting'
        })
    },
    gotoDetail(){
        wx.navigateTo({
            url: '/pages/workbench/customer_list/customer_list'
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const _this = this
      _this.getUserData()
      app.editTabBar();
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