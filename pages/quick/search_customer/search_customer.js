// pages/quick/search_customer/search_customer.js
var network = require("../../../http-request/quick-service.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        titleList: ['商户账号', '商户名称 ', '商户类型'],
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
        focus:true,
        page:1,
        title: '查找商户',
        barBg: '#03A9F4',
        fixed: true,
        color: '#ffffff',
        height:'',
        requestComplete:true,//网络请求完成
        statusBarHeight:wx.getSystemInfoSync()['statusBarHeight']+46,
        pageNum: 100,//请求第几页
        pageSize: 50,
        pages:0,
        keyWord:'',//搜索关键字
    },
    loadMore(){
        if (this.data.pageNum == this.data.pages){
            return;
        }
        this.setData({
            pageNum: this.data.pageNum + 1
        })
        this.refreshTable();
    },

    bindKeyInput(e) {
        let temp = e.detail.value.replace(/^\s+|\s+$/g,'')
        if (this.data.keyWord !== temp) {
            this.setData({
                keyWord: temp,
            })
            this.setData({
                dataList:[],
                requestComplete:true,
                pageNum:1
            })
            this.refreshTable()
        }
    },
    bindBlur(e) {
        this.setData({
            keyWord: e.detail.value.replace(/^\s+|\s+$/g,'')
        })
    },

    /*分页重新加载表格数据*/
    refreshTable(){
        const _this = this
        const pageParam = {
            "pageNum": _this.data.pageNum,
            "pageSize": _this.data.pageSize,
            "keyWord":_this.data.keyWord
        }
        wx.showLoading({
            title: '加载中',
        })
        network.searchCustomerlist('',pageParam).then(function(res){
            wx.hideLoading()
            if(res.data.code=='200'){
                if (_this.data.pageNum == 1) {
                    _this.setData({
                        pages: res.data.datas.pages
                    })
                    if (res.data.datas && res.data.datas.list.length > 0){
                        _this.setData({
                            dataList: res.data.datas.list
                        })
                    }
                }else {
                    if (res.data.datas && res.data.datas.list.length > 0){
                        _this.setData({
                            dataList: _this.data.dataList.concat(res.data.datas.list)
                        })
                    }
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


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.setData({
            focus: true
        })
        wx.getSystemInfo({
            success: (res) => {
            this.setData({
            height: res.windowHeight*750/res.windowWidth - 400
        })
    }
    })
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
     * 页面相关事件处理函数--监听用户下拉动作,
     * 要内容满屏以后才触发
     */
    onPullDownRefresh: function () {
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},


    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    gotoSendRed(e){
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            'dataList[0]': e.currentTarget.dataset.item
        })
        wx.navigateBack({
            delta: 1,
        })
    }
})