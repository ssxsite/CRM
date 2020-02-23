// pages/quick/send_history/send_history.js
var network = require("../../../http-request/quick-service.js");
import utils from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
      titleList: ['日期', '商户账号', '商户名称','发放金额'],
      // dataList: [
      //     {
      //         id: 1,
      //         str: '13100000001',
      //         text: ' 商户名称A',
      //         name: ' 便利店',
      //     },
      //     {
      //         id: 2,
      //         str: '13100000001',
      //         text: ' 商户名称A',
      //         name: ' 便利店',
      //     },
      //     {
      //         id: 3,
      //         str: '13100000001',
      //         text: ' 商户名称A',
      //         name: ' 便利店',
      //     }
      // ],
      dataList:[],
      selectTimeArray: [{
          "id": null,
          "name": "全部"
      }, {
          "id": "30",
          "name": "本月"
      }],
      nowTime:{
          "id": null,
          "name": "全部"
      },
      title: '近三个月发放历史',
      barBg: '#03A9F4',
      fixed: true,
      color: '#ffffff',
      height:'',
      requestComplete:true,//网络请求完成
      statusBarHeight:wx.getSystemInfoSync()['statusBarHeight']+46
  },
    /*重新加载表格数据*/
    refreshTable(){
        const _this = this
        /*重新网络请求table数据*/
        let time = this.data.nowTime.id ? utils.getRecentFormatTime(this.data.nowTime.id).t2 : null
        // const path = `?startTime=${time}`
        const params = {
            startTime:time
        }
        _this.setData({
            dataList:[],
            requestComplete:true
        })
        // wx.showLoading({
        //     title: '加载中',
        // })
        network.getSendRedHistory('',params).then(function(res){
            // wx.hideLoading()
            if(res.data.code == '200'){
                if (res.data.datas && res.data.datas.length > 0){
                    _this.setData({
                        dataList: res.data.datas
                    })
                }
                _this.setData({
                    requestComplete:false
                })
            }else{
                wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 1500,
                    mask:true
                })
            }
        });
    },
    changNowTime(e) {
        if(this.data.nowTime.id !== e.detail.customerType.id){
            this.setData({
                nowTime:e.detail.customerType
            })
            this.refreshTable()
        }
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const _this = this
      _this.refreshTable()
      wx.getSystemInfo({
          success: (res) => {
          this.setData({
          height: res.windowHeight*750/res.windowWidth - 380
        })
       }
     })
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