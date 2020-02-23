// component/dropdown/dropdown.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        propArray: {
            type: Array
        },
        nowData: {
            type: Object
        },
        selectData: {
            type: Array
        }
    },
    /**
     * 页面的初始数据
     */
    data: {
        key: 0,
        nowData: {val: 1, text: '今天'},//下拉框的数组
        selectData: [{val: 1, text: '今天'}, {val: 2, text: '昨天'}, {val: 3, text: '近7天'}, {val: 4, text: '近30日'}],//下拉选项的数组
        searchId: -1,
        sort_hidden: true,//下拉框的显示或隐藏
        zhezhao: true,//遮罩层
        zhezhaoRight: true,//右边遮罩层
        dropup_pic_index: true,//选择下拉框

    },


    methods: {
        changePullDownPanel: function () {
            this.pullDownPanel = !this.pullDownPanel
        },
        selectCheckItem: function () {
            var item = e.target.dataset.item;//当前点击的索引
            this.pullDownPanel = false;
            this.orderBy = item.val
        },
        // 下拉框确定点击事件
        dropdownTap(e) {
            var _this = this;
            _this.setData({
                sort_hidden: false,//下拉框的显示或隐藏
                zhezhao: false,//遮罩层
                upordown: 'up',
            })
        },
        optionTap(e) {
            var selectData = this.data.selectData;
            var nowData = selectData[e.currentTarget.dataset.index]
            this.setData({
                key: e.currentTarget.dataset.index,//存入下拉框的key
                zhezhao: true,//遮罩层的显示或隐藏
                sort_hidden: true,//下拉框的显示或隐藏
                upordown: 'down',
                nowData: nowData
            })
            this.triggerEvent('myevent', {selectData: nowData})
        },
        hideZhezhao() {
            this.setData({
                zhezhao: true,//遮罩层的显示或隐藏
                sort_hidden: true,//下拉框的显示或隐藏
                upordown: 'down'
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('this.data.nowData====', this.data.nowData)
        this.setData({
            nowData: this.data.nowData,
            selectData: this.data.selectData
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