var app = getApp();
import LoginService from "../../service/LoginService";
const loginService = new LoginService();
const gio = require("../../utils/gio-minp/index.js").default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    code: '', //获取code
    userinfo: 'false', //是否显示用户信息 false 不显示
    phoneNum: 'false', //是否显示手机号
    jump: '',//跳到登录页来源
    logging: false,//登录中
    infoAndPhone: false,//信息+手机号
    userData: null,//用户授权加密信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.judgeToken();
    this.setData({
      jump: options.jump ? options.jump : ''
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  judgeToken: function() {
    var that = this;
    if (!wx.getStorageSync('token')) {
      that.getUser()
    } else {
      // 存在token 获取用户信息
      wx.checkSession({
        success: function (res) {
          //session_key 未过期，并且在本生命周期一直有效
          that.checkUserToken()
        },
        fail: function (res) {
          // session_key 已经失效，需要重新执行登录流程
          wx.removeStorageSync('token')
          that.getUser();
        }
      })
    }
  },

  // 存在token获取用户信息
  checkUserToken: function() {
    var that = this;
    loginService
      .checkUserToken({

      })
      .then(res => {
        if (res.code == '0030'){
          // 未登录
          wx.removeStorageSync('token')
          that.getUser();
        } else if (res.code == '0000'){
          // 判断手机号
          if (res.data.bindPhone == false){
            //需要手机号
            that.setData({
              phoneNum: 'true'
            }) 
          } else {
            that.jump()
          }
        }
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  jump: function(){
    var that = this;
    // 登录中
    that.setData({
      logging: true,
    })
    setTimeout(() =>{
      if (that.data.jump) {
        if (that.data.jump == 'my/my' || that.data.jump == 'reserve/reserve') {
          wx.switchTab({
            url: "../" + that.data.jump
          })
        } else {
          var query = wx.getStorageSync('query')
          wx.redirectTo({
            url: '../' + that.data.jump + '?' + query
          })
          wx.removeStorage({
            key: 'query',
            success: function (res) { },
          })
        }
      } else {
        wx.switchTab({
          url: "../index/index",
        })
      }
    },250)
  },

  // 不存在token先获取用户信息 再登录
  getUser: function(){
    var that = this;
    that.getCode(function () {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                wx.setStorageSync('userInfo', res.userInfo)
                that.setData({
                  userData: res
                })
                that.codeLogin(res)
              },
              fail: res =>{
                console.log('获取信息失败');
                that.getUser();
              },
            })
          } else {
            that.setData({
              userinfo: 'true'
            })
          }
        },
        fail: res =>{
          that.getUser();
        }
      })
    })
  },

  // 获取code
  getCode: function(cb) {
    var that = this;
    wx.login({
      success: res => {
        that.setData({
          code: res.code
        }, () => {
          typeof cb == "function" && cb()
        })
      }
    })
  },

  // 登录 code encryptedData iv
  codeLogin: function(res) {
    var that = this;
    // growing io 埋点
    gio('setVisitor', res.userInfo);
    loginService
      .wxMiniLogin({
        'jscode': that.data.code,
        'encryptedData': res.encryptedData,
        'iv': res.iv,
        'signature': res.signature,
        'rawData': res.rawData,
        'channelNo': app.globalData.channelNo,
      })
      .then(res => {
        if(res.code == '0070'){
          //获取手机号
          that.setData({
            phoneNum: 'true',
            infoAndPhone: true
          })
        }else{
          // growing io 埋点
          gio('setUserId', res.data.sid);
          wx.setStorageSync('token', res.data.sid)
          // 判断是否需要手机号 不需要手机号直接跳转 需要手机号更新code
          if (res.data.bindPhone == true) {
            // 直接跳转
            that.jump();
          } else {
            //需要手机号
            that.setData({
              phoneNum: 'true'
            })
          }
        }
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  // 更新手机号
  phone: function(res) {
    var that = this;
    loginService
      .wxMiniBindPhone({
        'encryptedData': res.encryptedData,
        'iv': res.iv,
      })
      .then(res => {
        if (res.code == '0000') {
          that.jump()
        }
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  //手机号+用户信息登录
  infoAndPhone: function(e){
    var that = this;
    that.getCode(function () {
      loginService
        .wxMiniLogin({
          'jscode': that.data.code,
          'encryptedData': that.data.userData.encryptedData,
          'iv': that.data.userData.iv,
          'signature': that.data.userData.signature,
          'rawData': that.data.userData.rawData,
          'channelNo': app.globalData.channelNo,
          'phoneEncryptedData': e.encryptedData,
          'phoneIv': e.iv,
        })
        .then(res => {
          // growing io 埋点
          gio('setUserId', res.data.sid);
          wx.setStorageSync('token', res.data.sid)
          that.jump();
        })
        .catch(err => {
          wx.hideLoading();
        });
    })
  },

  bindGetUserInfo: function(e) {
    // 用户点击授权后，登陆
    if (!e.detail.userInfo) {
      return;
    }
    if (app.globalData.isConnected) {
      this.setData({
        userinfo: 'false',
        userData: e.detail,
      })
      this.codeLogin(e.detail)
      wx.setStorageSync('userInfo', e.detail.userInfo) 
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  bindGetPhoneNumber: function(e) {
    console.log(e)
    if (e.detail.errMsg != 'getPhoneNumber:ok') {
      // 拒绝授权
      return;
    }
    if (app.globalData.isConnected) {
      this.setData({
        phoneNum: 'false'
      })
      if(this.data.infoAndPhone == true){
        // 手机号+用户信息登录
        this.infoAndPhone(e.detail)
      }else{
        this.phone(e.detail)
      }
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
})