// pages/service/service.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArr: [app.globalData.image_cache + 'contact_kefu.png']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  copyTBL: function(e) {
    var that = this;
    wx.setClipboardData({
      data: '体游科学实验室',
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        })
      }
    });
  },

  previewImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.imgArr,   //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
  // onShareAppMessage: function () {

  // }
})