// pages/edit/edit.js
const app = getApp();
var util = require('../../utils/util.js');
import StudentService from "../../service/StudentService";
const studentService = new StudentService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    array: ['男', '女'],
    sexlist: ['1', '2'], //1 男 2 女
    sexIndex: '',
    date: '',
    sex: '',
    studentName: '',
    relation: '',
    birthday: '',
    studentId: '', //宝宝id 编辑 
    end: '', //日期选择器限制
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id) {
      wx.setNavigationBarTitle({
        title: '编辑宝宝',
      })
      var index = options.index; //编辑哪个宝宝
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      console.log(prevPage.data.studentList[index])
      this.setData({
        studentId: options.id,
        studentName: prevPage.data.studentList[index].studentName,
        relation: prevPage.data.studentList[index].relation,
        sex: prevPage.data.studentList[index].sex == '男' ? 1 : 2,
        birthday: new Date(prevPage.data.studentList[index].birthday).getTime(),
        sexIndex: prevPage.data.studentList[index].sex == '男' ? 0 : 1,
        date: prevPage.data.studentList[index].birthday,
      })
    }
    this.setData({
      end: util.formatDate(new Date()),
    })
    // console.log(util.formatDate(new Date()))
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

  bindPickerChange: function(e) {
    console.log(e)
    this.setData({
      sexIndex: e.detail.value,
      sexActive: false,
      sex: Number(e.detail.value) + 1
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value,
      birthday: new Date(e.detail.value).getTime(),
      dateActive: false,
    })
  },

  cancel: function() {
    this.setData({
      sexActive: false
    })
  },

  canceldate: function() {
    this.setData({
      dateActive: false
    })
  },

  selectsex: function() {
    this.setData({
      sexActive: true
    })
  },

  selectdate: function() {
    this.setData({
      dateActive: true
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      studentName: e.detail.value
    })
  },

  contact: function(e) {
    this.setData({
      relation: e.detail.value
    })
  },

  // 保存
  save: function() {
    var that = this;
    if (!this.data.studentName) {
      wx.showToast({
        title: '请输入宝宝姓名',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    if (!this.data.relation) {
      wx.showToast({
        title: '请输入与宝宝关系',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    if (!this.data.sex) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    if (!this.data.birthday) {
      wx.showToast({
        title: '请选择生日',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    // 编辑宝宝
    if (that.data.studentId) {
      studentService
        .updateStudent({
          studentName: that.data.studentName,
          sex: that.data.sex,
          relation: that.data.relation,
          birthday: that.data.birthday,
          studentId: that.data.studentId
        })
        .then(res => {
          if (res.code == '0000') {
            wx.showToast({
              title: '更改成功',
              icon: 'success',
              duration: 1500
            })
            setTimeout(() => {
              wx.navigateBack({

              })
            }, 1500)
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
      return
    }
    // 新增宝宝
    studentService
      .createStudent({
        studentName: that.data.studentName,
        sex: that.data.sex,
        relation: that.data.relation,
        birthday: that.data.birthday,
      })
      .then(res => {
        if (res.code == '0000') {
          wx.showToast({
            title: '新增成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.navigateBack({

            })
          }, 1500)
        }
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