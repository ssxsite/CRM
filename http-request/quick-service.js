const wxRequest = require('request.js');

module.exports = {
    getSendRedHistory(path,data){
      var url = 'red_packet/history'+path;
      return wxRequest.getRequest(url,data);
    },
    getRedpacketStat(path,data){
      var url = 'red_packet/stat'+path;
      return wxRequest.getRequest(url,data);
    },
    /* 搜索商户 */
    searchCustomerlist(path,data){
        var url = 'customer/list'+path;
        return wxRequest.postRequest(url,data);
    },
    redpacketPush(path,data){
        var url = 'red_packet/push'+path;
        return wxRequest.postRequest(url,data);
    }
}
