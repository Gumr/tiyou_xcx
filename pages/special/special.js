// pages/special/special.js
const app = getApp();
import RechargeService from "../../service/RechargeService";
const rechargeService = new RechargeService();
import lazyLoad from '../../libs/js/lazyload';
let lazyload;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_cache: app.globalData.image_cache,
    rechargeGoodsId: '',
    total: '',
    img: [
      app.globalData.image_cache + '699vip_1.jpg',
      app.globalData.image_cache + '699vip_2.jpg',
      app.globalData.image_cache + '699vip_3.jpg',
      app.globalData.image_cache + '699vip_4.jpg',
    ] ,//图片列表
    canPay: true,//点击一次
    shareTag: false,//是否分享进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options) {
      app.globalData.channelNo = options.channelNo ? options.channelNo : app.globalData.channelNo
    };
    this.init();
    lazyload = new lazyLoad(this, {
      classNote: '.item-', //循环节点
      initNum: 4, //初始化展示多少个节点
      limit: 4 //每次加载多少个节点
    })
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
    //开始监听节点，注意需要在onReady才能监听，此时节点才渲染
    lazyload.observe();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  init: function() {
    var that = this;
    rechargeService
      .getRechargeGoodsList({

      })
      .then(res => {
        var list = res.data;
        for (var i = 0; i < list.length; i++) {
          if (Number(list[i].lcoin) == 18) {
            that.setData({
              rechargeGoodsId: res.data[i].rechargeGoodsId,
              total: res.data[i].price / 100,
            })
            return
          }
        }
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  buySpecial: function() {
    var that = this;
    if (that.data.canPay == false) {
      return
    }
    that.setData({
      canPay: false,
    })
    rechargeService
      .createRechargeOrder({
        rechargeGoodsId: that.data.rechargeGoodsId,
        channelNo: app.globalData.channelNo
      })
      .then(res => {
        that.doWxPay(res.data)
      })
      .catch(err => {
        that.setData({
          canPay: true,
        })
        wx.hideLoading();
      });
  },

  doWxPay: function(rechargeOrderId) {
    var that = this;
    rechargeService
      .doWxPay({
        rechargeOrderId: rechargeOrderId
      })
      .then(res => {
        that.wxPay(res.data, rechargeOrderId)
      })
      .catch(err => {
        that.setData({
          canPay: true,
        })
        wx.hideLoading();
      });
  },

  wxPay: function(params, rechargeOrderId) {
    var that = this;
    wx.requestPayment({
      timeStamp: params.timeStamp,
      nonceStr: params.nonceStr,
      package: params.package_,
      signType: params.signType,
      paySign: params.paySign,
      success(res) {
        wx.showToast({
          title: '充值成功',
          icon: 'success',
          duration: 1500
        })
        that.setData({
          canPay: true,
        })
        setTimeout(() => {
          if (getCurrentPages().length == 1){
            wx.switchTab({
              url: "../index/index",
            })
          }else{
            wx.navigateBack({

            })
          }
        }, 1500)
      },
      fail(res) {
        // 取消支付 或支付失败
        that.setData({
          canPay: true,
        })
        rechargeService
          .cancelRechargeOrder({
            rechargeOrderId: rechargeOrderId
          })
          .then(res => {
            wx.showToast({
              title: '支付失败，请重新支付',
              icon: 'none',
              duration: 2000
            })
          })
          .catch(err => {
            wx.hideLoading();
          });
      }
    })
  },

  backHome: function () {
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})