import request from "@/utils/request";

/**
 * 数据字典管理接口
 */
class OptionAPI {
  /**
   * 搜索数据字典项
   * @param {*} params 
   * @returns 
   */
  fetchList(params) {
    return request({
      url: "/qms/option/list",
      method: "post",
      data: params,
    });
  }

  /**
   * 获取所有数据字典类型
   * @param {*} params 
   * @returns 
   */
  fetchCatagoryList() {
    return request({
      url: "/qms/option/category",
      method: "get",
    });
  }

  /**
   * 添加数据字典项
   * @param {*} params 
   * @returns 
   */
  create(params) {
    return request({
      url: "/qms/option",
      method: "post",
      data: params,
    });
  }

  /**
   * 更新数据字典项
   * @param {*} params 
   * @returns 
   */
  update(params) {
    return request({
      url: `/qms/option/${params.id}`,
      method: "put",
      data: params,
    });
  }

  /**
   * 删除数据字典项
   * @param {*} id 
   * @returns 
   */
  remove(id) {
    return request({
      url: `/qms/option/${id}`,
      method: "delete",
    });
  }

  /**
   * 获取报价页面用到的选项
   * @returns
   */
  fetchOfferOptions() {
    return request({
      url: "/qms/option/list/offer",
      method: "get"
    });
  }
}

export default new OptionAPI();

