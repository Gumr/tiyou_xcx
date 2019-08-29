import BaseService from "./BaseService";
import { post, get } from "../utils/http";

export default class StudentService extends BaseService {
	/**
	 *  创建宝宝
	 */
  createStudent(params) {
    return get("/api/student/createStudent",
      params,
    ).then(this.handleRespond);
  }

  // 编辑宝宝
  updateStudent(params) {
    return get("/api/student/updateStudent",
      params,
    ).then(this.handleRespond);
  }
}
