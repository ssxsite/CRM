/*const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}*/

var utils = {
    log:function(key,value){
        if(getApp().globalData.DEBUG){
            console.log(key,value);
        }
    },
    checkPhomeNumber: function (phoneNumber) {
        var regPhone = /^1\d{10}$/;
        return regPhone.test(phoneNumber);
    },
    /* 当天传入count = 0;前一天传入count = 1;最近7天传入count = 7;*/
    getRecentFormatTime(count) {
        // 拼接时间
        let time1 = new Date()
        time1.setTime(time1.getTime())
        let Y1 = time1.getFullYear()
        let M1 = ((time1.getMonth() + 1) > 10 ? (time1.getMonth() + 1) : '0' + (time1.getMonth() + 1))
        let D1 = (time1.getDate() > 10 ? time1.getDate() : '0' + time1.getDate())
        let H1 = time1.getHours()
        let m1 = time1.getMinutes()
        let S1 = time1.getSeconds()
        let timer1 = `${Y1}-${M1}-${D1}  ${H1}:${m1}:${S1}`// 当前时间
        let time2 = new Date()
        time2.setTime(time2.getTime() - (24 * 60 * 60 * 1000 * count))
        let Y2 = time2.getFullYear()
        let M2 = ((time2.getMonth() + 1) > 10 ? (time2.getMonth() + 1) : '0' + (time2.getMonth() + 1))
        let D2 = (time2.getDate() >= 10 ? time2.getDate() : '0' + time2.getDate())
        let timer2 = `${Y2}-${M2}-${D2} 00:00:00`// 之前的7天或者30天
        if(count==1){   //昨天的只取昨天一整天的   00:00:00~23:59:59
            timer1 = `${Y2}-${M2}-${D2} 23:59:59`
        }
        return {
            t1: timer1,
            t2: timer2
        }
    },

    /* 获取最大金额 */
     getUnit(arr) {
         var tempArr = JSON.parse(JSON.stringify(arr))
         var maxVal = tempArr.sort(function (a, b) {
             return b - a
         })[0]
         var divisor = 1
         var unit = ''
         if (maxVal >= 0 && maxVal < 10000) {
             divisor = 1
             unit = '金额 (元)'
         } else if(maxVal >= 10000 && maxVal < 100000000) {
             divisor = 10000
             unit = '金额 (万)'
         }else {
             divisor = 100000000
             unit = '金额 (亿)'
         }
         return {divisor:divisor,tunit:unit}
     }
};

module.exports = utils;