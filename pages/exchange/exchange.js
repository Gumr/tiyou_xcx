// pages/ exchange/exchange.js
const app = getApp();
import RechargeService from "../../service/RechargeService";
const rechargeService = new RechargeService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    image_cache: app.globalData.image_cache,
    success: false,//兑换成功
    code:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  
  enter: function(e){
    this.setData({
      code: e.detail.value
    })
  },

  sure: function(){
    var that = this;
    if(that.data.code == ''){
      wx.showToast({
        title: '兑换码不能为空',
        icon: 'none',
        duration: 2000
      })
      return
    }
    rechargeService
      .useRedeemCode({
        code: that.data.code
      })
      .then(res => {
        that.setData({
          success: true,
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  back: function(){
    this.setData({
      success: false
    },() =>{
      wx.switchTab({
        url: '../my/my',
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})