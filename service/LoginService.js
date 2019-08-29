import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class LoginService extends BaseService {
	/**
	 * 校验用户信息
	 */
  checkUserToken(params) {
    return get("/api/user/checkUserToken",
      params,
      // {loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }
  wxMiniLogin(params) {
    return post("/api/user/wxMiniLogin",
      params,
      // {loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }
  wxMiniBindPhone(params) {
    return post("/api/user/wxMiniBindPhone",
      params,
      // {loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }
  // 获取登录用户信息
  getLoginUser(params) {
    return get("/api/user/getLoginUser",
      params,
      // {loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }

  // 根据发卡用户ID,获取领卡用户列表
  getReceiveUserList(params) {
    return get("/api/user/getReceiveUserList",
      params,
    ).then(this.handleRespond);
  }

  // 领取体验卡
  getExperienceCard(params) {
    //giveUserId giveChannelNo
    return get("/api/user/getExperienceCard",
      params,
    ).then(this.handleRespond);
  }

  // 生成小程序二维码
  getMiniQRCode(params) {
    //path channelNo
    return get("/api/user/getMiniQRCode.jpg",
      params,
    ).then(this.handleRespond);
  }

  // 获取 指定用户的邀请用户列表信息
  getReceiveInfoByUserId(params) {
    // userId
    return get("/api/user/getReceiveInfoByUserId",
      params,
    ).then(this.handleRespond);
  }

  // 获取 引导图片
  guide(params) {
    return get("/api/app/new/guide",
      params,
    ).then(this.handleRespond);
  }

  // 获取用户排课邀请详情
  detail(params) {
    return get("/api/course/user/invite/schedule/detail",
      params,
    ).then(this.handleRespond);
  }

  // 根据场景值获取 参数
  info(params) {
    return get("/api/course/code/info",
      params,
    ).then(this.handleRespond);
  }
}
