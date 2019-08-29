// pages/writeoff/writeoff.js
const app = getApp();
import CourseService from "../../service/CourseService";
const courseService = new CourseService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    scheduleId: '',//排课id
    status: { '10': 'dkb', '20': 'ykb', '30': 'wkb', '40': 'wkb', },//状态
    colors: { '10': '#FFB451', '20': '#31BD5B', '30': '#8A8A8A', '40': '#8A8A8A', },//进度条颜色
    detail:'',
    studentList:[],
    hxList:[],//
    lessonStatus:'',//上个页面进入 待开班 已开班 已取消 已完成 状态
    title: '',//标题
    content: '',//弹窗内容
    cancelText: '',//取消按钮文案
    confirmText: '',//确认按钮文案
    confirmEvent: '',//确认事件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      scheduleId: options.id ? options.id : '',
      lessonStatus: options.status ? options.status : '',
    }, () => {
      this.init()
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
    this.dialog = this.selectComponent("#dialog"); //获取子组件实例对象
  },

  init: function(){
    var that = this;
    courseService
      .getReserveDetail({
        scheduleId: that.data.scheduleId
      })
      .then(res => {
        that.setData({
          detail: res.data
        })
      })
      .catch(err => {
        wx.hideLoading();
      });

    courseService
      .getCourseReserveStudentList({
        scheduleId: that.data.scheduleId
      })
      .then(res => {
        that.setData({
          studentList: res.data
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  select: function(e){
    // 已开班和未签到状态才能选中宝宝
    if (e.currentTarget.dataset.status == '10' && this.data.lessonStatus == '20'){
      for (var i = 0; i < this.data.studentList.length; i++) {
        if (e.currentTarget.dataset.id == this.data.studentList[i].reserveId) {
          if (this.data.studentList[i].checked == true) {
            this.data.hxList.splice(this.data.hxList.indexOf(this.data.studentList[i].reserveId), 1)//宝宝id移除核销数组
            this.data.studentList[i].checked = false;
            var studentList = this.data.studentList;
            this.setData({
              studentList: studentList//重定义studentList
            })
          } else {
            this.data.hxList.push(this.data.studentList[i].reserveId)//宝宝id添加进核销数组
            this.data.studentList[i].checked = true;
            var studentList = this.data.studentList;
            this.setData({
              studentList: studentList//重定义studentList
            })
          }
        }
      }
    }
    // console.log(this.data.hxList)
  },

  // 核销
  verify:function(){
    var that = this;
    if (that.data.hxList.length == 0){
      wx.showToast({
        icon:'none',
        title: '请选择核销宝宝',
      })
      return;
    }
    that.setData({
      title: '温馨提示',
      content: '确定核销',
      cancelText: '取消',
      confirmText: '确定',
      confirmEvent: 'hxsure',
    }, () => {
      that.dialog.showDialog();
    })
  },

  hxsure: function(){
    var that = this;
    courseService
      .verifyCourseReserveByTeacher({
        reserveIdList: JSON.stringify(that.data.hxList)
      })
      .then(res => {
        wx.showToast({
          title: '核销成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          hxList: []
        })
        that.init()
      })
      .catch(err => {
        wx.hideLoading();
      });
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