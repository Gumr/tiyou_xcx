// pages/my/my.js
const app = getApp();
import LoginService from "../../service/LoginService";
const loginService = new LoginService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    user: null,
    showLead: false,
    leadImgUrls: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.guide()
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
    this.user()
  },

  gouse: function(){
    wx.navigateTo({
      url: '../classpoint/classpoint',
    })
  },

  jump: function(e) {
    var name = e.currentTarget.dataset.name
    switch (name) {
      case 'baby':
        wx.navigateTo({
          url: '../baby/baby',
        })
        break;
      case 'order':
        wx.navigateTo({
          url: '../order/order',
        })
        break;
      case 'coupon':
        wx.navigateTo({
          url: '../coupon/coupon',
        })
        break;
      case 'exchange':
        wx.navigateTo({
          url: '../exchange/exchange',
        })
        break;
      case 'invite':
        wx.navigateTo({
          url: '../invite/invite',
        })
        break;
      case 'schedule':
        wx.navigateTo({
          url: '../schedule/schedule',
        })
        break;
      case 'yueke':
        this.setData({
          showLead: true,
        })
        break;
      case 'kefu':
        wx.navigateTo({
          url: '../service/service',
        })
        break;
    }
  },

  select: function(e){
    var index = e.currentTarget.dataset.index
    switch (index) {
      case '1':
        wx.navigateTo({
          url: '../record/record?tabIndex=1',
        })
        break;
      case '2':
        wx.navigateTo({
          url: '../record/record?tabIndex=2',
        })
        break;
      case '3':
        wx.navigateTo({
          url: '../record/record',
        })
        break;
    }
  },

  okHandler: function(){
    this.setData({
      showLead: false,
    })
  },
  // 充值课时
  recharge: function(){
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },

  guide: function(){
    var that = this;
    loginService
      .guide({
        
      })
      .then(res => {
        that.setData({
          leadImgUrls: res.data
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  user: function () {
    var that = this;
    app.getLoginUser(function(res){
      that.setData({
        user: res.data
      })
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