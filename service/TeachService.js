import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class TeachService extends BaseService {
	/**
	 * 预约区域 (预约课程)
	 */
  getTeachLocationTree(params) {
    return get("/api/teach/getTeachPlaceTree",
      params,
    ).then(this.handleRespond);
  }


  // 获取教学场所详情
  getTeachPlaceById(params) {
    return get("/api/teach/getTeachPlaceById",
      params,
    ).then(this.handleRespond);
  }

  // 获取有教学点区下拉框
  getDistrictByTeachLocation(params) {
    return get("/api/teach/getHasTeachPlaceDistrict",
      params,
    ).then(this.handleRespond);
  }

  // 分页获取教学（上课）点列表
  getTeachLocationList(params) {
    return get("/api/teach/getTeachPlaceListByPage",
      params,
    ).then(this.handleRespond);
  }


  // 获取登录用户的学生(宝宝)列表
  getStudentList(params) {
    return get("/api/student/getStudentListByLoginUser",
      params,
    ).then(this.handleRespond);
  }
  
}
