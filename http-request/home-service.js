const wxRequest = require('request.js');

module.exports = {

    // 业绩看板
    homePerformance(path,data){
      var url = 'board/performance'+path;
      return wxRequest.getRequest(url,data);
    },
    // 活跃客户
    customerHotData(path,data) {
      var url = 'customer/hot/stat'+path;
      return wxRequest.getRequest(url,data);
   },
    // 业绩看板->业绩数据
    performancePageData(path,data) {
        var url = 'board/performance/data'+path;
        return wxRequest.getRequest(url,data);
    },
    // 业绩看板->业绩数据->分类数据
    performance_category(path,data) {
        var url = 'board/performance/data/category'+path;
        return wxRequest.getRequest(url,data);
    },
    // 销售看板(商品销售top)->品牌列表
    board_brand(path,data) {
        var url = 'board/sale/nav/brand'+path;
        return wxRequest.getRequest(url,data);
    },
    // 销售看板(商品销售top)->分类下拉列表
    board_category(path,data) {
        var url = 'board/sale/nav/category'+path;
        return wxRequest.getRequest(url,data);
    },
    // 销售看板(商品销售top)->获取商户类型列表
    board_customer_type(path,data) {
        var url = 'board/sale/nav/customer_type'+path;
        return wxRequest.getRequest(url,data);
    },
    //销售看板(商品销售top)->商品列表
    board_goods(path,data) {
        var url = 'board/sale/nav/goods'+path;
        return wxRequest.getRequest(url,data);
    },
    // 销售看板(商品销售top)->结果列表
    top_result_list(path,data) {
        var url = 'board/sale/top/goods'+path;
        return wxRequest.getRequest(url,data);
    },

    // 获取业务员详情
    userInfo_detail(path,data) {
        var url = 'sys_user/detail'+path;
        return wxRequest.getRequest(url,data);
    },
}

