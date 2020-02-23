// pages/home/performance_detail/performance_detail.js
var CONSTANT = require('../../../constant/constant/constant.js');
var Homeservice = require('../../../http-request/home-service.js');
import util from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
      per_categoryData:{},
      per_goodsPerformances:[],
      top:wx.getSystemInfoSync()['statusBarHeight']+46,
    nowData: {
      val: 1, text: '今天'
    },
    selectData: [{ val: 1, text: '今天' }, { val: 2, text: '昨天' }, { val: 3, text: '近7天' }, { val: 4, text: '近30日' }],//下拉选项的数组
    title:'',
      categoryId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('获取上一页传的id参数', options)
      var that = this
    wx.getSystemInfo({
      success: (res) => {

          that.setData({
          height: res.windowHeight * 750 / res.windowWidth - 420,
          title:options.categoryname,
            categoryId:options.categoryId,
            // top:top
        })
        // console.log(this.data.height)
      }
    })
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

      this.time = parseInt(options.time)
      var parms = {
          'categoryId':options.categoryId,
          startTime:util.getRecentFormatTime(this.time).t2,
          endTime:util.getRecentFormatTime(this.time).t1
      };
      util.log('options',parms)

      this.initData(parms);



  },
    getCategory_data:function (e) {




        if(e && e.detail){
            // console.log('e======',e.detail)
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
                'categoryId':this.data.categoryId,
                startTime:util.getRecentFormatTime(this.time).t2,
                endTime:util.getRecentFormatTime(this.time).t1
            }
        }
        this.initData(parms)
    },
    initData:function (parms) {

        Homeservice.performance_category('',parms).then( res => {
            // console.log('业绩数据-分类数据',res);
            if(res.data.code=='200'){
                var amountObj = res.data.datas
                amountObj.totalOrderAmount = this.add_comma_toThousands(amountObj.totalOrderAmount,2)
                amountObj.totalOrderCount = this.add_comma_toThousands(amountObj.totalOrderCount,2)
                this.setData({
                    per_categoryData:res.data.datas,
                    per_goodsPerformances:res.data.datas.goodsPerformances
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
  
  lower:function(){
     // console.log('滑动到最底了');

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