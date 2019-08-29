// pages/reservation/reservation.js
const app = getApp();
var util = require('../../utils/util.js');
var location = require('../../libs/js/location.js');
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
    pageNo: 0,
    banner: null,
    scheduleTime: '', //时间
    selectIndex: null, //选中教学点或时间段
    dateList: [],
    timeList: [],
    originalTimeList: [],
    cityList: [],
    districtList: [],
    teachPlaceList: [],
    allTeachPlaceList: [],
    cityCode: '',
    districtIndex: '', //确定区域code
    selectDistrictIndex: '', //选中区的index
    teachPlaceIndex: [], //教学点index
    selectTeachIndex: [], //选中教学点index
    teachPlace: '',
    teachPlaceId: [],
    classTimeRangeColl: [],
    enoughDate: '',
    longitude: '',
    latitude: '',
    courseList: [],
    selectTimeIndex: [],
    timeIndex: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.selectTime();
    this.groupByCity();
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
    this.getTeachPlaceLocation();
  },

  getTeachPlaceLocation: function() {
    var that = this;
    if (app.globalData.longitude && app.globalData.latitude) {
      that.setData({
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude
      }, () => {
        that.init();
      })
    } else {
      location.getCity(function(res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        }, () => {
          that.init();
        })
      }, true)
    }
  },


  special: function(e) {
    if (e.currentTarget.dataset.url) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url,
      })
    }
  },

  select: function(e) {
    if (e.currentTarget.dataset.index == this.data.selectIndex) {
      this.setData({
        selectIndex: null,
      })
      return
    }
    // 显示教学点弹窗
    if (e.currentTarget.dataset.index == 0 && e.currentTarget.dataset.index != this.data.selectIndex) {
      this.setData({
        selectDistrictIndex: this.data.districtIndex,
        teachPlaceList: this.data.districtIndex !== '' ? this.data.districtList[this.data.districtIndex].list : this.data.allTeachPlaceList,
        selectTeachIndex: this.data.teachPlaceIndex,
      }, () => {
        for (var i = 0; i < this.data.teachPlaceList.length; i++) {
          this.data.teachPlaceList[i].checked = false;
          for (var j = 0; j < this.data.selectTeachIndex.length; j++) {
            if (i == this.data.selectTeachIndex[j]) {
              this.data.teachPlaceList[i].checked = true;
              break
            }
          }
        }
        var teachPlaceList = this.data.teachPlaceList;
        this.setData({
          teachPlaceList
        })
      })
    }
    // 显示时间段弹窗
    if (e.currentTarget.dataset.index == 1 && e.currentTarget.dataset.index != this.data.selectIndex) {
      this.setData({
        selectTimeIndex: this.data.timeIndex,
      }, () => {
        for (var i = 0; i < this.data.timeList.length; i++) {
          this.data.timeList[i].checked = false;
          for (var j = 0; j < this.data.selectTimeIndex.length; j++) {
            if (i == this.data.selectTimeIndex[j]) {
              this.data.timeList[i].checked = true;
              break
            }
          }
        }
        var timeList = this.data.timeList;
        this.setData({
          timeList
        })
      })
    }
    this.setData({
      selectIndex: e.currentTarget.dataset.index,
    })
  },

  cancel: function() {
    this.setData({
      selectIndex: null,
    })
  },

  init: function() {
    var that = this;
    let time = util.formatDate(new Date());
    let date = util.getDates(15, time);
    courseService
      .getScheduleDateAndPeople({
        teachPlaceIdColl: that.data.teachPlaceId.length > 0 ? that.data.teachPlaceId : undefined,
        classTimeRangeColl: that.data.classTimeRangeColl.length > 0 ? that.data.classTimeRangeColl : undefined,
        districtCode: that.data.districtIndex !== '' ? that.data.districtList[that.data.districtIndex].code : undefined,
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
        that.setData({
          dateList: date,
          enoughDate: '',
        }, () => {
          that.filter()
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
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
    if (this.data.enoughDate == '') {
      this.setData({
        courseList: []
      })
    }
  },

  courseList: function(callBack) {
    var that = this;
    courseService
      .groupByTeachPlace({
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        teachPlaceIdColl: that.data.teachPlaceId.length > 0 ? that.data.teachPlaceId : undefined,
        scheduleDate: that.data.enoughDate.replace(/\//g, '-'),
        classTimeRangeColl: that.data.classTimeRangeColl.length > 0 ? that.data.classTimeRangeColl : undefined,
        districtCode: that.data.districtIndex !== '' ? that.data.districtList[that.data.districtIndex].code : undefined,
      })
      .then(res => {
        that.setData({
          courseList: res.data
        }, () => {
          if (typeof callBack === "function") {
            callBack()
          }
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  changeTab: function(e) {
    this.setData({
      enoughDate: e.currentTarget.dataset.date,
    }, () => {
      this.courseList()
    });
  },


  selectTime: function() {
    var that = this;
    courseService
      .select({

      })
      .then(res => {
        var originalTimeList = [];
        for(var i = 0;i<res.data.length;i++){
          originalTimeList.push(Object.assign({}, res.data[i]))
        }
        that.setData({
          timeList: res.data,
          originalTimeList: originalTimeList
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  groupByCity: function() {
    var that = this;
    courseService
      .groupByCity({

      })
      .then(res => {
        that.setData({
          cityList: res.data,
          districtList: res.data[0].list,
          cityCode: res.data[0].code,
        }, () => {
          that.getAllTeachPlace()
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  getAllTeachPlace: function() {
    var teachPlaceList = [];
    for (var i = 0; i < this.data.districtList.length; i++) {
      teachPlaceList.push(...this.data.districtList[i].list)
    }
    this.setData({
      teachPlaceList: teachPlaceList,
      allTeachPlaceList: teachPlaceList
    })
  },

  selectArea: function(e) {
    this.setData({
      selectDistrictIndex: e.currentTarget.dataset.index,
      teachPlaceList: e.currentTarget.dataset.index !== '' ? this.data.districtList[e.currentTarget.dataset.index].list : this.data.allTeachPlaceList,
      selectTeachIndex: [],
    }, () => {
      for (var i = 0; i < this.data.teachPlaceList.length; i++) {
        this.data.teachPlaceList[i].checked = false;
        for (var j = 0; j < this.data.selectTeachIndex.length; j++) {
          if (i == this.data.selectTeachIndex[j]) {
            this.data.teachPlaceList[i].checked = true;
            break
          }
        }
      }
      var teachPlaceList = this.data.teachPlaceList;
      console.log(teachPlaceList)
      this.setData({
        teachPlaceList
      })
    })
  },

  selectPlace: function(e) {
    if (e.currentTarget.dataset.index === '') {
      for (var i = 0; i < this.data.teachPlaceList.length; i++) {
        this.data.teachPlaceList[i].checked = false;
      }
      var teachPlaceList = this.data.teachPlaceList;
      this.setData({
        selectTeachIndex: [],
        teachPlaceList,
      })
      return
    }
    for (var i = 0; i < this.data.teachPlaceList.length; i++) {
      if (e.currentTarget.dataset.index === i) {
        if (this.data.teachPlaceList[i].checked === true) {
          this.data.teachPlaceList[i].checked = false;
          const teachPlaceList = this.data.teachPlaceList;
          // 取消教学点index
          // var selectTeachIndex = [];
          // for (var i = 0; i < this.data.selectTeachIndex.length;i++){
          //   if (this.data.selectTeachIndex[i] != e.currentTarget.dataset.index){
          //     selectTeachIndex.push(this.data.selectTeachIndex[i])
          //   }
          // }
          var selectTeachIndex = [];
          Object.assign(selectTeachIndex, this.data.selectTeachIndex)
          selectTeachIndex.splice(selectTeachIndex.indexOf(e.currentTarget.dataset.index),1)
          this.setData({
            teachPlaceList,
            selectTeachIndex: selectTeachIndex
          })
        } else {
          this.data.teachPlaceList[i].checked = true;
          var teachPlaceList = this.data.teachPlaceList;
          // 选中教学点index
          this.setData({
            teachPlaceList,
            selectTeachIndex: this.data.selectTeachIndex.concat([e.currentTarget.dataset.index])
          })
        }

      }
    }
  },

  // 时间段选择
  time: function(e) {
    if (e.currentTarget.dataset.index === '') {
      for (var i = 0; i < this.data.timeList.length; i++) {
        this.data.timeList[i].checked = false;
      }
      var timeList = this.data.timeList;
      this.setData({
        selectTimeIndex: [],
        timeList,
      })
      return
    }
    for (var i = 0; i < this.data.timeList.length; i++) {
      if (e.currentTarget.dataset.index === i) {
        if (this.data.timeList[i].checked == true) {
          this.data.timeList[i].checked = false;
          var timeList = this.data.timeList;
          // 取消时间段index
          var selectTimeIndex = [];
          Object.assign(selectTimeIndex, this.data.selectTimeIndex)
          selectTimeIndex.splice(selectTimeIndex.indexOf(e.currentTarget.dataset.index), 1)
          this.setData({
            timeList,
            selectTimeIndex: selectTimeIndex
          })
        } else {
          this.data.timeList[i].checked = true;
          var timeList = this.data.timeList;
          // 选中时间段index
          this.setData({
            timeList,
            selectTimeIndex: this.data.selectTimeIndex.concat([e.currentTarget.dataset.index])
          })
        }

      }
    }
  },

  surePlace: function() {
    this.setData({
      districtIndex: this.data.selectDistrictIndex,
      teachPlaceIndex: this.data.selectTeachIndex,
      teachPlaceId: []
    }, () => {
      for (var i = 0; i < this.data.teachPlaceList.length; i++) {
        for (var j = 0; j < this.data.selectTeachIndex.length; j++) {
          if (i == this.data.selectTeachIndex[j]) {
            this.setData({
              teachPlaceId: this.data.teachPlaceId.concat([this.data.teachPlaceList[i].teachPlaceId])
            })
            break
          }
        }
      }
      console.log(this.data.teachPlaceId)
      this.init();
      this.cancel();
    })
  },

  sureTime: function() {
    this.setData({
      timeIndex: this.data.selectTimeIndex,
      classTimeRangeColl: []
    }, () => {
      for (var i = 0; i < this.data.timeList.length; i++) {
        for (var j = 0; j < this.data.selectTimeIndex.length; j++) {
          if (i == this.data.selectTimeIndex[j]) {
            this.setData({
              classTimeRangeColl: this.data.classTimeRangeColl.concat([this.data.originalTimeList[i]])
            })
            break
          }
        }
      }
      this.init();
      this.cancel();
    })
  },

  navigation: function (e) {
    wx.openLocation({
      name: this.data.courseList[e.currentTarget.dataset.index].teachPlaceName,
      address: this.data.courseList[e.currentTarget.dataset.index].detailAddress,
      longitude: Number(this.data.courseList[e.currentTarget.dataset.index].longitude),
      latitude: Number(this.data.courseList[e.currentTarget.dataset.index].latitude),
      scale: 18
    })
  },

  sure: function(e){
    wx.navigateTo({
      url: '../detail/detail?scheduleId=' + e.currentTarget.dataset.id,
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