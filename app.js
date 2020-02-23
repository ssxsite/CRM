//app.js
App({
    onLaunch: function () {
        console.log("启动");
        wx.showLoading({
            title: '加载中'
        });
        wx.checkSession({
            success: function(){
                //session_key 未过期，并且在本生命周期一直有效
                //并且登录状态Authorization值存在
                //console.log("未过期111");
                wx.hideLoading();
                wx.getStorage({
                    key: 'Authorization',
                    success(res) {
                        //console.log(res.data);
                        wx.redirectTo({
                            url:'/pages/index/index'
                        })
                    }
                })
            },
            fail: function(){
                // session_key 已经失效，需要重新执行登录流程
                //console.log("已经失效222");
                wx.hideLoading();
                wx.redirectTo({
                    url:'/pages/user/login/login'
                })
            }
        })
    },
    editTabBar: function () {
        var _curPageArr = getCurrentPages();
        var _curPage = _curPageArr[_curPageArr.length - 1];
        var _pagePath = _curPage.__route__;
        if (_pagePath.indexOf('/') != 0) {
            _pagePath = '/' + _pagePath;
        }
        var tabBar = this.globalData.tabBar;
        for (var i = 0; i < tabBar.list.length; i++) {
            tabBar.list[i].selected = false;
            if (tabBar.list[i].pagePath == _pagePath) {
                tabBar.list[i].selected = true;//根据页面地址设置当前页面状态
            }
        }
        _curPage.setData({
            tabBar: tabBar
        });
    },
    globalData: {
        DEBUG: true,  //是否打印日志
        tabBar: {
            color: "#7E8389",
            selectedColor: "#03A9F4",
            borderStyle: "white",
            backgroundColor: "white",

            list: [
                {
                    currIndex:0,
                    selectedIconPath: "/images/tab1h.png",
                    iconPath: "/images/tab1.png",
                    pagePath: "/pages/index/index",
                    text: "业绩看板",
                    clas: "menu-item1",
                    selected: true
                },
                {
                    currIndex:1,
                    selectedIconPath: "/images/tab2h.png",
                    iconPath: "/images/tab2.png",
                    pagePath: "/pages/workbench/customer_list/customer_list",
                    text: "客户管理",
                    clas: "menu-item1",
                    selected: false,
                    navigate: true
                },
                {
                    currIndex:2,
                    selectedIconPath: "/images/tab3h.png",
                    iconPath: "/images/tab3.png",
                    pagePath: "/pages/quick/send_red_detail/send_red_detail",
                    text: "发红包",
                    clas: "menu-item1",
                    selected: false,
                    navigate: true
                }
            ],
            position: "bottom"
        }
    }
})
;