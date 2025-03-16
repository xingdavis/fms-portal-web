import request from "@/utils/request";

/**
 * 港口信息管理接口
 */
class PortAPI {
  /**
   * 搜索港口信息
   * @param {*} params
   * @returns
   */
  fetchList(params) {
    return request({
      url: "/qms/port/list",
      method: "post",
      data: params,
    });
  }
}

export default new PortAPI();
