/**
 * Created by Gujunwei on 2019/6/25.
 */

export default class BaseService {
  constructor() {
    this.app = getApp();
  }

	/**
	 * 处理响应
	 * @param res
	 * @return {Promise.<*>}
	 */
  handleRespond(res) {
    // console.log(res)
    return  Promise.resolve(res) ;
  }

	/**
	 * 处理网络请求错误
	 */
  handleError(err) {
    wx.showModal({
      title: "请求失败",
      content: err.errMsg || err.msg || "请求失败",
      showCancel: false
    });
  }
}
