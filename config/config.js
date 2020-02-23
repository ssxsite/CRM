/**
 * 小程序配置文件
 */

var casConfig = {
  //------------------------------------------------------------------
  casHost: '',
  trainPlatformHost: '',
  //------------------------------------------------------------------
  loginUrl: '/appOpenIdLogin',
  // ssoUrl: 'web/sso/auth',
  ssoUrl: 'mobile/sso/auth',
  //以下三个值是小程序授权后获取到的
  accessToken: '',
  unionId: '',
  openId: '',
  code: ''
}

// 此处主机域名是腾讯云解决方案分配的域名
//------------------------------------------------------------------
var host = ""
//------------------------------------------------------------------
/**
 * 连接的环境，
 * dev : 开发环境
 * test1_beta ：测试1（体验版）
 * test2_beta ：测试2（体验版）
 * release_beta ：生产环境（体验版）
 * 
 * test1 ：测试1（正式版）
 * test2 ：测试2（正式版）
 * release ：生产环境（正式版）
 */
var env = 'test2'

if (env === 'dev') {
  //开发环境
  casConfig.casHost = ''
  casConfig.trainPlatformHost = ''
  host = ""
} else if (env === 'test') {
  casConfig.casHost = ''
  casConfig.trainPlatformHost = ''
  host = ''
} else {
  //生产环境（正式版）
  casConfig.casHost = ''
  casConfig.trainPlatformHost = ''
  host = ""
}
//***************************************************************************

var config = {
  env,
  registeredProfessional: null,
  // 下面的地址配合云端 Server 工作
  host,
  //CAS相关配置
  casConfig,
  // 域名地址
  apiHost: `${host}/`,
  // apiHost: `http://${host}/`,
  //登录过期跳转的页面
  loginTimeoutPage: '/pages/user/login/login',
  // 选中的domin对象
  organization: {
    domain: ''
  },
  authorizationInfo: {
    image: "/image/user-img.jpg",
    title: "地推小程序申请获得以下权限：",
    content: "获得你的公开信息（昵称、头像等）",
    applicationName: "地推小程序",
    company: ""
  }
};


module.exports = config
