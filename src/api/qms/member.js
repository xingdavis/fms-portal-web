import request from "@/utils/request";

/**
 * 会员管理接口
 */
class MemberAPI {
  /**
   * 搜索会员
   * @param {*} params
   * @returns
   */
  fetchList(params) {
    return request({
      url: "/sso/list",
      method: "post",
      data: params,
    });
  }

  /**
   * 注册会员账号
   * @param {*} params
   * @returns
   */
  create(params) {
    return request({
      url: "/sso/register",
      method: "post",
      data: params,
    });
  }

  /**
   * 更新会员信息
   * @param {*} params
   * @returns
   */
  update(params) {
    return request({
      url: `/sso/member/${params.id}`,
      method: "put",
      data: params,
    });
  }

  /**
   * 删除会员信息
   * @param {*} id
   * @returns
   */
  removeMember(id) {
    return request({
      url: `/sso/member/${id}`,
      method: "delete",
    });
  }
}

export default new MemberAPI();
