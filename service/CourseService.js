import BaseService from "./BaseService";
import {
  post,
  postJson,
  get
} from "../utils/http";

export default class CourseService extends BaseService {
  /*获取课程主题列表*/
  getCourseThemeList(params) {
    return get("/api/course/getThemeList",
      params,
    ).then(this.handleRespond);
  }

  /*根据课程id 获取课程详情*/
  getCourseByCouseId(params) {
    return get("/api/course/getCourseByCouseId",
      params,
    ).then(this.handleRespond);
  }

  //根据主题id获取主题详情
  getThemeByThemeId(params) {
    return get("/api/course/getThemeByThemeId",
      params,
      // {loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }

  //根据主题id获取课程列表
  getCourseListByThemeId(params) {
    return get("/api/course/getCourseListByThemeId",
      params,
      // {loadingMsg: "加载中" }
    ).then(this.handleRespond);
  }

  // 首页广告图banner图
  getAdvimgList(params) {
    return get("/api/adv/getAdvimgList",
      params,
    ).then(this.handleRespond);
  }

  // 获取首页精选课程
  getCourseListByPick(params) {
    return get("/api/course/getCourseListByPick",
      params,
    ).then(this.handleRespond);
  }

  // 获取教学点的排课列
  getCourseSchedule(params) {
    return get("/api/course/schedule/list",
      params,
    ).then(this.handleRespond);
  }

  // 根据排课ID获取预约页面的明细
  getReserveDetail(params) {
    return get("/api/course/schedule/detail",
      params,
    ).then(this.handleRespond);
  }

  // 分页获取课程列
  getCourseList(params) {
    return get("/api/course/schedule/page",
      params,
    ).then(this.handleRespond);
  }

  // 获取教学点下的排课日历及预约人数
  getScheduleDateAndPeople(params) {
    return postJson("/api/course/schedule/calendar",
      params,
    ).then(this.handleRespond);
  }

  // 创建预约课程订单
  createCourseReserve(params) {
    return get("/api/course/createCourseReserve",
      params,
    ).then(this.handleRespond);
  }

  // 分页获取用户课程预约记录
  getCourseReservePage(params) {
    return get("/api/course/getCourseReservePageByUserId",
      params,
    ).then(this.handleRespond);
  }

  // 根据教师ID/搜索类型,分页获取排课核销列表
  getCourseScheduleVerifyPage(params) {
    return get("/api/course/getCourseScheduleVerifyPage",
      params,
    ).then(this.handleRespond);
  }

  // 根据预约ID获取课程预约详情
  getCourseReserveByReserveId(params) {
    return get("/api/course/getCourseReserveByReserveId",
      params,
    ).then(this.handleRespond);
  }

  // 根据排课ID, 获取预约学生列表
  getCourseReserveStudentList(params) {
    return get("/api/course/getCourseReserveStudentList",
      params,
    ).then(this.handleRespond);
  }

  // 用户取消课程预约
  cancelCourseReserve(params) {
    return get("/api/course/cancelCourseReserve",
      params,
    ).then(this.handleRespond);
  }

  // 教师核销课程预约
  verifyCourseReserveByTeacher(params) {
    return get("/api/course/verifyCourseReserveByTeacher",
      params,
    ).then(this.handleRespond);
  }

  // 时间排课时间段下拉选
  select(params) {
    return get("/api/course/schedule/time/range/select",
      params,
    ).then(this.handleRespond);
  }

  // 获取教学定树形结构，以城市为组
  groupByCity(params) {
    return get("/api/course/teach/place/tree/groupByCity",
      params,
    ).then(this.handleRespond);
  }

  // 排课列表 - 按照教学点分类
  groupByTeachPlace(params) {
    return postJson("/api/course/schedule/list/groupByTeachPlace",
      params,
    ).then(this.handleRespond);
  }

  // 生成公众号二维码(无限制)
  create(params) {
    return postJson("/api/course/code/wxmp/create",
      params,
    ).then(this.handleRespond);
  }
}