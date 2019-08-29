// pages/detail/detail.js
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
    isIpx: app.globalData.isIpx,
    image_cache: app.globalData.image_cache,
    scheduleId: '', //排课id
    lessonDetail: '', //课程详情
    studentName: '', //宝宝名字
    studentId: '', //宝宝id编号
    info: '', //用户信息
    reserveType: '', //预约方式
    reserveTypeId: '', //预约方式id
    title:'',//标题
    content:'',//弹窗内容
    cancelText: '',//取消按钮文案
    confirmText: '',//确认按钮文案
    confirmEvent:'',//确认事件
    formId:'',//用户formId
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      scheduleId: options.scheduleId ? options.scheduleId : '',
    })
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
    this.dialog = this.selectComponent("#dialog"); //获取子组件实例对象
    this.init()
  },

  init: function() {
    var that = this;
    courseService
      .getReserveDetail({
        scheduleId: that.data.scheduleId
      })
      .then(res => {
        wx.setNavigationBarTitle({
          title: res.data.courseName,
        });
        that.setData({
          lessonDetail: res.data
        }, () => {
          that.getInfo()
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  getInfo: function() {
    var that = this;
    app.getLoginUser(function (res) {
      that.setData({
        info: res.data
      })
      // 判断抵扣课时 体验卡
      if (Number(res.data.useExperienceCard) > 0) {
        that.setData({
          reserveType: '体验卡',
          reserveTypeId: '2'
        })
      } else if (Number(res.data.lcoin) - Number(that.data.lessonDetail.lcoinPrice) >= 0) {
        that.setData({
          reserveType: '课时',
          reserveTypeId: '1'
        })
      } else {
        that.setData({
          reserveType: '课时不足',
        })
      }
    })
  },

  select: function() {
    wx.navigateTo({
      url: '../baby/baby?frompage=baby',
    })
  },

  // 预约(节流 多次点击)
  // reserve: dialog.throttle(function(e){
  //   console.log(this)
  //   this.sure()
  // },1000),


  reserveDetail: function(e){
    var that = this;
    if (!that.data.reserveTypeId) {
      that.setData({
        title:'温馨提示',
        content: '您的课时不足请前往充值页\r\n购买课时',
        cancelText:'取消',
        confirmText: '去充值',
        confirmEvent: 'goRecharge',
      }, () => {
        that.dialog.showDialog();
      })
      return
    }
    if (!that.data.studentId) {
      wx.showToast({
        title: '请先选择宝宝',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    // 预约
    if (that.data.reserveTypeId && that.data.studentId){
      that.setData({
        formId: e.detail.formId,
        title: '温馨提示',
        content:'确定预约本次课程',
        cancelText: '取消',
        confirmText: '确认',
        confirmEvent: 'submitOder',
      },() =>{
        that.dialog.showDialog();
      })
    }
  },

  goRecharge: function(){
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },


  submitOder: function() {
    var that = this;
    courseService
      .createCourseReserve({
        scheduleId: that.data.scheduleId,
        payType: that.data.reserveTypeId,
        studentId: that.data.studentId,
        formId: that.data.formId,
      })
      .then(res => {
        if (that.data.reserveTypeId == '1') {
          that.setData({
            'info.lcoin': that.data.info.lcoin - that.data.lessonDetail.lcoinPrice
          })
        }
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000,
          success: function(){
            setTimeout(function(){
              wx.redirectTo({
                url: '../success/success',
              })
            },200)
          }
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
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