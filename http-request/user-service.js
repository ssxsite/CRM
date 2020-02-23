const wxRequest = require('request.js');

module.exports = {
    login(path,params){
      var url = 'sys_user/user_wx_bind'+path;
      console.log(params);
      return wxRequest.postRequest(url,params);
    },
    resetPassword(path,params){
        var url = 'sys_user/reset_password'+path;
        return wxRequest.postRequest(url,params);
    }
}
