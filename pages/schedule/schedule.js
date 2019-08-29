// pages/schedule/schedule.js
const app = getApp();
import CourseService from "../../service/CourseService";
const courseService = new CourseService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    tabIndex: 0, //点击tab下标
    tabList: [{
      name: '待核销',
      searchType: '1'
    }, {
      name: '已取消',
      searchType: '2'
    }, {
      name: '已完成',
      searchType: '3'
    }],
    height: '', //swiper高度
    searchType: '1',
    pageNo: 0,
    more: 'true',
    courseList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.countheight();
    this.getList();
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

  tab: function(e) {
    if (this.data.tabIndex == e.currentTarget.dataset.index){
      return
    }
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      searchType: e.currentTarget.dataset.type,
      pageNo: 0,
      more: 'true',
      courseList: [],
    }, () => {
      this.getList();
    })
  },

  countheight: function() {
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: res => {
        query.select('.calcu').boundingClientRect(rect => {
          this.setData({
            height: rect ? res.windowHeight - rect.height : res.windowHeight
          })
        }).exec();
      }
    })
  },

  getList: function() {
    var that = this;
    if (that.data.more == 'false') {
      return
    }
    that.data.pageNo++
      courseService
      .getCourseScheduleVerifyPage({
        pageNo: that.data.pageNo,
        pageSize: 7,
        searchType: that.data.searchType
      })
      .then(res => {
        if (res.data.list.length < 7) {
          that.setData({
            more: 'false'
          })
        }
        var new_list = that.data.courseList.concat(res.data.list)
        for (var i = 0; i < new_list.length; i++) {
          new_list[i].time = new_list[i].scheduleDate.split('-')[1] + '-' + new_list[i].scheduleDate.split('-')[2]
        }
        console.log(new_list)
        that.setData({
          courseList: new_list
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  lower: function() {
    this.getList()
  },

  detail: function(e){
    var id = e.currentTarget.dataset.id;
    var status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '../writeoff/writeoff?id=' + id + '&status=' + status,
    })
  },

  stopTouchMove: function () {
    return false;
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