// pages/classpoint/classpoint.js
const app = getApp();
import TeachService from "../../service/TeachService";
const teachService = new TeachService();
var location = require('../../libs/js/location.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    city_code: '', //市id
    districtCode: '', //区id
    city: '', //市
    district: '', //区
    districtList: [], //区域列表
    show: 'false',
    selectIndex: null, //下标
    longitude: '', //经度
    latitude: '', //纬度
    page: 0,
    classList: [], //上课地点
    more: 'true', //加载更多
    shareTag: false, //是否分享进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init();
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  init: function() {
    var that = this;
    if (app.globalData.city && app.globalData.city_code && app.globalData.longitude && app.globalData.latitude){
      that.setData({
        city: app.globalData.city,
        city_code: app.globalData.city_code,
        longitude: app.globalData.longitude,
        latitude: app.globalData.latitude,
      }, () => {
        that.getDistrictByTeachLocation()
      })
    }else{
      location.getCity(function (city, city_code, longitude, latitude) {
        that.setData({
          city: city,
          city_code: city_code,
          longitude: longitude,
          latitude: latitude,
        }, () => {
          that.getDistrictByTeachLocation()
        })
      })
    }
  },

  getDistrictByTeachLocation: function() {
    var that = this;
    teachService
      .getDistrictByTeachLocation({
        cityCode: that.data.city_code
      })
      .then(res => {
        that.setData({
          districtList: res.data,
          // districtCode: res.data[0].districtCode
        }, () => {
          that.getTeachLocationList()
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  getTeachLocationList: function() {
    var that = this;
    if (that.data.more == 'false') {
      return
    }
    that.data.page++
      teachService
      .getTeachLocationList({
        pageNo: that.data.page,
        pageSize: 7,
        longitude: that.data.longitude,
        latitude: that.data.latitude,
        cityCode: that.data.city_code,
        districtCode: that.data.districtCode,
      })
      .then(res => {
        if (res.data.list.length < 7) {
          that.setData({
            more: 'false'
          })
        }
        var new_list = that.data.classList.concat(res.data.list)
        that.setData({
          classList: new_list
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  dialog: function(e) {
    if (this.data.show == 'true') {
      this.setData({
        show: 'false'
      })
    } else {
      this.setData({
        show: 'true'
      })
    }
  },

  stop: function(e) {

  },

  select: function(e) {
    // console.log(e)
    if (this.data.show == 'true') {
      this.setData({
        show: 'false'
      })
    } else {
      this.setData({
        show: 'true'
      })
    }
    this.setData({
      district: e.currentTarget.dataset.districtcame,
      districtCode: e.currentTarget.dataset.districtcode,
      selectIndex: e.currentTarget.dataset.index,
      page: 0,
      more: 'true',
      classList: [],
    }, () => {
      this.getTeachLocationList()
    })
  },

  detail: function(e) {
    wx.navigateTo({
      url: '../storedetail/storedetail?id=' + e.currentTarget.dataset.id,
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
    this.getTeachLocationList()
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})