// pages/user/customer_list/customer_list.js
var network = require("../../../http-request/customer-service.js");
import utils from '../../../utils/util.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nowData: {val:null,text:'全部'},//下拉框的数组
        selectData: [{val:null,text:'全部'},{val:1,text:'活跃正常'},{val:2,text:'活跃下降'},{val:3,text:'新沉默'},{val:4,text:'沉默'},{val:5,text:'未激活'}],//下拉选项的数组
        nowTime:{
            "id": "30",
            "name": "近30天"
        },
        tempTime:{
            "id": "30",
            "name": "近30天"
        },//用于保存时间
        selectTimeArray: [{
            "id": "30",
            "name": "近30天"
        }, {
            "id": "7",
            "name": "近7天"
        }, {"id": "90", "name": "近90天"}],
        // customerTips: [
        //     {id: 1, labelName: '客户标签一', light: false},
        //     {id: 2, labelName: '客户标签2', light: false},
        //     {id: 3, labelName: '客户标签3', light: false},
        //     {id: 4, labelName: '客户标签4', light: false}
        // ],//标签数组
        customerTips:[],//所有标签数组
        tempTips: [],//用于保存选中标签数组
        sort_hidden: true,//下拉框的显示或隐藏
        zhezhaoRight:true,//右边遮罩层
        titleList: ['商户名称','商户状态', '下单天数 ','订单总额'],
        dataListArr:[],
        refreshFlag:0,//页面刷新标志位
        title: '客户管理',
        barBg: '#03A9F4',
        fixed: true,
        color: '#ffffff',
        height: '',
        requestComplete:true,//网络请求完成
        selectShow:false,
        pageNum: 1,//请求第几页
        pageSize: 100,
        pages:0,
        statusBarHeight:wx.getSystemInfoSync()['statusBarHeight']+46
    },

    loadMore(){
        const _this = this
        if (_this.data.pageNum == _this.data.pages){
            return;
        }
        _this.setData({
            pageNum: _this.data.pageNum + 1
        })
        _this.refreshTable();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const _this = this
        wx.getSystemInfo({
            success: (res) => {
            this.setData({
            height: res.windowHeight*750/res.windowWidth - 400
            })
        }
    })
        /* 请求页面数据，重新设置筛选面板的选项和未激活面板*/
        _this.refreshTable()
        _this.userLabels()
        setTimeout(() =>{
            _this.setData({
            refreshFlag: 1
          })
        },0)
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
        /* 页面从详情页返回后，只会执行onShow，不会执行onLoad，需要重新刷新页面 */
        const _this = this
        console.log("onShow");
        if (_this.data.refreshFlag == 1) {
            /* 请求页面数据，重新设置筛选面板的选项和未激活面板*/
            this.setData({
                zhezhaoRight:true,
                customerTips:[],
                tempTips:[],
                // nowData: {val:null,text:'全部'},
                // nowTime:{
                //     "id": "30",
                //     "name": "近30天"
                // },
                // tempTime:{
                //     "id": "30",
                //     "name": "近30天"
                // },
                dataListArr:[],
                pageNum:1,
                pages:0
            })
            _this.refreshTable()
            _this.userLabels()
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

    },

    changNowTime(e) {
        this.setData({
            nowTime:e.detail.customerType
        })
    },

    changeCustomerState(e){
        if (this.data.nowData.val !== e.detail.selectData.val) {
            this.setData({
                dataListArr:[],
                nowData:e.detail.selectData,
                pageNum:1
            })
            this.refreshTable()
        }

    },


    /*点击筛选*/
    rightTap(e){
        const _this=this;
        let tempTips = JSON.parse(JSON.stringify(_this.data.customerTips))
        let tempTime = JSON.parse(JSON.stringify(_this.data.nowTime))
        _this.setData({
            zhezhaoRight: false,//遮罩层
            sort_hidden: true,//下拉框的显示或隐藏
            uporleft: 'left',
            tempTips: tempTips,//保存进入筛选面板之前的数据
            tempTime: tempTime,//保存进入筛选面板之前的时间
        })

    },

    /*点击筛选隐藏*/
    rightTapHidden(e){
        const _this=this;
        let customerTips = JSON.parse(JSON.stringify(_this.data.tempTips))
        let nowTime = JSON.parse(JSON.stringify(_this.data.tempTime))
        _this.setData({
            customerTips:customerTips,//恢复进入筛选面板之前的数据
            nowTime:nowTime,//恢复进入筛选面板之前的时间
            zhezhaoRight: true,//遮罩层
            uporleft: 'right',
            selectShow:false
        })
        _this.selectComponent('#countdown').pack_up();
    },

    /*分页重新加载表格数据*/
    refreshTable(){
        const _this = this
        /*重新网络请求table数据*/
        let time = utils.getRecentFormatTime(this.data.nowTime.id).t2
        let customerLabelIds = []
        let currentPageIndex = this.data.pageNum - 1
        this.data.customerTips.forEach((item) =>{
            if (item.light) {
            customerLabelIds.push(item.id)
            }
        });
        _this.setData({
            requestComplete:true
        })
        wx.showLoading({
            title: '加载中',
        })
        network.customerList('',{
            "customerLabelIds": customerLabelIds,
            "customerState": _this.data.nowData.val,
            "pageNum": this.data.pageNum,
            "pageSize": _this.data.pageSize,
            "startTime": time
        }).then(function(res){
            wx.hideLoading()
            if(res.data.code=='200'){
                if (_this.data.pageNum == 1) {
                    _this.setData({
                        pages: res.data.datas.pages
                    })
                }
                if (res.data.datas.list && res.data.datas.list.length > 0){
                    let resArr = res.data.datas.list
                    let temp = []
                    for (var i = 0,len = res.data.datas.list.length; i < len; i++) {
                        temp[i] = {
                            name:resArr[i].name,
                            hotStateDesc:resArr[i].hotStateDesc,
                            dateNum:resArr[i].dateNum,
                            totalOrderAmount:resArr[i].totalOrderAmount,
                            id:resArr[i].id
                        }
                    }
                    console.log("设置数据",temp);
                    _this.setData({
                        ["dataListArr[" + currentPageIndex + "]"]:temp
                    })
                }
                if (_this.data.pageNum == _this.data.pages || _this.data.pages == 0) {
                    _this.setData({
                        requestComplete:false
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
    userLabels(){
        const _this = this
        network.userLabels('').then(function(res){
            if(res.data.code == '200'){
                console.log("userLabels q请求完毕");
                if (res.data.datas && res.data.datas.length > 0){
                    _this.setData({
                        customerTips:res.data.datas
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

    /*标签点击事件*/
    clickTip(e) {
        const _this = this
        let item = e.currentTarget.dataset.item
        item.light = !item.light
        let index = e.currentTarget.dataset.index
        _this.data.customerTips[index] = item
        _this.setData({
            customerTips: _this.data.customerTips
        })
    },
    /* 重置 */
    resetFilter(){
        const _this=this;
        let customerTips = _this.data.customerTips.slice(0);
        for(var i = 0,len = customerTips.length; i< len ; i++){
            customerTips[i].light = false
        }
        _this.setData({
            customerTips:customerTips,
            nowTime:{
                "id": "30",
                "name": "近30天"
            }
        })
    },
    /* 确认 */
    confirmFilter(){
        const _this=this;
        let tempTips = JSON.parse(JSON.stringify(_this.data.customerTips))
        let tempTime = JSON.parse(JSON.stringify(_this.data.nowTime))
        _this.setData({
            tempTips: tempTips,//保存进入筛选面板之前的标签
            tempTime: tempTime,//保存进入筛选面板之前的时间
            zhezhaoRight: true,//遮罩层
            uporleft: 'right',
            dataListArr:[],
            pageNum:1
        })
        _this.refreshTable()
    },

    selectTr(e) {
        const that = this;
        let customer = JSON.stringify(e.currentTarget.dataset.item); //通过这个传递数据
        let time = JSON.stringify(this.data.nowTime); //通过这个传递选择时间
        wx.navigateTo({
            url: `/pages/workbench/customer_detail/customer_detail?Customer=${customer}&time=${time}`
        })
    },
    doNothing(){
       return
    },
    /* 左滑关闭 */
    // touchS(e) {
    //     // 获得起始坐标
    //     var _this = this
    //     this.startX = e.touches[0].clientX;
    //     this.startY = e.touches[0].clientY;
    // },
    // touchM(e) {
    //     var _this = this
    //     // 获得当前坐标
    //     this.currentX = e.touches[0].clientX;
    //     this.currentY = e.touches[0].clientY;
    //     const x = this.startX - this.currentX; //横向移动距离
    //     const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    //     if (x > 35 && y < 110) {
    //         //向左滑是显示删除
    //
    //     } else if (x < -35 && y < 110) {
    //         var customerTips = JSON.parse(JSON.stringify(_this.data.tempTips))
    //         _this.setData({
    //             customerTips:customerTips,//恢复进入筛选面板之前的数据
    //             zhezhaoRight: true,//遮罩层
    //             uporleft: 'right'
    //         })
    //     }
    //
    // },

})