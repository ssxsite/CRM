// pages/workbench/customer_detail/customer_detail.js
/* 图表参考 https://echarts.baidu.com/examples/editor.html?c=dynamic-data*/
/* 图表参考 https://www.echartsjs.com/examples/editor.html?c=area-basic*/
import * as echarts from '../../../ec-canvas/echarts';
var network = require("../../../http-request/customer-service.js");
import utils from '../../../utils/util.js';

var mychart = null
var xAxisData = [0,0,0,0,0,0,0,0,0,0]
var seriesData = [0,0,0,0,0,0,0,0,0,0]

var unit = '金额 (元)'
function initChart(canvas, width, height) {
    mychart = echarts.init(canvas, null, {
        width: width,
        height: height
    });
    canvas.setChart(mychart);
    mychart.showLoading(); // 首次显示加载动画
    var option = {
        xAxis: {
            name: '日期',
            data: xAxisData,
            axisLabel : {
                show:true,
                interval: 0,
                rotate:40
            }

        },
        grid:{
            y:30,
            x:50,
            x2:50
        },
        yAxis: {
            name: unit,
            type: 'value',
            axisLabel : {
                show:true,
                interval: 0,
            }
        },
        series: [{
            type: 'line',
            data:seriesData,
            areaStyle: {}
        }]
    }
    mychart.setOption(option);
    mychart.hideLoading(); // 隐藏加载动画
    return mychart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
      ec: {
          onInit: initChart
      },
      nowTime:{
          "id": "30",
          "name": "近30天"
      },
      selectTimeArray: [{
          "id": "30",
          "name": "近30天"
      }, {
          "id": "7",
          "name": "近7天"
      }, {"id": "90", "name": "近90天"}],
      titleList: ['产品类目', ' 产品名称 ', '品牌','销售额'],
      // dataList: [
      //     {
      //         id: 1,
      //         str: '[耕垦]鸡边腿小 规格(大边腿[耕垦]鸡边腿小 规格(大边腿',
      //         text: ' 商户名称A',
      //         name: ' 便利店',
      //     },
      //     {
      //         id: 2,
      //         str: '[耕垦]鸡边腿小 规格(大边腿[耕垦]鸡边腿小 规格(大边腿',
      //         text: ' 商户名称A',
      //         name: ' 便利店',
      //     },
      //     {
      //         id: 3,
      //         str: '[耕垦]鸡边腿小 规格(大边腿[耕垦]鸡边腿小 规格(大边腿',
      //         text: ' 商户名称A',
      //         name: ' 便利店',
      //     }
      // ],
      dataList: [],
      // customerTips:[{id: 2, labelName: '客户标签2'}, {id: 4, labelName: '客户标签4'},{id: 2, labelName: '客户标签2'}, {id: 4, labelName: '客户标签4'},{id: 2, labelName: '客户标签2'}, {id: 4, labelName: '客户标签4'}],
      customerTips:[],
      customerId:-1,
      title: '',
      barBg: '#03A9F4',
      fixed: true,
      color: '#ffffff',
      refreshFlag:0,//页面刷新标志位
      height: '',
      requestComplete:true,//网络请求完成
      statusBarHeight:wx.getSystemInfoSync()['statusBarHeight']+34
  },

    getCustomerLabels(){
        let _this = this
        network.getCustomerLabels('',{
            customerId: _this.data.customerId
        }).then(function(res){
            if(res.data.code == '200'){
                if (res.data.datas && res.data.datas.length > 0){
                    let customerTips = res.data.datas.filter(item =>{
                        return item.light == true
                    })
                    _this.setData({
                        customerTips: customerTips
                    })
                }
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
    /*重新加载表格数据*/
    refreshTable(){
        const _this = this
        /*重新网络请求table数据*/
        let time = utils.getRecentFormatTime(this.data.nowTime.id).t2
        // let time = ''
        // const path = `/startTime=${time}&customerId=${_this.data.customerId}`
        const params = {
            startTime:time,
            customerId:_this.data.customerId
        }
        _this.setData({
            dataList:[],
            requestComplete:true
        })

        network.customerBuyList('',params).then(function(res){
            if(res.data.code == '200'){
                if (res.data.datas.customerBuyDetails && res.data.datas.customerBuyDetails.length > 0){
                    _this.setData({
                        dataList: res.data.datas.customerBuyDetails
                    })
                }
                _this.setData({
                    requestComplete:false
                })
                /*更新表格*/
                if(res.data.datas.customerBuySum.dates && res.data.datas.customerBuySum.dates.length > 0) {
                    xAxisData = res.data.datas.customerBuySum.dates
                }
                if(res.data.datas.customerBuySum.averageAmounts && res.data.datas.customerBuySum.averageAmounts.length > 0) {
                    let tempVaArr  = res.data.datas.customerBuySum.averageAmounts
                    let tempUnit = utils.getUnit(tempVaArr)
                    let divisor = tempUnit.divisor
                    unit = tempUnit.tunit
                    tempVaArr = tempVaArr.map(item =>{
                        return item = item / divisor
                    })
                    seriesData = tempVaArr
                }
                var option = {
                    xAxis: {
                        data: xAxisData
                    },
                    yAxis: {
                        name: unit
                    },
                    series: [{
                        data:seriesData
                    }]
                }

                mychart.setOption(option);
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
    gotoAddDetai(){
        const _this = this
        let customer = JSON.stringify(_this.data.customer)
        wx.navigateTo({
            url: '/pages/workbench/add_tips/add_tips?Customer='+ customer
        })
    },
    /* 禁止滑动 */
    doNothing(){
        return
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      const _this = this
      console.log("时间---",options.time)
      let customer = JSON.parse(options.Customer)
      let customerId = customer.id;
      _this.setData({
          customer:customer,
          customerId:customerId,
          title:customer.name,
          nowTime:JSON.parse(options.time)
      })
      /*请求所有标签*/
      _this.getCustomerLabels()

      setTimeout(() =>{
          _this.setData({
          refreshFlag: 1
      })
  },0)

      wx.getSystemInfo({
          success: (res) => {
          this.setData({
          height: res.windowHeight*750/res.windowWidth - 980
      })
  }
  })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      const _this = this
      _this.refreshTable()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      let _this = this
      if (_this.data.refreshFlag == 1) {
          _this.setData({
              dataList:[]
          })
          /* 请求页面数据，重新设置筛选面板的选项和未激活面板*/
          _this.refreshTable()
      }
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