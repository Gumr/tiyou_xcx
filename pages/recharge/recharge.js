// pages/recharge/recharge.js
const app = getApp();
import RechargeService from "../../service/RechargeService";
const rechargeService = new RechargeService();
import LoginService from "../../service/LoginService";
const loginService = new LoginService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    image_cache: app.globalData.image_cache,
    selectIndex: 0, //选择充值课时
    agreement: true, //选择协议
    rechargeList: [],
    rechargeGoodsId: '', //充值商品id
    total: '', //实付
    user: '',
    canPay: true,//点击一次
    shareTag: false,//是否分享进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init();
    this.user();
    if (getCurrentPages().length == 1) {
      this.setData({
        shareTag: true,
      })
    }
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

  agreement: function() {
    this.setData({
      agreement: !this.data.agreement
    })
  },

  init: function() {
    var that = this;
    rechargeService
      .getRechargeGoodsList({

      })
      .then(res => {
        that.setData({
          rechargeList: res.data,
          rechargeGoodsId: res.data[0].rechargeGoodsId,
          total: res.data[0].price / 100,
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  user: function() {
    var that = this;
    app.getLoginUser(function (res) {
      that.setData({
        user: res.data
      })
    })
  },

  select: function(e) {
    this.setData({
      rechargeGoodsId: e.currentTarget.dataset.id,
      total: e.currentTarget.dataset.total / 100,
    })
  },

  recharge: function() {
    var that = this;
    if (that.data.agreement != true) {
      wx.showToast({
        title: '请先勾选协议',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    if (that.data.canPay == false){
      return
    }
    that.setData({
      canPay: false,
    })
    rechargeService
      .createRechargeOrder({
        rechargeGoodsId: that.data.rechargeGoodsId,
        channelNo: app.globalData.channelNo
      })
      .then(res => {
        that.doWxPay(res.data)
      })
      .catch(err => {
        that.setData({
          canPay: true,
        })
        wx.hideLoading();
      });
  },

  doWxPay: function(rechargeOrderId) {
    var that = this;
    rechargeService
      .doWxPay({
        rechargeOrderId: rechargeOrderId
      })
      .then(res => {
        that.wxPay(res.data, rechargeOrderId)
      })
      .catch(err => {
        that.setData({
          canPay: true,
        })
        wx.hideLoading();
      });
  },

  wxPay: function (params, rechargeOrderId) {
    var that = this;
    wx.requestPayment({
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.package_,
      signType: params.signType,
      paySign: params.paySign,
      success(res) {
        wx.showToast({
          title: '充值成功',
          icon: 'success',
          duration: 1500
        })
        that.setData({
          canPay: true,
        })
        setTimeout(() =>{
          if (getCurrentPages().length == 1){
            wx.switchTab({
              url: "../my/my",
            })
          }else{
            wx.navigateBack({

            })
          }
        },1500)
      },
      fail(res) {
        // 取消支付 或支付失败
        that.setData({
          canPay: true,
        })
        rechargeService
          .cancelRechargeOrder({
            rechargeOrderId: rechargeOrderId
          })
          .then(res => {
            wx.showToast({
              title: '支付失败，请重新支付',
              icon: 'none',
              duration: 2000
            })
          })
          .catch(err => {
            wx.hideLoading();
          });
      }
    })
  },

  backHome: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  
  xy: function(){
    wx.navigateTo({
      url: '../agreement/agreement',
    })
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})