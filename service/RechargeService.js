import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class RechargeService extends BaseService {
	/**
	 *  获取充值列表
	 */
  getRechargeGoodsList(params) {
    return get("/api/recharge/getRechargeGoodsList",
      params,
    ).then(this.handleRespond);
  }

  // 创建充值订单
  createRechargeOrder(params) {
    return get("/api/recharge/createRechargeOrder",
      params,
      { loadingMsg: "下单中" }
    ).then(this.handleRespond);
  }

  // 取消充值订单
  cancelRechargeOrder(params) {
    return get("/api/recharge/cancelRechargeOrder",
      params,
      { loadingMsg: "取消支付" }
    ).then(this.handleRespond);
  }

  // 获取充值订单
  getRechargeOrderByPage(params) {
    return get("/api/recharge/getRechargeOrderByPage",
      params,
    ).then(this.handleRespond);
  }

  // 获取微信时间戳 随机串
  doWxPay(params) {
    return post("/api/pay/doWxPay",
      params,
    ).then(this.handleRespond);
  }

  // 使用兑换码 code
  useRedeemCode(params) {
    return post("/api/course/redeemcode/useRedeemCode",
      params,
    ).then(this.handleRespond);
  }
}
