const wxRequest = require('request.js');

module.exports = {
    customerList(path,data){
        var url = 'customer/hotstate/list'+path;
        return wxRequest.postRequest(url,data);
    },
    addNewTip(path,data){
        var url = 'customer_label/add'+path;
        return wxRequest.postRequest(url,data);
    },
   /* 客户面板的标签 */
    getCustomerLabels(path,data){
        var url = 'customer_label/customer_labels'+path;
        return wxRequest.getRequest(url,data);
    },
    /*筛选面板的*/
    userLabels(path,data){
        var url = 'customer_label/user_labels'+path;
        return wxRequest.getRequest(url,data);
    },
    lightCustomerlabel(path,data){
        var url = 'customer_label/light'+path;
        return wxRequest.postRequest(url,data);
    },
    customerBuyList(path,data){
        var url = 'customer/buy/list'+path;
        return wxRequest.getRequest(url,data);
    }

}
