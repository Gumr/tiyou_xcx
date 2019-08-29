// pages/experience/experience.js
const app = getApp();
import LoginService from "../../service/LoginService";
const loginService = new LoginService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    image_cache: app.globalData.image_cache,
    channelNo: '',
    giveUserId: '',
    list: [],
    giveUser: {
      avatar: '',
      nickName: '',
    },
    id: '',//教学点id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '科学实验室体验卡',
    })
    if (options.scene) {
      var scene = decodeURIComponent(options.scene).split('&')
      // console.log(scene)
      // 添加渠道id
      app.globalData.channelNo = scene[0].split('=')[1] ? scene[0].split('=')[1] : app.globalData.channelNo
      this.setData({
        channelNo: scene[0].split('=')[1],
        giveUserId: scene[1].split('=')[1],
        id: scene[2] ? (scene[2].split('=')[1] ? scene[2].split('=')[1] : '') : '',
      }, () => {
        this.getList('true');
      })
    }else{
      app.globalData.channelNo = options.c ? options.c : app.globalData.channelNo
      this.setData({
        channelNo: options.c,
        giveUserId: options.u,
        id: options.t ? options.t : '',
      }, () => {
        this.getList('true');
      })
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

  receive: function () {
    var that = this;
    loginService
      .getExperienceCard({
        giveUserId: that.data.giveUserId,
        giveChannelNo: that.data.channelNo,
      })
      .then(res => {
        console.log(res)
        if (res.code == '0000') {
          wx.showToast({
            title: '领取成功',
            duration: 2000,
          })
          that.getList();
        }
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  getList: function (refresh) {
    var that = this;
    loginService
      .getReceiveInfoByUserId({
        userId: that.data.giveUserId,
      })
      .then(res => {
        if(refresh == 'true'){
          that.receive();
        }
        var list = res.data.receiveUserList;
        for (var i = 0; i < list.length; i++) {
          list[i].time = list[i].createTime.split('-')[1] + '-' + list[i].createTime.split('-')[2]
        }
        that.setData({
          list: list,
          ['giveUser.avatar']: res.data.avatar,
          ['giveUser.nickName']: res.data.nickName,
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  yk: function(){
    if(this.data.id){
      wx.reLaunch({
        url: '../storedetail/storedetail?id=' + this.data.id,
      })
    }else{
      wx.switchTab({
        url: "../index/index",
      })
    }
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