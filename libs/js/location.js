const QQMapWX = require('qqmap-wx-jssdk.js');
const app = getApp();
var qqmapsdk = new QQMapWX({
  key: 'LSEBZ-LZXCU-CCQVF-2HK76-FSGYK-C7BTV' // 必填
});


function getCity(callBack, location) {
  var _this = this;
  wx.getLocation({
    type: 'wgs84',
    success: function(res) {
      if (location == true) {
        callBack(res)
      } else {
        locationMt(res.latitude, res.longitude, callBack)
      }
    },
    fail: function(res) {
      // console.log(res)
      // 拒绝授权打开设置
      setting(callBack, location);
    }
  })
}

// 拒绝授权打开设置
function setting(callBack, location) {
  var _this = this;
  wx.getSetting({
    success: function(res) {
      var statu = res.authSetting;
      if (!statu['scope.userLocation']) {
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则部分功能将无法使用',
          showCancel: false,
          confirmColor: '#0075ff',
          success: function(tip) {
            if (tip.confirm) {
              wx.openSetting({
                success: function(data) {
                  if (data.authSetting["scope.userLocation"] === true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    //授权成功之后，再调用chooseLocation选择地方
                    wx.getLocation({
                      type: 'wgs84',
                      success: function(res) {
                        if (location == true) {
                          callBack(res)
                        } else {
                          locationMt(res.latitude, res.longitude, callBack)
                        }
                      },
                    })
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'success',
                      duration: 1000
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '授权失败',
                icon: 'success',
                duration: 1000
              })
            }
          }
        })
      } else {
        //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
        wx.showModal({
          title: '',
          content: '请在系统设置中打开定位服务',
          confirmText: '确定',
          showCancel: false,
          confirmColor: '#0075ff',
          success: function(res) {

          }
        })
      }
    },
    fail: function(res) {
      wx.showToast({
        title: '调用授权窗口失败',
        icon: 'success',
        duration: 1000
      })
    }
  })
}

// 城市定位
function locationMt(latitude, longitude, callBack) {
  var that = this;
  // 定位自己的城市，需要引入第三方api
  //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude
    },
    success: function(res) {
      if (res.result.ad_info.city_code != '156440300') {
        wx.showModal({
          title: '温馨提示',
          content: '是否切换到深圳',
          showCancel: true,
          cancelText: "取消",
          cancelColor: '#353535', 
          confirmText: "确定",
          confirmColor: '#FFB451',
          success: function(response) {
            if (response.cancel) {
              callBack(res.result.address_component.city, res.result.ad_info.city_code.replace('156', ''), res.result.ad_info.location.lng, res.result.ad_info.location.lat)
            } else {
              app.globalData.city = '深圳市';
              app.globalData.city_code = '440300';
              app.globalData.longitude = '114.036996';
              app.globalData.latitude = '22.656415';
              callBack('深圳市', '440300', '114.036996','22.656415')
            }
          },
          fail: function(res) {}, //接口调用失败的回调函数
          complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
        })
      } else {
        app.globalData.city = res.result.address_component.city;
        app.globalData.city_code = res.result.ad_info.city_code.replace('156', '');
        app.globalData.longitude = res.result.ad_info.location.lng;
        app.globalData.latitude = res.result.ad_info.location.lat;
        callBack(res.result.address_component.city, res.result.ad_info.city_code.replace('156', ''), res.result.ad_info.location.lng, res.result.ad_info.location.lat)
      }
    },
    fail: function(res) {
      //定位失败
    }
  })
}

module.exports = {
  getCity: getCity,
  setting: setting,
  locationMt: locationMt
}