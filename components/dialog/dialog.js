// components/Dialog/dialog.js
// 子组件
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的默认属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 弹窗标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '标题' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 弹窗内容
    content: {
      type: String,
      value: '弹窗内容'
    },
    // 弹窗取消按钮文字
    cancelText: {
      type: String,
      value: '取消'
    },
    // 弹窗确认按钮文字
    confirmText: {
      type: String,
      value: '确定'
    },
    // 弹窗是否显示“取消”按钮
    isShowCancelBtn: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制：默认不显示
    isShow: false,
    updatePanelAnimationData: ''
  },

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法（父组件会调用）
     */

    //隐藏弹框
    hideDialog() {
      this.leavePupAnimation();
    },


    //展示弹框
    showDialog() {
      this.goIntoPupAnimation();
    },

    // 弹窗淡入动画设置
    goIntoPupAnimation() {
      // 第1步：创建动画实例 
      let animation = wx.createAnimation({
        duration: 20, //动画时长 
        timingFunction: "linear", //线性 
      });
      // 第2步：这个动画实例赋给当前的动画实例 
      this.animation = animation;
      // 第3步：执行第一组动画 
      animation.opacity(0).step();
      // 第4步：导出动画对象赋给数据对象储存 
      this.setData({
        updatePanelAnimationData: animation.export(),
        isShow: true //显示弹窗
      })
      // 第5步：设置定时器到指定时候后，执行第二组动画 
      setTimeout(function () {
        // 执行第二组动画 
        animation.opacity(1).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
        this.setData({
          updatePanelAnimationData: animation,
        })
      }.bind(this), 20)

    },

    // 弹窗淡出动画设置
    leavePupAnimation() {
      // 第1步：创建动画实例 
      let animation = wx.createAnimation({
        duration: 20, //动画时长 
        timingFunction: "linear", //线性 
      });
      // 第2步：这个动画实例赋给当前的动画实例 
      this.animation = animation;
      // 第3步：执行第一组动画 
      animation.opacity(0).step();
      // 第4步：导出动画对象赋给数据对象储存 
      this.setData({
        updatePanelAnimationData: animation.export()
      })
      // 第5步：设置定时器到指定时候后，执行第二组动画 
      setTimeout(function () {
        // 执行第二组动画 
        animation.opacity(0).step();
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
        this.setData({
          updatePanelAnimationData: animation,
          isShow: false //隐藏弹窗
        })
      }.bind(this), 20)

    },



    /*
     * 内部私有方法建议以下划线开头：子组件内调用
     * triggerEvent 用于触发事件
     */
    _cancelEvent(e) {
      //触发点击“取消”按钮回调
      // console.log('子组件dialog.js——您点击了“取消”按钮');
      // console.log('取消按钮信息：', e);
      // 通过triggerEvent来给父组件传递信息的
      this.triggerEvent("cancelEvent", '取消'); // 将子组件数据通过参数的形式传递给父组件，这里是向父组件传递事件名，传递一个参数值('取消')给父组件
      this.hideDialog(); //隐藏弹窗
    },


    _confirmEvent(e) {
      //触发点击“确认”按钮回调
      // console.log('子组件dialog.js——点击了“确认”按钮');
      // console.log('确认按钮信息：', e);
      this.triggerEvent("confirmEvent", '确认');
      this.hideDialog(); //隐藏弹窗
    }
  }
})
