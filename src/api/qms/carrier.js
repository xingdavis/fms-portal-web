import request from "@/utils/request";

/**
 * 船公司信息管理接口
 */
class CarrierAPI {
  /**
   * 搜索船公司信息
   * @param {*} params
   * @returns
   */
  fetchList(params) {
    return request({
      url: "/qms/carrier/list",
      method: "post",
      data: params,
    });
  }
}

export default new CarrierAPI();
