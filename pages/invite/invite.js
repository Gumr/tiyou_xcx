// pages/invite/invite.js
const app = getApp();
import LoginService from "../../service/LoginService";
const loginService = new LoginService();
import {
  BASE_URL
} from "../../utils/http";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIpx: app.globalData.isIpx,
    image_cache: app.globalData.image_cache,
    userList: [],
    hbShow: false,
    channelNo: app.globalData.channelNo,
    backimg: "", //需要https图片路径
    head: "", //头像
    codeSrc: '',
    name: '', //姓名
    path: 'pages/experience/experience',
    userId: '',
    user: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.init();
    this.getUser();
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
    loginService
      .getReceiveUserList({

      })
      .then(res => {
        var list = res.data;
        for (var i = 0; i < list.length; i++) {
          list[i].time = list[i].createTime.split(' ')[0]
        }
        that.setData({
          userList: list
        })
      })
      .catch(err => {
        wx.hideLoading();
      });
  },

  getUser: function () {
    var that = this;
    app.getLoginUser(function (res) {
      that.setData({
        user: res.data
      })
    })
  },

  invite: function() {
    if (this.data.user && Number(this.data.user.giveExperienceCard) <= 0) {
      wx.showToast({
        title: '购买课时礼包可获得更多邀请机会',
        icon: 'none',
        duration: 1800,
        mask: true
      });
      return
    }
    if (this.data.user && Number(this.data.user.giveExperienceCard) > 0) {
      this.setData({
        hbShow: true,
      }, () => {
        this.make()
      }) 
    }
  },

  close: function(){
    this.setData({
      hbShow: false,
    })
  },

  make: function() {
    this.setData({
      backimg: this.data.image_cache + 'hb2.png',
      codeSrc: BASE_URL + '/api/wxma/getMiniQRCode.jpg',
    }, () => {
      this.user();
    })
  },

  user: function() {
    this.setData({
      userId: this.data.user.userId,
      head: this.data.user.avatar,
      name: this.data.user.nickName.length > 6 ? this.data.user.nickName.substring(0, 6) + '...' : this.data.user.nickName.substring(0, 6),
    }, () => {
      this.getbackimgInfo();
    })
  },

  /**
   * 先下载背景图片
   */
  getbackimgInfo: function() {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.backimg, //背景图片路径
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var backimgSrc = res.tempFilePath; //下载成功返回结果
          that.gethead(backimgSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '头像下载失败！',
            icon: 'none',
            duration: 2000,
            success: function() {
              var backimgSrc = "";
              that.gethead(backimgSrc);
            }
          })
        }
      }
    })
  },

  /**
   * 下载头像图片
   */
  gethead: function(backimgSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.head, //背景图片路径
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var headSrc = res.tempFilePath;
          that.getCode(backimgSrc, headSrc); //继续下载二维码图片
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function() {
              var headSrc = "";
              that.getCode(backimgSrc, headSrc);
            }
          })
        }
      }
    })
  },

  // 下载小程序码图片
  getCode: function(backimgSrc, headSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    });
    var that = this;
    wx.downloadFile({
      url: that.data.codeSrc + '?userId=' + that.data.userId + '&page=' + that.data.path + '&channelNo=' + that.data.channelNo, //背景图片路径
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode === 200) {
          var codeSrc = res.tempFilePath;
          that.sharePosteCanvas(backimgSrc, headSrc, codeSrc);
        } else {
          wx.showToast({
            title: '二维码下载失败！',
            icon: 'none',
            duration: 2000,
            success: function() {
              var codeSrc = "";
              that.sharePosteCanvas(backimgSrc, headSrc, codeSrc);
            }
          })
        }
      }
    })
  },


  /**
   * 开始用canvas绘制分享海报
   * @param backimgSrc 下载的头像图片路径
   * @param headSrc   下载的二维码图片路径
   */
  sharePosteCanvas: function(backimgSrc, headSrc, codeSrc) {
    wx.showLoading({
      title: '生成中...',
      mask: true,
    })
    var that = this;
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function(rect) {
      var height = rect.height;
      var right = rect.right;
      var width = rect.width;
      // console.log(width)
      var left = rect.left;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, rect.width, height);

      //背景图
      if (backimgSrc) {
        ctx.drawImage(backimgSrc, 0, 0, width, height);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.save() // 对当前区域保存
      }

      //姓名
      if (that.data.name) {
        ctx.setFontSize(8);
        ctx.setFillStyle('#333');
        ctx.setTextAlign('left');
        ctx.fillText(that.data.name, width * 0.2254, height * 0.065);
        ctx.stroke(); //对当前路径进行描边
        ctx.closePath(); //关闭当前路径
      }

      //  绘制头像
      if (headSrc) {
        const x = width * 0.0525;
        const y = height * 0.0229;
        const w = width * 0.0966;
        const h = width * 0.0966;
        const r = 3;
        ctx.beginPath();
        ctx.save();
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#fff')
        ctx.moveTo(x + r, y); // 创建开始点
        ctx.lineTo(x + w - r, y); // 创建水平线
        ctx.arcTo(x + w, y, x + w, y + r, r); // 创建弧
        ctx.lineTo(x + w, y + h - r); // 创建垂直线
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r); // 创建弧
        ctx.lineTo(x + r, y + h); // 创建水平线
        ctx.arcTo(x, y + h, x, y + h - r, r); // 创建弧
        ctx.lineTo(x, y + r); // 创建垂直线
        ctx.arcTo(x, y, x + r, y, r); // 创建弧
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(headSrc, x, y, w, h, 0, 0);
        ctx.restore();
      }

      if (codeSrc) {
        const x = width * 0.68;
        const y = height * 0.82;
        const w = width * 0.24;
        const h = width * 0.24;
        const r = 5;
        ctx.beginPath();
        ctx.save();
        ctx.setLineWidth(1)
        ctx.setStrokeStyle('#fff')
        ctx.moveTo(x + r, y); // 创建开始点
        ctx.lineTo(x + w - r, y); // 创建水平线
        ctx.arcTo(x + w, y, x + w, y + r, r); // 创建弧
        ctx.lineTo(x + w, y + h - r); // 创建垂直线
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r); // 创建弧
        ctx.lineTo(x + r, y + h); // 创建水平线
        ctx.arcTo(x, y + h, x, y + h - r, r); // 创建弧
        ctx.lineTo(x, y + r); // 创建垂直线
        ctx.arcTo(x, y, x + r, y, r); // 创建弧
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(codeSrc, x, y, w, h, 0, 0);
        ctx.restore();
      }

    }).exec()

    setTimeout(function() {
      ctx.draw();
      wx.hideLoading();
    }, 1000)

  },

  //点击保存到相册
  saveShareImg: function() {
    var that = this;
    wx.showLoading({
      title: '正在保存',
      mask: true,
    })
    setTimeout(function() {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function(res) {
          wx.hideLoading();
          var tempFilePath = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showToast({
                title: '保存成功~',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                hbShow: false,
              })
            },
            fail: function(res) {
              that.setting()
            }
          })
        }
      });
    }, 200);
  },

  // 拒绝授权打开设置
  setting: function(){
    var that = this;
    wx.getSetting({
      success: function (res) {
        var statu = res.authSetting;
        if (!statu['scope.writePhotosAlbum']) {
          wx.showModal({
            title: '保存图片需开启权限',
            content: '请确认授权，否则将无法保存图片',
            showCancel: false,
            confirmColor: 'rgba(245, 175, 83, 1)',
            success: function (tip) {
              if (tip.confirm) {
                wx.openSetting({
                  success: function (data) {
                    if (data.authSetting["scope.writePhotosAlbum"] === true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //授权成功之后，再调用保存相册
                      that.saveShareImg()
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'success',
                  duration: 1000
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '调用授权窗口失败',
          icon: 'success',
          duration: 1000
        })
      }
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
  // onShareAppMessage: function() {

  // }
})