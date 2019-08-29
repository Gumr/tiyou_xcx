const util = require('./util.js');
// const BASE_URL = "https://tclient.tiyoukids.com"; //测试环境
const BASE_URL = "https://client.tiyoukids.com"; //生产环境
// const BASE_URL = "http://192.168.1.162:8090"; //丹丹环境
// const BASE_URL = "http://192.168.1.142:10100"; //周环境




const sideEffect = {
  beforeRequest(options) {
    if (options.hasOwnProperty("loadingMsg")) {
      wx.showLoading({
        title: "" + options.loadingMsg,
        mask: true,
      });
    }
  },
  afterRequest(options) {
    if (options.hasOwnProperty("loadingMsg")) {
      wx.hideLoading();
    }
  }
};

function filterParams(params) {
  let res = {};
  Object.keys(params).forEach(key => {
    if (params[key] === null || params === undefined) {
      return;
    }
    res[key] = params[key];
  });
  return res;
}





export function request(method, contentType, api, params = {}, options = {}) {
  sideEffect.beforeRequest(options);
  if (Object.prototype.toString.call(params) === '[Object Object]') {
    params = filterParams(params);
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: (options.url || BASE_URL) + api,
      data: params,
      method,
      header: {
        "content-type": contentType,
        "TY-SID": wx.getStorageSync('token'),
        'reqNo': new Date().getTime() + Math.random().toString(36).substr(2, 15),
      },
      success(res) {
        const currentPage = getCurrentPages()[getCurrentPages().length - 1].route.split('/')[1];
        if (res.data.code == '0000' || (res.data.code == '0030' && currentPage == 'authorize')) {
          resolve(res.data);
        } else if (res.data.code == '0070' && currentPage == 'authorize') {
          // 不存在该用户
          resolve(res.data);
        } else if (res.data.code == '0030' && currentPage != 'authorize') {
          wx.getSetting({
            success: response => {
              if (response.authSetting['scope.userInfo']) {
                login(function(data) {
                  resolve(data)
                }, res)
              } else {
                jumplogin(res)
              }
            }
          })
        } else {
          setTimeout(function() {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }, 100)
        }
      },
      fail(e) {
        reject({
          info: "网络请求失败"
        });
      },
      complete() {
        sideEffect.afterRequest(options);
      }
    });

    // 登录 
    function login(callBack, resdata) {
      wx.login({
        success: response => {
          wx.getUserInfo({
            success: res => {
              wx.showLoading({
                title: "登录中...",
                mask: true,
              });
              wx.request({
                url: BASE_URL + '/api/user/wxMiniLogin', //登录
                method: 'post',
                data: {
                  'jscode': response.code,
                  'encryptedData': res.encryptedData,
                  'iv': res.iv,
                  'signature': res.signature,
                  'rawData': res.rawData,
                  'channelNo': getApp().globalData.channelNo,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded',
                  'reqNo': new Date().getTime() + '_' + Math.random().toString(36).substr(2, 15),
                },
                success: function(resp) {
                  wx.hideLoading();
                  if (resp.data.code == '0000' && resp.data.data.bindPhone == true && resp.data.data.sid) {
                    wx.setStorageSync('token', resp.data.data.sid)
                    // 登录后重新请求接口
                    wx.request({
                      url: (options.url || BASE_URL) + api,
                      data: params,
                      method,
                      header: {
                        "content-type": contentType,
                        "TY-SID": wx.getStorageSync('token'),
                        'reqNo': new Date().getTime() + Math.random().toString(36).substr(2, 15),
                      },
                      success(res) {
                        callBack(res.data)
                      }
                    })
                  } else {
                    jumplogin(resdata)
                  }
                }
              })
            },
            fail: res => {

            },
          })
        }
      })
    }

    // 未登录跳转登录
    function jumplogin(res) {
      wx.setStorageSync('query',  decodeURIComponent(util.getCurrentPageUrlWithArgs()))
      wx.removeStorage({
        key: 'token',
        success: function(data) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 500,
            mask: true
          });
          setTimeout(() => {
            wx.redirectTo({
              url: '../authorize/authorize?jump=' + getCurrentPages()[getCurrentPages().length - 1].route.replace('pages/', ''),
            })
          }, 500)
        },
        fail: function(data) {

        }
      })
    }
  });
}

export function get(api, params = {}, options = {}) {
  return request("GET", "", api, params, options);
}

export function post(api, params = {}, options = {}) {
  return request("POST", "application/x-www-form-urlencoded", api, params, options);
}

export function postJson(api, params = {}, options = {}) {
  return request("POST", "application/json", api, params, options);
}

export function put(api, params = {}, options = {}) {
  return request("PUT", "application/json", api, params, options);
}

export {
  BASE_URL
}




/*
api 接口请求路径
params 数据
options  loadingMsg加载状态gif
type  自定义content-type
*/