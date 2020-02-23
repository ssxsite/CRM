let config = require('../config/config.js')
/*
 * 接口公共访问方法
 * @param  requestUrl  请求地址
 * @param  param      请求参数
 * @param  requestType 请求方式  GET POST
 */
function getData(requestUrl, param, requestType) {
  return new Promise((resolve, reject) => {
    var params = arguments[1] ? arguments[1] : {}
    var requestType = arguments[2] ? arguments[2] : 'GET'
    if (requestType == 'GET') {
      // requestUrl = requestUrl + '?requestString=' + JSON.stringify(this.requestParam(params))
      requestUrl = requestUrl + this.requestGetParamStr(params)
      params = {}
    }
    else {
      params = this.requestParam(params)
    }
    console.log('---------->网络请求：' + requestUrl + ',参数：' + JSON.stringify(params))
    var startTime = new Date().getTime() 
    let domainPath = config == undefined ? '' : config.organization.domain
    var agreementType ='https'
    if(requestUrl.indexOf("http:")!=-1){
      agreementType='http'
    }
    let header = {
      'content-type': 'application/json', // 默认值
      'Hb-Domain-Path': domainPath == null ? "" : domainPath,
      'requestType': agreementType
    }

    var cookie = getCookie(requestUrl)
    if (cookie !== undefined && cookie !== '') {
      header.Cookie = cookie
    }
    wx.request({
      url: requestUrl,
      method: requestType,
      header: header,
      data: params,
      success: function (res) {
        var endTime = new Date().getTime()
        console.log('---------->请求时间:' + (endTime - startTime) + '毫秒;请求接口：' + requestUrl)
        console.log('---------->返回结果：' + JSON.stringify(res.data))
        if (res) {
          if (res.statusCode == 200) {
            if (res.data.head === undefined) {
              //返回数据的结构不合法
              let resultData = { head: { code: 300, message: '请求失败' }, data: {} }
              resolve(resultData)
            } else {
              if (requestUrl.indexOf('mobile/home') == -1) {
                putCookie(requestUrl, res)
              }
              resolve(res.data)
            }
          } else if (res.statusCode == 401) { //未登录
            let resultData = { head: { code: 401, message: '请求失败，没有权限' }, data: {} }
            resolve(resultData)
            //删除COOKIE缓存
            clearCookies()
            // 登录过期 loginTimeoutPage
            var appConfig = getApp().config
            var pages = getCurrentPages()    //获取加载的页面

            var currentPage = pages[pages.length - 1]    //获取当前页面的对象

            var url = '/' + currentPage.route    //当前页面url
            if (url != appConfig.loginTimeoutPage) {
              wx.reLaunch({
                url: appConfig.loginTimeoutPage
              })
            }
          } else {
            let resultData = { head: { code: 300, message: '请求失败' }, data: {} }
            resolve(resultData)
          }
        } else {
          console.log('网络访问失败：' + JSON.stringify(res))
          let resultData = { head: { code: 300, message: '网络访问失败：' }, data: {} }
          resolve(resultData)
        }
      },
      fail: function (res) {
        console.log('网络访问失败：' + JSON.stringify(res))
        let resultData = { head: { code: 300, message: '网络访问失败：' }, data: {} }
        resolve(resultData)
      },
      complete: function (res) { }
    })
  })
}

/**
 * 获取时间  格式化
 * @returns {string}
 */
function getNowFormatDate() {
  let date = new Date()
  let seperator1 = '-'
  let seperator2 = ':'
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds()
  return currentdate
}

/**
 * 处理请求参数转换 data的数据json转为请求参数head-data形式
 * @param params
 * @returns {*}
 */
function requestParam(params) {
  var res = wx.getSystemInfoSync()
  let requestParams = {
    head: {
      appVersion: res.version,                    //微信版本号
      osPlatform: res.platform + ' ' + res.system,//平台  系统版本号
      requestTime: getNowFormatDate()        //请求时间
    },
    data: null
  }
  requestParams.data = params
  return requestParams
}

/**
 * GET请求参数 拼接  ？requestString
 */
function requestGetParamStr(params) {
  return '?requestString=' + encodeURI(JSON.stringify(this.requestParam(params)))
}

// COOKIE集
var COOKIES = undefined

/**
 * 清空COOKIE集
 */
function clearCookies() {
  COOKIES = undefined
  wx.removeStorage({
    key: 'COOKES'
  })
}

function getCookies() {
  if (COOKIES === undefined) {
    COOKIES = wx.getStorageSync('COOKES')
  }
  if (COOKIES === undefined || COOKIES === '') {
    COOKIES = {}
  }
  return COOKIES
}

/**
 * 保存COOKIE
 * @param url
 * @param httpRes
 */
function putCookie(url, httpRes) {
  if (url === undefined || httpRes === undefined) {
    return
  }
  if (httpRes.statusCode === 200) {
    var cookie = httpRes.header['Set-Cookie']
    if (cookie === undefined) {
      return
    }
    var host = analysisUrl(url).host
    getCookies()
    COOKIES[host] = cookie
    wx.setStorage({
      key: "COOKES",
      data: COOKIES
    })
  }
}

/**
 * 读取COOKIE值
 * @param url
 */
function getCookie(url) {
  if (url === undefined) {
    return
  }
  var host = analysisUrl(url).host
  getCookies()
  return COOKIES[host]
}

/**
 * 解析URL结构，返回对象
 {
  "url":"",
  "scheme":"",
  "host":"",
  "port":"",
  "path":"",
  "query":""
 }
 */
function analysisUrl(url) {
  try {
    // // var parse_url = '/^(?:([A-Za-z]+):)?(/ / { 0,3})([0 - 9. / -A - Za - z] +)(?::(/d+))?(?:/ / ([^?#] *)) ? (?:/?([^#]*))?(?:#(.*))?$/';  
    // // var result = parse_url.exec(url);

    // // 正则表达式来源：http://blog.csdn.net/t_1007/article/details/52293475  
    //var reg = new RegExp('^((ht|f)tps?:)\/\/([\w-]+(\.[\w-]+)*\/){1}(([\w-]+(\.[\w-]+)*\/?)*)?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?$', 'g')

    //参考：http://blog.csdn.net/hongweigg/article/details/40659731
    //var reg = /^(\w+):\/\/([^\/:]*)(?::(\d+))?\/(.*)/
    var reg = /^(\w+):\/\/([^\/:]*)(?::(\d+))?\/([^\/]*)(\/.*)/
    var result = reg.exec(url)
    //console.log(result)  
    var names = ['url', 'scheme', 'host', 'port', 'path', 'query']
    let length = names.length
    let ret = {}
    for (var i = 0; i < length; i++) {
      ret[names[i]] = result[i]
    }
    if (ret.port === undefined && ret.scheme !== undefined) {
      if (ret.scheme.toLowerCase() === 'http') {
        ret.port = '80'
      } else if (ret.scheme.toLowerCase() === 'https') {
        ret.port = '443'
      }
    }
    //console.log(ret)
    return ret
  } catch (e) {
    console.log(e)
    console.log(url)
  }
  return {}
}

module.exports = {
  requestParam: requestParam,
  getNowFormatDate: getNowFormatDate,
  requestGetParamStr: requestGetParamStr,
  getData: getData,
  clearCookies: clearCookies,
  putCookie: putCookie,
  getCookie: getCookie
}