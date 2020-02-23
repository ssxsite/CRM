//index.js
//获取应用实例
import * as echarts from '../../ec-canvas/echarts';
var Homeservice = require('../../http-request/home-service.js');
import util from '../../utils/util.js';
const app = getApp();
var performanceChart = null;
var customerChart = null;

function initChart(canvas, width, height) {
  performanceChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(performanceChart);
  return performanceChart;
};

function initChart2(canvas, width, height) {
  customerChart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(customerChart);
  return customerChart;
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ec: {
      onInit: initChart
    },
    kc: {
      onInit: initChart2
    },

      cate_default:'选择类别',
      brand_default:'品牌',
      goods_default:'商品名称',

      customerTypeArray:[],
      customerType:null,
      categoriesArray:[],
      categoryId:null,
      brandArray:[],
      brandId:null,
      goodsArray:[],
      goodsId:null,
      selectShow:false,
      TOP5_goods_Array:[],
      user_detail:{},
      performanceData:{},
      hotCustomersData:{},
      height0:'',
      selectShow:false,
      tuli_Array:[],
      hot_tuli_Array:[],
      no_performance:false,
      per_amount:{},
      marginTop:wx.getSystemInfoSync()['statusBarHeight']+46,
      selectArray: [{ val: 1, name: '今天' }, { val: 2, name: '昨天' }, { val: 3, name: '近7天' }, { val: 4, name: '近30日' }],//下拉选项的数组

      currentIndex:0,
  },

  initData:function () {
      wx.showLoading({
          title: '加载中',
      })

      Homeservice.userInfo_detail('',{}).then( res => {
         // console.log('获取业务员详情',res);
          if(res.data.code=='200'){
              this.setData({
                  user_detail:res.data.datas
              })
          }else {

          }
      })


      Homeservice.board_customer_type('',{}).then( res => {
          util.log('商户类型列表',res);
          if(res.data.code=='200'){
              let customerArr = res.data.datas;
              let allCustomer = {id:99999,name:'全部'}
              customerArr.splice(0,0,allCustomer);
              this.setData({
                  customerTypeArray:customerArr
              })

          }else {

          }
      })



      this.initChartData();
      this.initCustomer_ChartData();
      this.getResult_goods();
  },
    initChartData:function () {
        var parms = {
            startTime:util.getRecentFormatTime(this.time).t2,
            endTime:util.getRecentFormatTime(this.time).t1
        }
        Homeservice.homePerformance('',parms).then( res => {
           util.log('首页业绩看板',res);

            if(res.data.code=='200'){
                // 指定图表的配置项和数据

                var perdata = [];
                var perdata_name = [];
                var categoryPer = res.data.datas.categoryPerformances;

                for (let i=0;i<categoryPer.length;i++){
                    var p = (categoryPer[i].percentage * 100).toFixed(2);
                    perdata.push({value:categoryPer[i].totalAmount,name:categoryPer[i].categoryLevel2+ ' ' + ' ' + p + '%'})
                    perdata_name.push(categoryPer[i].categoryLevel2)
                }




                //console.log('1221221==perdata',perdata)
                var colorArray = []
                var no_performance = false ;


                if(categoryPer.length==0){
                    perdata.push({value:0,name:'各中类暂无销售数据！'})
                    perdata_name.push('各中类暂无销售数据！')
                    no_performance = true
                    colorArray = ['#CCD1D9', '#E6E9ED']
                }else {
                    colorArray = ['#FC6E51', '#4FC1E9', '#A0D468', '#FFCE54', '#CCD1D9', '#E6E9ED']
                }


                var performanceOption = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    title:{
                        text:'销售额\n占比',
                        left:'54%',
                        top:'38%',
                        textAlign: 'center',
                        textStyle: {
                            color: '#666666',
                            fontSize: 14,
                            align: 'center'
                        }
                    },
                    grid:{
                        left:'20%',
                    },
                    legend: {
                        show: false,
                        selectedMode: false,//取消图例上的点击事件
                        orient: 'vertical',

                        textStyle:{
                            color: '#666666',
                            fontSize:10,
                        },
                    },
                    color: colorArray,
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['76%', '60%'],
                            center: ['58%', '50%'],
                            avoidLabelOverlap: false,

                            label: {
                                normal: {
                                    show: false,

                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '10',
                                        fontWeight: 'bold'
                                    }
                                }
                            },

                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: perdata
                        }
                    ]
                };

                performanceChart.setOption(performanceOption);

                var per_amount = res.data.datas
                per_amount.totalOrderAmount = this.add_comma_toThousands(per_amount.totalOrderAmount,2)
                per_amount.totalOrderCount = this.add_comma_toThousands(per_amount.totalOrderCount,2)
                // var tuli_data =
               // console.log('per_amount===',this.add_comma_toThousands(9999999.223,2))
                this.setData({
                    tuli_Array:perdata,
                    no_performance:no_performance,
                    performanceData:res.data.datas,
                    // per_amount:per_amount
                })

            }else {

            }
        })
    },

    getPerformance_model:function (e) {
        //console.log('e========',e)



      if(e && e.detail){
          //console.log('e======',e.detail)
          if(e.detail.customerType.val==1){
              this.time = 0
          }else if(e.detail.customerType.val==2){
              this.time = 1
          }else if(e.detail.customerType.val==3){
              this.time = 7
          }else if(e.detail.customerType.val==4){
              this.time = 30
          }

      }
      this.initChartData();

  },
    initCustomer_ChartData:function () {
        var parms_customer = {
            startTime:util.getRecentFormatTime(this.customer_time).t2,
            endTime:util.getRecentFormatTime(this.customer_time).t1
        }
        Homeservice.customerHotData('',parms_customer).then( res => {
            util.log('首页活跃客户看板',res);
            wx.hideLoading()
            if(res.data.code=='200'){




                var total =res.data.datas.newHotNum + res.data.datas.oldHotNum;
                var new_p = 0;
                var old_p = 0;
                if(total>0){
                    new_p = (res.data.datas.newHotNum/total * 100).toFixed(2)
                    old_p = (res.data.datas.oldHotNum/total * 100).toFixed(2)
                }

                var tuli_data = [
                    { value: res.data.datas.newHotNum, name: '新增活跃客户'+' '+' '+new_p+'%'},
                    { value: res.data.datas.oldHotNum, name: '老活跃客户'+' '+' '+old_p+'%' },
                ]

                var hot_amount = {}
                hot_amount.oldHotNum = this.add_comma_toThousands(res.data.datas.oldHotNum,2)
                hot_amount.newHotNum = this.add_comma_toThousands(res.data.datas.newHotNum,2)

                var customerOption = {
                    tooltip: {
                        trigger: 'item',
                        show: false,
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    title: {
                        text: '活跃客户\n占比',
                        left:'54%',
                        top:'38%',
                        textAlign: 'center',
                        textStyle: {
                            color: '#666666',
                            fontSize: 14,
                            align: 'center'
                        }
                    },
                    grid: {
                        left: '20%',
                    },
                    legend: {
                        show:false,
                        selectedMode: false,//取消图例上的点击事件

                    },
                    color: ['#FFCE54', '#48CFAD'],
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            clickable: false,
                            radius: ['76%', '60%'],
                            center: ['58%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '10',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: tuli_data
                        }
                    ]
                };
                customerChart.setOption(customerOption);
                this.setData({
                    hot_tuli_Array:tuli_data,
                    hotCustomersData:res.data.datas
                })// 指定图表的配置项和数据


            }else {

            }
        })
    },
    getHotCustomer_model:function (e) {
        //console.log('e========',e)


        // var customer_time = 0

        if(e && e.detail){
            //console.log('e======',e.detail)
            if(e.detail.customerType.val==1){
                this.customer_time = 0
            }else if(e.detail.customerType.val==2){
                this.customer_time = 1
            }else if(e.detail.customerType.val==3){
                this.customer_time = 7
            }else if(e.detail.customerType.val==4){
                this.customer_time = 30
            }

        }

        // util.log('params===',parms)

        this.initCustomer_ChartData();
    },



  onReady() {
      this.time = 0;
      this.customer_time = 0;
      this.initData();
      var that = this
      wx.getSystemInfo({
          success(res) {
              // console.log(res)


          }
      })

  },
    onPullDownRefresh:function () {
      this.initData();
      setTimeout(function () {
          wx.stopPullDownRefresh();
      },1000)

    },
  onLoad: function () {


      this.time = 0;

    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // 设置紫色框 scroll-view 的高度
          wHeight: (res.windowHeight - 40)
        })
      }
    }),
    app.editTabBar();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

      /* 计算整个页面扣除顶部的高度 */
      var query = wx.createSelectorQuery();
      query.select('#navigationBar').boundingClientRect();
      query.exec(function (res){
          that.setData({
              height0:wx.getSystemInfoSync()['statusBarHeight']+46
          })
      });



  },
    getCategories_goods:function (e) {
     //console.log('e======',e)
      Homeservice.board_category('',{
          customerType:e.detail.customerType.id
      }).then( res => {
          //console.log('分类下拉列表',res);
          if(res.data.code=='200'){
              this.setData({
                  categoriesArray:res.data.datas,
                  customerType:e.detail.customerType.id,
                  cate_default:'选择类别',
                  brand_default:'品牌',
                  goods_default:'商品名称',
                  brandArray:[],
                  goodsArray:[],
                  categoryId:null,
                  brandId:null,
                  goodsId:null,
                  selectShow:false
              })

          }else {

          }
      }).then(res =>{
        this.getResult_goods();
      })
    },
    getBrand_goods:function (e) {
        //console.log('e======',e)
        Homeservice.board_brand('',{
            customerType:this.data.customerType,
            categoryId:e.detail.categoryId
        }).then( res => {
            //console.log('品牌下拉列表',res);
            if(res.data.code=='200'){
                this.setData({
                    brandArray:res.data.datas,
                    categoryId:e.detail.categoryId,
                    brand_default:'品牌',
                    goods_default:'商品名称',
                    goodsArray:[],
                    brandId:null,
                    goodsId:null,
                    selectShow:false
                })

            }else {

            }
        }).then(res =>{
            this.getResult_goods();
        })
    },
    getGoods_goods:function (e) {
        //console.log('e======',e)
        Homeservice.board_goods('',{
            customerType:this.data.customerType,
            categoryId:this.data.categoryId,
            brandId:e.detail.brandId,
        }).then( res => {
            //console.log('商品名称下拉列表',res);
            if(res.data.code=='200'){
                this.setData({
                    goodsArray:res.data.datas,
                    brandId:e.detail.brandId,
                    goods_default:'商品名称',
                    goodsId:null,
                    selectShow:false
                })

            }else {

            }
        }).then(res =>{
            this.getResult_goods();
        })
    },
    afterSelectGoods:function (e) {
        //console.log('e======',e)
        this.setData({
            goodsId:e.detail.goodsId,
        },function () {
            this.getResult_goods();
        })
    },

    getResult_goods:function () {

        var resultParams = {};
        if(this.data.customerType && this.data.categoryId && this.data.brandId && this.data.goodsId){
          resultParams = {
              customerType:this.data.customerType,
              categoryId:this.data.categoryId,
              brandId:this.data.brandId,
              goodsId:this.data.goodsId
          }
        }else if(this.data.customerType && this.data.categoryId && this.data.brandId){
            resultParams = {
                customerType:this.data.customerType,
                categoryId:this.data.categoryId,
                brandId:this.data.brandId,
            }
        }else if(this.data.customerType && this.data.categoryId){
            resultParams = {
                customerType:this.data.customerType,
                categoryId:this.data.categoryId,
            }
        }else if(this.data.customerType){
            if(this.data.customerType==99999){

            }else {
                resultParams = {
                    customerType:this.data.customerType,
                }
            }

        }
        Homeservice.top_result_list('',resultParams).then( res => {
            //console.log('总的商品TOP5列表',res);

            if(res.data.code=='200'){
                this.setData({
                    TOP5_goods_Array:res.data.datas,
                })

            }else {

            }
        })
    },


  //滚动过程中触发，设置 top 值为 scrollTop 值
  scroll: function (e) {
    this.setData({
      thStyle: 'position: absolute;top:' + e.detail.scrollTop + 'px;left: 0;',
      leftThStyle: 'position: absolute;top:' + e.detail.scrollTop + 'px;left: 0;'
    })
  },
  getUserInfo: function(e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  setting: function () {
    wx.navigateTo({
      url: '../user/setting/setting'
    })
  },
    selectTab:function (e) {


        var curritem = e.currentTarget.dataset.curritem;
        // console.log(e)
        // console.log(curritem)
        if(this.data.currentIndex==0){
            if(curritem.currIndex!=this.data.currentIndex){
                wx.navigateTo({
                    url: curritem.pagePath
                })
            }
        }else if(curritem.currIndex==0){
            wx.redirectTo({
                url: curritem.pagePath
            })
        }else {
            wx.navigateTo({
                url: curritem.pagePath
            })
        }



    },
  goPerformance: function () {
    //console.log('123')
      this.countdown = this.selectComponent('#countdown');
      this.countdown.pack_up();


    wx.navigateTo({
      url: '../home/performance_data/performance_data?time='+this.time
    })
      this.setData({
          selectShow:false
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
    

})
