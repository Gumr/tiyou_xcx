// pages/themedetail/themedetail.js
import CourseService from "../../service/CourseService";
const courseService = new CourseService();
let WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    themeList: [], //数据
    tabIndex: 0,
    courseList: [], //相关课程
    tabFixed: false,
    tabScrollTop: '', //banner高度
    // swiperHeight: '', //计算swiper高度   
    themeId: '',//主题id 
    shareTag: false,//是否分享进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (getCurrentPages().length == 1) {
      this.setData({
        shareTag: true,
      })
    }
    this.setData({
      themeId: options.id ? options.id : ''
    })
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('.wrap').boundingClientRect(function(res) {
      that.setData({
        tabScrollTop: res.height
      })
    }).exec()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  init: function(options) {
    var that = this;
    courseService
      .getThemeByThemeId({
        themeId: that.data.themeId
      })
      .then(res => {
        wx.setNavigationBarTitle({
          title: res.data.themeName,
        })
        // 主题介绍
        WxParse.wxParse('article', 'html', res.data.detail, that, 5);
        that.setData({
          themeList: res.data
        })
      })
      .catch(err => {
        wx.hideLoading();
      });

      // 课程列表
    courseService
      .getCourseListByThemeId({
        themeId: that.data.themeId
      })
      .then(res => {
        that.setData({
          courseList: res.data
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  tab: function(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    // this.swiperHeight(e.currentTarget.dataset.classname)
  },

  // 计算swiper高度
  // swiperHeight: function(className) {
  //   var that = this;
  //   var query = wx.createSelectorQuery()
  //   query.select("." + className).boundingClientRect(function(res) {
  //     that.setData({
  //       swiperHeight: res.height
  //     })
  //   }).exec()
  // },

  // handleChange: function(e) {
  //   this.setData({
  //     tabIndex: e.detail.current
  //   })
  //   if (e.detail.current == 0) {
  //     this.swiperHeight('theme_info')
  //   } else if (e.detail.current == 1) {
  //     this.swiperHeight('relate')
  //   }
  // },

  detail: function(e){
    // 课程详情 课程id
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lessondetail/lessondetail?id=' + id,
    })
  },

  onPageScroll: function(e) { // 获取滚动条当前位置
    if (e.scrollTop > this.data.tabScrollTop) {
      this.setData({
        tabFixed: true
      })
    } else {
      this.setData({
        tabFixed: false
      })
    }
  },

  handleChangeSwiper:function(e){
    this.setData({
      currentIndex: e.detail.current
    })
  },

  backHome: function () {
    wx.switchTab({
      url: '../index/index',
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
  onShareAppMessage: function() {

  }
})