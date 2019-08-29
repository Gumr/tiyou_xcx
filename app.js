//app.js
var gio = require("utils/gio-minp/index.js").default;
import LoginService from "service/LoginService";
const loginService = new LoginService();

App({
  onLaunch: function() {
    const that = this;
    // 检测新版本
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            });
          });
        }
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    };
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /*监听网络状态变化可根据业务需求进行调整*/
    wx.onNetworkStatusChange(function(res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000,
          complete: function() {

          }
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });

    // 获取设备信息
    wx.getSystemInfo({
      success(res) {
        // console.log(res);
        let deviceModel = 'iPhone X';
        if (res.model.indexOf(deviceModel) > -1) {
          that.globalData.isIpx = true;
        }
      },
    });
  },
  // 获取登录用户信息
  getLoginUser: function(callBack) {
    loginService
      .getLoginUser({

      })
      .then(res => {
        callBack(res)
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  onPageNotFound(res) {
    wx.switchTab({
      url: 'pages/index/index',
    })
  },

  globalData: {
    userInfo: null,
    isConnected: true,
    channelNo: 'ty_wxminiapp',
    image_cache: 'https://client.tiyoukids.com/static/image/mnapp/',
    isIpx: '', //是否iPhone X
    city: '',
    city_code: '',
    longitude: '',
    latitude: '',
  }
})