// pages/storedetail/storedetail.js
var util = require('../../utils/util.js');
var location = require('../../libs/js/location.js');
const app = getApp();
import TeachService from "../../service/TeachService";
import CourseService from "../../service/CourseService";
const teachService = new TeachService();
const courseService = new CourseService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    dateList: '',
    teachPlaceId: '', //教学点id
    currentTab: 0, //当前点击日期
    tabFixed: false,
    tabScrollTop: '', //滚动条高度
    getTeachPlace: '', //教学场所详情
    enoughDate: '', //最近的充足课程日期
    courseList: [], //课程列表
    pageNo: 0,
    more: true,
    shareTag: false, //是否分享进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.globalData.channelNo = options.channelNo ? options.channelNo : app.globalData.channelNo
    this.setData({
      teachPlaceId: options.id ? options.id : ''
    })
    this.init();
    this.getTeachPlaceLocation()
    if (getCurrentPages().length == 1) {
      this.setData({
        shareTag: true,
      }) 
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('.count').boundingClientRect(function(res) {
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

  changeTab: function(e) {
    console.log(e);
    this.setData({
      enoughDate: e.currentTarget.dataset.date,
      pageNo: 0,
      more: true,
      courseList: [],
    }, () => {
      this.courseList()
    });
  },

  init: function() {
    var that = this;
    let time = util.formatDate(new Date());
    let date = util.getDates(15, time);
    courseService
      .getScheduleDateAndPeople({
        teachPlaceId: that.data.teachPlaceId
      })
      .then(res => {
        for (var i = 0; i < date.length; i++) {
          for (var j = 0; j < res.data.length; j++) {
            if (date[i].fullDate == res.data[j].scheduleDate.replace(new RegExp('-', "g"), '/')) {
              date[i].maxPeople = res.data[j].maxPeople;
              date[i].reservePeople = res.data[j].reservePeople;
              break;
            }
          }
        }
        // console.log(date)
        that.setData({
          dateList: date,
          enoughDate: date[0].fullDate,
        }, () => {
          that.filter()
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },


  getTeachPlaceLocation: function() {
    var that = this;
    if (app.globalData.longitude && app.globalData.latitude) {
      teachService
        .getTeachPlaceById({
          teachPlaceId: that.data.teachPlaceId,
          longitude: app.globalData.longitude,
          latitude: app.globalData.latitude
        })
        .then(res => {
          wx.setNavigationBarTitle({
            title: res.data.teachPlaceName,
          })
          that.setData({
            getTeachPlace: res.data
          })
        })
        .catch(err => {
          wx.hideLoading();
        });
    }else{
      location.getCity(function (res) {
        teachService
          .getTeachPlaceById({
            teachPlaceId: that.data.teachPlaceId,
            longitude: res.longitude,
            latitude: res.latitude
          })
          .then(res => {
            wx.setNavigationBarTitle({
              title: res.data.teachPlaceName,
            })
            that.setData({
              getTeachPlace: res.data
            })
          })
          .catch(err => {
            wx.hideLoading();
          });
      }, true)
    }
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

  navigation: function(e) {
    wx.openLocation({
      name: this.data.getTeachPlace.teachPlaceName,
      address: this.data.getTeachPlace.detailAddress,
      longitude: Number(this.data.getTeachPlace.longitude),
      latitude: Number(this.data.getTeachPlace.latitude),
      scale: 18
    })
  },

  filter: function() {
    // 筛选出就近充足的日期
    for (var i = 0; i < this.data.dateList.length; i++) {
      // console.log('11111')
      if (this.data.dateList[i].maxPeople - this.data.dateList[i].reservePeople > 0) {
        this.setData({
          enoughDate: this.data.dateList[i].fullDate
        }, () => {
          this.courseList()
        })
        break
      }
    }
  },

  courseList: function() {
    var that = this;
    if (that.data.more == 'false') {
      return
    }
    that.data.pageNo++;
    courseService
      .getCourseList({
        pageNo: that.data.pageNo,
        pageSize: 7,
        teachPlaceId: that.data.teachPlaceId,
        scheduleDate: new Date(that.data.enoughDate).getTime(),
        // hasSchedule: true
      })
      .then(res => {
        var new_list = that.data.courseList.concat(res.data.list)
        that.setData({
          courseList: new_list
        })
        if (res.data.list.length < 7) {
          that.setData({
            more: 'false'
          })
        }
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  lessondetail: function(e) {
    wx.navigateTo({
      url: '../detail/detail?scheduleId=' + e.currentTarget.dataset.id,
    })
  },

  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },

  backHome: function() {
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
    this.courseList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})