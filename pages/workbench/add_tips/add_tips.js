// pages/workbench/add_tips/add_tips.js
var network = require("../../../http-request/customer-service.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // allCustomerTips: [{id: 1, labelName: '客户标签一'}, {id: 2, labelName: '客户标签2'}, {id: 3, labelName: '客户标签3'}, {id: 4, labelName: '客户标签4'}, {id: 5, labelName: '客户标签5'}, {id: 6, labelName: '客户标签6'}],//所有用户的标签
        allCustomerTips: [],//所有用户的标签
        // customerTips: [{id: 2, labelName: '客户标签2'}, {id: 4, labelName: '客户标签4'}],//该用户的标签
        customerTips: [],//该用户的标签
        show: false,
        title: '',
        barBg: '#03A9F4',
        fixed: true,
        color: '#ffffff',
        customerId:-1,//用户id
        statusBarHeight:wx.getSystemInfoSync()['statusBarHeight']+46,
        height:'',//scroll-view高度
        inputValue:''
    },

    addNewTip(){
        const _this = this
        let params = {
            labelName:_this.data.inputValue
        }
        let allCustomerTips = _this.data.allCustomerTips
        network.addNewTip('',params).then(function(res){
            if(res.data.code == '200'){
                allCustomerTips.push(res.data.datas)
                _this.setData({
                    allCustomerTips: allCustomerTips
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
    getCustomerLabels(){
        let _this = this
        network.getCustomerLabels('',{
            customerId: _this.data.customerId
        }).then(function(res){
            if(res.data.code=='200'){
                if (res.data.datas && res.data.datas.length > 0){
                    _this.setData({
                        allCustomerTips: res.data.datas
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
    lightCustomerlabel(e){
        const _this = this
        const path = `?customerId=${_this.data.customerId}&customerLabelId=${e.currentTarget.dataset.item.id}`
        network.lightCustomerlabel(path).then(function(res){
            if(res.data.code == '200'){
                var item = e.currentTarget.dataset.item
                item.light = !item.light
                var index = e.currentTarget.dataset.index
                _this.data.allCustomerTips[index] = item
                _this.setData({
                    allCustomerTips: _this.data.allCustomerTips
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.getSystemInfo({
            success: (res) => {
            this.setData({
            height: res.windowHeight*750/res.windowWidth - 200
        })
     }
    })

        const _this = this
        let customer = JSON.parse(options.Customer)
        let title = customer.name + '标签页'
        // _this.setNavigationBarTitle(title)
        _this.setData({
            title:title,
            customerId:customer.id
        })

        /*请求所有标签*/
        _this.getCustomerLabels()

        /*请求该用户的所有标签*/


        /*标签设置蓝色*/

       // _this.data.customerTips.forEach(item => {
       //      for(var i = 0, len = _this.data.allCustomerTips.length;i < len;i++){
       //      if (item.id == _this.data.allCustomerTips[i].id) {
       //          _this.data.allCustomerTips[i].light = true
       //          return false
       //      }
       //  }
       //  _this.setData({
       //      allCustomerTips: _this.data.allCustomerTips
       //  })
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
        const _this = this
        /* 页面点击返回键触发 */
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];

        let customerTips = _this.data.allCustomerTips.filter(item =>{
            return item.light == true
        })
        prevPage.setData({
            customerTips: customerTips
        })
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
    addTip() {
        this.setData({//通过setData来修改
            show: true
        });
    },
    /* 点击新建标签 */
    clickTip(e) {
        var _this = this
        var item = e.currentTarget.dataset.item
        item.light = !item.light
        var index = e.currentTarget.dataset.index
        _this.data.allCustomerTips[index] = item
        this.setData({
            allCustomerTips: this.data.allCustomerTips
        })
    },

    cancel() {
        this.setData({show: false})
        this.setData({inputValue: ''})
    },
    confirm() {
        // var item = {id: 1, text: ''}
        // var allCustomerTips = this.data.allCustomerTips
        if (this.data.inputValue) {
            // item.text = this.data.inputValue
            // allCustomerTips.push(item)
            // this.setData({
            //     allCustomerTips: allCustomerTips
            // })
            this.addNewTip()
        }
        this.setData({inputValue: ''})
        this.setData({show: false})

    },
    bindKeyInput(e){
        this.setData({
            inputValue: e.detail.value
        })
    },

    /*修改页面标题*/
    setNavigationBarTitle(title) {
        wx.setNavigationBarTitle({
            title: title
        })
    }

})