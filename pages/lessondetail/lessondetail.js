// pages/lessondetail/lessondetail.js
const app = getApp();
let WxParse = require('../../wxParse/wxParse.js');
import CourseService from "../../service/CourseService";
const courseService = new CourseService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    currentIndex: 0,
    courseList:[],
    courseId:'',//课程id
    areaId:'',//区域id
    isIpx: app.globalData.isIpx,
    shareTag: false,//是否分享进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      courseId: options.id ? options.id : ''
    })
    this.init()
    if (getCurrentPages().length == 1){
      this.setData({
        shareTag: true,
      })
    }
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

  init: function (options) {
    var that = this;
    courseService
      .getCourseByCouseId({
        courseId: that.data.courseId
      })
      .then(res => {
        wx.setNavigationBarTitle({
          title: res.data.courseName,
        })
        // 主题介绍
        if (res.data.detail){
          WxParse.wxParse('article', 'html', res.data.detail, that, 5);
        }
        that.setData({
          courseList: res.data
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  reserveLessonDetail: function(e){
    wx.navigateTo({
      url: '../lesson/lesson?courseId=' + e.currentTarget.dataset.id + '&courseName=' + e.currentTarget.dataset.title,
    })
  },

  // 切换swiper
  handleChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },

  backHome: function(){
    wx.switchTab({
      url: '../index/index',
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
  onShareAppMessage: function () {

  }
})