import request from "@/utils/request";

/**
 * 报价接口
 */
class OfferAPI {
  /**
   * 搜索报价信息
   * @param {*} params
   * @returns
   */
  fetchList(params) {
    return request({
      url: "/qms/offer/list",
      method: "post",
      data: params,
    });
  }

  /**
   * 首页特惠报价信息
   * @param {*} params
   * @returns
   */
  specialList(params) {
    return request({
      url: "/qms/offer/special",
      method: "post",
      data: params,
    });
  }
}

export default new OfferAPI();
