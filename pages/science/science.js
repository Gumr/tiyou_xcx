// pages/science/science.js
const app = getApp();
import CourseService from "../../service/CourseService";
const courseService = new CourseService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    dialog1: false,
    dialog2:false,
    courseType: '',
    themeId:'',
    pageNo: 0,
    more: 'true',
    lessonList: [],
    tab1List : [{
      name:'精品课',
      id: '2'
    }, {
        name: '科学课',
        id: '1'
      }],
    tab2List: [],
    courseName:'',
    themeName:'',
    height:''//主题系列弹窗高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
    this.getList();
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

  tab1: function(){
    this.setData({
      dialog1: !this.data.dialog1,
      dialog2: false,
    })
  },

  tab2: function () {
    this.setData({
      dialog1: false,
      dialog2: !this.data.dialog2,
    })
  },

  init: function(){
    var that = this;
    courseService
      .getCourseThemeList({

      })
      .then(res => {
        that.setData({
          tab2List: res.data,
          height: res.data.length*100,
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  getList: function(){
    var that = this;
    if (that.data.more == 'false') {
      return
    }
    that.data.pageNo++
    courseService
      .getCourseList({
        pageNo: that.data.pageNo,
        pageSize: 7,
        courseType: that.data.courseType,
        themeId: that.data.themeId,
      })
      .then(res => {
        if (res.data.list.length < 7) {
          that.setData({
            more: 'false'
          })
        }
        var new_list = that.data.lessonList.concat(res.data.list)
        that.setData({
          lessonList: new_list
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  select1: function(e){
    this.setData({
      courseType: e.currentTarget.dataset.id,
      courseName: e.currentTarget.dataset.name,
      dialog1: !this.data.dialog1,
      dialog2: false,
      pageNo: 0,
      more: 'true',
      lessonList: [],
    },() =>{
      this.getList()
    })
  },

  select2: function(e){
    this.setData({
      themeId: e.currentTarget.dataset.id,
      themeName: e.currentTarget.dataset.name,
      dialog1: false,
      dialog2: !this.data.dialog2,
      pageNo: 0,
      more: 'true',
      lessonList: [],
    }, () => {
      this.getList()
    })
  },

  cancel: function(){
    this.setData({
      dialog1: false,
      dialog2: false,
    })
  },

  lessondetail: function(e){
    // 课程详情 课程id
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lessondetail/lessondetail?id=' + id,
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
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})