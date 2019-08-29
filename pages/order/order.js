// pages/order/order.js
const app = getApp();
import RechargeService from "../../service/RechargeService";
const rechargeService = new RechargeService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    tabList: [{ name: '全部', status: '' }, { name: '待付款', status: '0' }, { name: '已完成', status: '' }],
    tabIndex: 0,//选择tab下标
    height: '',//滚动高度
    status:'',
    list:[],
    more: 'true',
    pageNo: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countHeight();
    this.init();
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

  tab: function(e){
    if (this.data.tabIndex == e.currentTarget.dataset.index){
      return
    }
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      status: e.currentTarget.dataset.status,
      more: 'true',
      pageNo: 0,
      list:[],
    },() =>{
      this.init()
    })
  },

  countHeight: function(){
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: res => {
        query.select('.tab').boundingClientRect(rect => {
          this.setData({
            height: rect ? res.windowHeight - rect.height : res.windowHeight
          })
        }).exec();
      }
    })
  },

  init: function(){
    var that = this;
    if (that.data.more == 'false') {
      return
    }
    that.data.pageNo++
    rechargeService
      .getRechargeOrderByPage({
        pageNo: that.data.pageNo,
        pageSize: 7,
        rechargeOrderStatus:that.data.status
      })
      .then(res => {
        if (res.data.list.length < 7) {
          that.setData({
            more: 'false'
          })
        }
        var new_list = that.data.list.concat(res.data.list)
        for (var i = 0; i < new_list.length; i++) {
          new_list[i].time = new_list[i].createTime.split(' ')[0]
        }
        that.setData({
          list: new_list
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  lower: function(){
    this.init()
  },

  stopTouchMove: function () {
    return false;
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})