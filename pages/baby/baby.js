// pages/baby/baby.js
const app = getApp();
import TeachService from "../../service/TeachService";
const teachService = new TeachService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    image_cache: app.globalData.image_cache,
    frompage: '',//来自预约界面
    studentList: [],//宝宝列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      frompage: options.frompage ? options.frompage : ''
    })
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
    this.init();
  },

  init: function(){
    var that = this;
    teachService
      .getStudentList({
        
      })
      .then(res => {
        var list = res.data
        for(var i = 0;i<list.length;i++){
          list[i].sex = list[i].sex == '1' ? '男' : '女';
          list[i].birthday = list[i].birthday.split(' ')[0];
        }
        that.setData({
          studentList: list
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  select: function(e){
    if (this.data.frompage == 'baby'){
      //获取已经打开的页面的数组
      var pages = getCurrentPages();
      //获取上一个页面的所有的方法和data中的数据
      var lastpage = pages[pages.length - 2]
      //改变上一个页面中的宝宝数据
      lastpage.setData({
        studentName: e.currentTarget.dataset.name,
        studentId: e.currentTarget.dataset.id,
      },() =>{
        wx.navigateBack({
          
        })
      })
    }
  },

  add: function(){
    wx.navigateTo({
      url: '../edit/edit',
    })
  },

  edit: function(e){
    wx.navigateTo({
      url: '../edit/edit?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index,
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})