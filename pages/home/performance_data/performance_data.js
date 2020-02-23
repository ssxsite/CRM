// pages/home/performance_data/performance_data.js

var Homeservice = require('../../../http-request/home-service.js');
import util from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: '',
      performanceData:{},
      per_categoryData:[],
      amountObj:{},
      top:wx.getSystemInfoSync()['statusBarHeight']+46,
    nowData:{
      val: 1, text: '今天'
    },
    selectData:[{ val: 1, text: '今天' }, { val: 2, text: '昨天' }, { val: 3, text: '近7天' }, { val: 4, text: '近30日' }],//下拉选项的数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


      var that = this
    wx.getSystemInfo({
      success: (res) => {
          // util.log('res=====',res)
          // var top = null;
          // if(res.platform == 'ios'){
          //     if(res.model.indexOf('iPhone X') !== -1 ){
          //         top = 168
          //     }else {
          //         top = 132
          //     }
          // }else {  //安卓
          //
          //     top = 154
          // }
          that.setData({
              // top:top,
          height: res.windowHeight*750/res.windowWidth - 420
        })
      }
    })
      util.log('options',options)
      if(options.time=='0'){
          this.setData({
              nowData:{val:1,text:'今天'}
          })
      }else if(options.time=='1'){
          this.setData({
              nowData:{val:2,text:'昨天'}
          })
      }else if(options.time=='7'){
          this.setData({
              nowData:{val:3,text:'近7天'}
          })
      }else if(options.time=='30'){
          this.setData({
              nowData:{val:4,text:'近30日'}
          })
      }
      this.time = parseInt(options.time);

      var parms = {
          startTime:util.getRecentFormatTime(this.time).t2,
          endTime:util.getRecentFormatTime(this.time).t1
      };
    this.getRequestData(parms)

  },
    getPerformance_data:function (e) {


        if(e && e.detail){
            if(e.detail.selectData.val==1){
                this.time = 0
            }else if(e.detail.selectData.val==2){
                this.time = 1
            }else if(e.detail.selectData.val==3){
                this.time = 7
            }else if(e.detail.selectData.val==4){
                this.time = 30
            }
            var parms = {
                startTime:util.getRecentFormatTime(this.time).t2,
                endTime:util.getRecentFormatTime(this.time).t1
            }
        }

        this.getRequestData(parms)


  },

    getRequestData:function (parms) {
        wx.showLoading({
            title: '加载中',
        })

        Homeservice.performancePageData('',parms).then( res => {
            util.log('业绩数据页面',res);
            wx.hideLoading()
            if(res.data.code=='200'){
                var amountObj = res.data.datas
                amountObj.totalOrderAmount = this.add_comma_toThousands(amountObj.totalOrderAmount,2)
                amountObj.totalOrderCount = this.add_comma_toThousands(amountObj.totalOrderCount,2)

                this.setData({
                    // amountObj:amountObj,
                    performanceData:res.data.datas,
                    per_categoryData:res.data.datas.categoryPerformances
                })
            }else {

            }
        })
    },
    add_comma_toThousands: function (s,n) {
        n = n > 2 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1] ? '.'+s.split(".")[1] : '';
        var t = "";
        for(let i = 0; i < l.length; i ++ )
        {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("")  + r;
    },

  lower: function () {
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

  },

  goPerformanceDetail: function (e) {
    var categoryId = e.currentTarget.dataset.categoryid;
    var categoryname = e.currentTarget.dataset.categoryname;
    wx.navigateTo({
      url: '../performance_detail/performance_detail?categoryId='+categoryId+'&categoryname='+categoryname+'&time='+this.time
    })
  },
})