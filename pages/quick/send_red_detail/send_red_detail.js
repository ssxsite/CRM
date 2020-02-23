// pages/quick/send_red_detail.js
var network = require("../../../http-request/quick-service.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        titleList: ['商户账号', '商户名称 ', '商户类型'],
        // dataList: [
        //     {
        //         id:1,
        //         account: '13100000001',
        //         name: ' 商户名称A商户名称A商户名称A商户名称A',
        //         customerType: ' 便利店',
        //         delBtn:true
        //     }
        // ],
        dataList: [],
        balance:'',//余额
        money:'',//发送金额
        btnDisabled: false,
        title: '发放红包',
        barBg: '#03A9F4',
        fixed: true,
        color: '#ffffff',
        maxAmount:0,
        selectId:-1,
        statusBarHeight:wx.getSystemInfoSync()['statusBarHeight']+46
    },
    /*获取余额*/
    getRedpacketStat(){
        const _this = this
        network.getRedpacketStat('').then(function(res){
                if(res.data.code=='200'){
                    _this.setData({
                        balance: res.data.datas.balance.toFixed(2),
                        maxAmount:res.data.datas.maxAmount
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

    /*路由跳转*/
    gotoCustomer: function () {
        wx.navigateTo({
            url: '/pages/quick/search_customer/search_customer'
        })
    },
    gotoHistory:function () {
        wx.navigateTo({
            url: "/pages/quick/send_history/send_history"
        })
    },

    /*发送红包*/
    moneyInput(e) {
        const _this = this
        let money;
        if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
            money = e.detail.value;
        } else {
            money = e.detail.value.substring(0, e.detail.value.length - 1);
        }
        if (money && money[0] == '.') {
            money = '0'+ money
        }
        _this.setData({
            money: money
        })
        _this.conpareBalanceValidate()
        _this.maxMoneyValidate()
        if (!_this.data.money) {
            _this.setData({
                btnDisabled: false
            })
        }
    },
    maxMoneyValidate(e){
        const _this = this
        let money
        money = (_this.data.money - _this.data.maxAmount > 0) ? '': _this.data.money
        this.setData({
            money: money
        })
    },
    conpareBalanceValidate(){
        let _this = this
        _this.setData({
            btnDisabled: (_this.data.money - _this.data.balance > 0) ? true: false
        })
    },
    sendMoney(e){
        const _this = this
        let title = '发送失败'
        if(_this.data.dataList.length > 0){
            let param = {
                customerIds:[_this.data.dataList[0].id],
                redAmount:_this.data.money
            }
            network.redpacketPush('',param).then(function(res){
                if(res.data.code == '200'){
                    wx.showToast({
                        title: '发送成功',
                        icon: 'succes',
                        duration: 1500,
                        mask:true
                    })
                    _this.getRedpacketStat()
                }else{
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 1500,
                        mask:true
                    })
                }
            });
        }else {
            wx.showToast({
                title: '请先选择商户',
                icon: 'none',
                duration: 1500,
                mask:true
            })
        }
        _this.setData({
            money: ''
        })
    },

    /*删除*/
    deleteTr(e){
        const _this = this
        var index = parseInt(e.currentTarget.dataset.index)
        _this.data.dataList.splice(index,1)
        _this.setData({
            dataList: _this.data.dataList
        });
    },
    touchS(e) {
        // 获得起始坐标
        var _this = this
        var item = e.currentTarget.dataset.item; //通过这个传递数据
        var selectId = e.currentTarget.dataset.item.id
        _this.setData({
            selectId: selectId
        })
        _this.startX = e.touches[0].clientX;
        _this.startY = e.touches[0].clientY;
    },
    touchM(e) {
        var _this = this
        // 获得当前坐标
        _this.currentX = e.touches[0].clientX;
        _this.currentY = e.touches[0].clientY;
        const x = this.startX - this.currentX; //横向移动距离
        const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
        if (x > 35 && y < 110) {
            //向左滑是显示删除
            _this.setData({
                status: true
            })
        } else if (x < -35 && y < 110) {
            //向右滑
            _this.setData({
                status: false
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getRedpacketStat()
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
        this.setData({
            status: false
        })
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