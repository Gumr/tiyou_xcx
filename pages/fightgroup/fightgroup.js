// pages/fightgroup/fightgroup.js
const app = getApp();
import LoginService from "../../service/LoginService";
const loginService = new LoginService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    headList:[],
    isIpx: app.globalData.isIpx,
    avatar:'',
    nickName:'',
    reserveEndTime:'',
    nowTime: new Date().getTime(),
    scheduleData:null,
    status:'',
    color:'',
    giveUserId:'',
    channelNo: app.globalData.channelNo,
    scheduleId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene){
      this.scene(options.scene)
    }
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

  scene: function(scene){
    var that = this;
    loginService
      .info({
        sceneStr: scene
      })
      .then(res => {
        that.setData({
          channelNo: res.data.channelNo,
          giveUserId: res.data.userId,
          scheduleId: res.data.scheduleId
        },() =>{
          that.init()
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  init: function(){
    var that = this;
    loginService
      .detail({
        userId:that.data.giveUserId,
        scheduleId: that.data.scheduleId,
      })
      .then(res => {
        that.setData({
          headList: new Array(Number(res.data.maxPeople) - Number(res.data.reserveList.length)),
          reserveEndTime: new Date(res.data.scheduleDate + ' ' + res.data.reserveEndTime).getTime(),
          scheduleData: res.data
        },() =>{
          if (res.data.canReceiveExperienceCard == true){
            // 领取体验卡
            that.getCard()
          }
          that.status();
          that.head()
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  status: function(){
    if (this.data.nowTime < this.data.reserveEndTime && this.data.scheduleData.minPeople - this.data.scheduleData.reservePeople > 0){
      // 未成团
      this.setData({
        status: 1,
        color:'#FFB451'
      })
    } else if (this.data.nowTime < this.data.reserveEndTime && this.data.scheduleData.reservePeople - this.data.scheduleData.minPeople >= 0 && this.data.scheduleData.maxPeople - this.data.scheduleData.reservePeople > 0){
      // 待满班
      this.setData({
        status: 2,
        color: '#31BD5B',
      })
    } else if (this.data.nowTime < this.data.reserveEndTime && this.data.scheduleData.maxPeople - this.data.scheduleData.reservePeople == 0){
      // 已满班
      this.setData({
        status: 3,
        color: '#8A8A8A',
      })
    } else if (this.data.nowTime >= this.data.reserveEndTime){
      // 停止预约
      this.setData({
        status: 4,
        color: '#8A8A8A'
      })
    }
  },

  head: function(){
    this.setData({
      headList: this.data.scheduleData.reserveList.concat(this.data.headList)
    })
  },

  getCard: function(){
    var that = this;
    loginService
      .getExperienceCard({
        giveUserId: that.data.giveUserId,
        giveChannelNo: that.data.channelNo,
      })
      .then(res => {
        wx.showToast({
          title: '领取成功',
          duration: 2000,
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  navigation: function (e) {
    wx.openLocation({
      name: this.data.scheduleData.teachPlaceName,
      address: this.data.scheduleData.detailAddress,
      longitude: Number(this.data.scheduleData.longitude),
      latitude: Number(this.data.scheduleData.latitude),
      scale: 18
    })
  },

  sure: function (e) {
    wx.navigateTo({
      url: '../detail/detail?scheduleId=' + this.data.scheduleId,
    })
  },

  reserve: function(){
    wx.navigateTo({
      url: '../reserve/reserve',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})