import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class PayService extends BaseService {
	/**
	 *  支付
	 */
  wxPay(params) {
    return post("/api/pay/wxPay",
      params,
      {loadingMsg: "下单中" }
    ).then(this.handleRespond);
  }
}
