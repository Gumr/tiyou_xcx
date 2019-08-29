// pages/lesson/lesson.js
const app = getApp();
import CourseService from "../../service/CourseService";
import TeachService from "../../service/TeachService";
const teachService = new TeachService();
const courseService = new CourseService();
var location = require('../../libs/js/location.js');
const gio = require("../../utils/gio-minp/index.js").default;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    image_cache: app.globalData.image_cache,
    contentheight: '', //区域课程选择高度
    screenHeight: '', //右边滚动高度
    areaindex: 0, //选中的区域选择下标
    shopindex: 0, //选中的店铺下标
    contentindex: 0, //右边内容列表下标
    latitude: '', //纬度
    longitude: '', //经度
    city: '',
    city_code: '',
    address: '', //门店地址
    list: [],
    scheduleId: '', //排课id
    areaId: '', //区域id
    lessonId: '', //课程id
    contentList: [], //排课时间列表
    reservePeople: '', //当前课程当前时间段预约人数
    maxPeople: '', //当前课程当前时间段最大预约人数
    time: '', //当前课程当前时间段开课时间
    banner: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getAdvimgList();
    that.countheight();
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.courseName) ? decodeURIComponent(options.courseName) : '预约课程'
    })
    that.setData({
      lessonId: options.courseId ? options.courseId : '',
      areaId: options.teachPlaceId ? options.teachPlaceId : '',
      address: options.address ? decodeURIComponent(options.address) : '',
    })
    // 获取城市定位
    if (app.globalData.city && app.globalData.city_code && app.globalData.longitude && app.globalData.latitude){
      that.setData({
        city: app.globalData.city,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude,
        city_code: app.globalData.city_code
      }, () => {
        // 获取区域树
        that.getTeachLocationTree();
      })
    }else{
      location.getCity(function (city, city_code, longitude, latitude) {
        gio('getLocation')
        that.setData({
          city: city,
          latitude: latitude,
          longitude: longitude,
          city_code: city_code
        }, () => {
          // 获取区域树
          that.getTeachLocationTree();
        })
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

  },

  countheight: function() {
    let query = wx.createSelectorQuery()
    wx.getSystemInfo({
      success: res => {
        query.select('.ad_banner').boundingClientRect(rect => {
          this.setData({
            contentheight: this.data.isIpx ? res.windowHeight - rect.height - 49 - 34 : res.windowHeight - rect.height - 49
          }, () => {
            this.countScreenHeight()
          })
        }).exec();
      }
    })
  },

  countScreenHeight: function() {
    let query = wx.createSelectorQuery()
    query.select('.location').boundingClientRect(rect => {
      this.setData({
        screenHeight: this.data.contentheight - rect.height
      }, () => {

      })
    }).exec();
  },

  select: function(e) {
    this.setData({
      areaId: e.currentTarget.dataset.id,
      address: e.currentTarget.dataset.address,
    }, () => {
      this.getCourseSchedule()
    })
  },
  choose: function(e) {
    this.setData({
      scheduleId: e.currentTarget.dataset.id,
      reservePeople: e.currentTarget.dataset.reservepeople,
      maxPeople: e.currentTarget.dataset.maxpeople,
      time: e.currentTarget.dataset.time,
    })
  },

  getTeachLocationTree: function() {
    var that = this;
    teachService
      .getTeachLocationTree({
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        cityCode: that.data.city_code,
        courseId: that.data.lessonId,
      })
      .then(res => {
        that.setData({
          list: res.data,
          address: that.data.address ? that.data.address : res.data[0].teachLocation[0].cityName + res.data[0].teachLocation[0].districtName + res.data[0].teachLocation[0].detailAddress
        }, () => {
          if (that.data.areaId == '' || that.data.areaId == null) {
            that.setData({
              areaId: res.data[0].teachLocation[0].teachPlaceId
            }, () => {
              that.getCourseSchedule()
            })
          } else {
            that.getCourseSchedule()
          }
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  getCourseSchedule: function() {
    var that = this;
    courseService
      .getCourseSchedule({
        teachPlaceId: that.data.areaId,
        courseId: that.data.lessonId,
      })
      .then(res => {
        let conversionList = res.data;
        if (res.data.length > 0) {
          for (var i = 0; i < conversionList.length; i++) {
            conversionList[i].time = that.formatDate(conversionList[i].scheduleDate)
          }
        }
        // console.log(conversionList)
        that.setData({
          contentList: conversionList.length > 0 ? conversionList : [],
          scheduleId: conversionList.length > 0 ? conversionList[0].scheduleId : '',
          reservePeople: conversionList.length > 0 ? conversionList[0].reservePeople : '',
          maxPeople: conversionList.length > 0 ? conversionList[0].maxPeople : '',
          time: conversionList.length > 0 ? conversionList[0].scheduleDate + ' ' + conversionList[0].reserveEndTime : '',
        })

      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  formatDate: function(dates) {
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates.replace(/\-/g, '/'));
    let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    let day = date.getDay();
    let fullDate = month + '月' + dayFormate + '日';
    return show_day[day] + '  ' + fullDate
  },

  sure: function(e) {
    if (!this.data.areaId) {
      wx.showToast({
        title: '请选择地点',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    if (!this.data.scheduleId) {
      wx.showToast({
        title: '请选择排课时间',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    if (new Date().getTime() > new Date(this.data.time.replace(/-/g, '/')).getTime()) {
      wx.showToast({
        title: '已截止预约',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    if (Number(this.data.reservePeople) >= Number(this.data.maxPeople)) {
      wx.showToast({
        title: '预约人数已满',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    wx.navigateTo({
      url: '../detail/detail?scheduleId=' + this.data.scheduleId,
    })
  },

  getAdvimgList: function() {
    var that = this;
    courseService
      .getAdvimgList({
        'advType': 2
      })
      .then(res => {
        that.setData({
          banner: res.data
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  special: function(e) {
    if (e.currentTarget.dataset.url) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },

  lower: function() {

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