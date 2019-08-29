//index.js
//获取应用实例
const app = getApp();
import CourseService from "../../service/CourseService";
const courseService = new CourseService();
Page({
  data: {
    image_cache: app.globalData.image_cache,
    imgUrls: [], //图片轮播
    adBanner: null, //广告
    interval: 4000,
    duration: 400,
    circular: true,
    leftMargin: '16rpx',
    rightMargin: '30rpx',
    currentIndex: 0,
    timestamp: new Date().getTime(),
    courseThemeList: [], //主题课程列表
    getCourseListByPick: [], //精选课程
  },

  // 切换swiper
  handleChange: function(e) {
    this.setData({
      currentIndex: e.detail.current
    })
  },

  onLoad: function(options) {
    if(options){
      app.globalData.channelNo = options.channelNo ? options.channelNo : app.globalData.channelNo
    }
    // banner
    this.getAdvimgList('1')
    this.getAdvimgList('2')
    // 获取首页精选课程
    this.getCourseListByPick()
    // 获取主题课程列表
    this.getCourseThemeList()
  },

  onShow: function() {

  },

  // 下拉刷新
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    setTimeout(() =>{
      this.onLoad()
    },1500) 
  },

  getAdvimgList: function(advType) {
    var that = this;
    courseService
      .getAdvimgList({
        'advType': advType
      })
      .then(res => {
        switch (advType) {
          case '1':
            that.setData({
              imgUrls: res.data
            })
            break;
          case '2':
            that.setData({
              adBanner: res.data
            })
            break;
        }
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
      .catch(err => {
        wx.hideLoading();
      });
  },
  getCourseListByPick: function() {
    var that = this;
    courseService
      .getCourseListByPick({

      })
      .then(res => {
        that.setData({
          getCourseListByPick: res.data
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
      .catch(err => {
        wx.hideLoading();
      });
  },
  getCourseThemeList: function() {
    var that = this;
    courseService
      .getCourseThemeList({

      })
      .then(res => {
        that.setData({
          courseThemeList: res.data
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
      .catch(err => {
        wx.hideLoading();
      });
  },
  capdetail: function(e) {
    // 向主题列表传递数据
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../themedetail/themedetail?id=' + id,
    })
  },
  lessondetail: function(e) {
    // 课程详情 课程id
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lessondetail/lessondetail?id=' + id,
    })
  },
  // 上课点
  point: function() {
    wx.navigateTo({
      url: '../classpoint/classpoint',
    })
  },
  // 科学课
  science: function() {
    // wx.navigateTo({
    //   url: '../science/science',
    // })
    wx.navigateTo({
      url: '../classpoint/classpoint',
    })
  },

  reserve: function() {
    wx.navigateTo({
      url: '../lesson/lesson',
    })
  },
  adver: function(e) {
    if (e.currentTarget.dataset.url) {
      wx.navigateTo({
        url: '../webview/webview?url=' + e.currentTarget.dataset.url,
      })
    }
  },

  special: function(e){
    if (e.currentTarget.dataset.url) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },

  tip: function() {
    wx.showToast({
      title: '即将上线，审核中',
      icon: 'none',
      duration: 1800,
      mask: true
    });    
  },


  onReady: function() {

  },
  onUnload: function() {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '体游科学实验室', 
      path: '/pages/index/index',
      success: (res) => {
        
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }


})