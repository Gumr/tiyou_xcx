// pages/record/record.js
const app = getApp();
import CourseService from "../../service/CourseService";
const courseService = new CourseService();
import LoginService from "../../service/LoginService";
const loginService = new LoginService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    tabIndex: 0, //点击tab下标
    tabList: [{
      name: '全部',
      staus: ''
    }, {
      name: '待上课',
      staus: '10'
    }, {
      name: '已完成',
      staus: '2040'
    }],
    height: '', //swiper高度
    more_1: 'true',
    pageNo_1: 0,
    list_1: [],
    reserveStatus_1: '', //全部
    more_2: 'true',
    pageNo_2: 0,
    list_2: [],
    reserveStatus_2: '10', //待上课
    more_3: 'true',
    pageNo_3: 0,
    list_3: [],
    reserveStatus_3: '2040', //已完成
    learned: '',
    fresh: false,//下个页面取消后刷新
    shareTag: false, //是否分享进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.countheight();
    this.user('onLoad');
    if (getCurrentPages().length == 1) {
      this.setData({
        shareTag: true,
      })
    }
    if (options.tabIndex){
      this.setData({
        tabIndex: options.tabIndex
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
    if(this.data.fresh == true){
      this.changeData();
    }
  },

  //下个页面取消成功后调用 
  changeData: function(){
    this.setData({
      more_1: 'true',
      pageNo_1: 0,
      list_1: [],
      more_2: 'true',
      pageNo_2: 0,
      list_2: [],
      fresh: false,
    }, () =>{
      this.getCourseList('more_1', 'pageNo_1', 'list_1', 'reserveStatus_1')
      this.getCourseList('more_2', 'pageNo_2', 'list_2', 'reserveStatus_2')
      this.user()
    })
  },


  tab: function(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
    })
  },

  //滑动切换
  bindChange: function (e) {
    this.setData({
      tabIndex: e.detail.current,
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

  getCourseList: function(more, pageNo, list, reserveStatus) {
    var that = this;
    if (that.data[more] == 'false') {
      return
    }
    that.data[pageNo]++
      courseService
      .getCourseReservePage({
        pageNo: that.data[pageNo],
        pageSize: 7,
        reserveStatus: that.data[reserveStatus],
      })
      .then(res => {
        if (res.data.list.length < 7) {
          that.setData({
            [more]: 'false'
          })
        }
        var new_list = that.data[list].concat(res.data.list)
        for (var i = 0; i < new_list.length; i++) {
          new_list[i].time = new_list[i].scheduleDate.split('-')[1] + '-' + new_list[i].scheduleDate.split('-')[2]
        }
        that.setData({
          [list]: new_list
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  user: function(param) {
    var that = this;
    app.getLoginUser(function(res) {
      if(param == 'onLoad'){
        that.getCourseList('more_1', 'pageNo_1', 'list_1', 'reserveStatus_1')
        that.getCourseList('more_2', 'pageNo_2', 'list_2', 'reserveStatus_2')
        that.getCourseList('more_3', 'pageNo_3', 'list_3', 'reserveStatus_3')
      }
      that.setData({
        learned: Math.abs(res.data.consumeLcoin).toFixed(1)
      })
    })
  },

  lower: function(e) {
    if (e.currentTarget.dataset.status == this.data.reserveStatus_1) {
      this.getCourseList('more_1', 'pageNo_1', 'list_1', 'reserveStatus_1')
      return
    }
    if (e.currentTarget.dataset.status == this.data.reserveStatus_2) {
      this.getCourseList('more_2', 'pageNo_2', 'list_2', 'reserveStatus_2')
      return
    }
    if (e.currentTarget.dataset.status == this.data.reserveStatus_3) {
      this.getCourseList('more_3', 'pageNo_3', 'list_3', 'reserveStatus_3')
      return
    }
  },

  backHome: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },

  reservedetail: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../recorddetail/recorddetail?id=' + id,
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