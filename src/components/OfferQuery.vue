<!-- src/components/FreightRateList.vue -->
<template>
  <div class="query-con">
    <section class="app-main">
      <div class="freight-rate-list">
        <!-- 搜索面板 -->
        <div class="search-panel">
          <div class="search-tab">
            <div class="tab-wrap">
              <div
                v-for="(tab, index) in tabs"
                :key="index"
                @click="activeTab = tab.type"
                :class="{
                  'tab-item': true,
                  flex_cc: true,
                  active: activeTab === tab.type,
                }"
              >
                {{ tab.label }}
              </div>
            </div>
          </div>
        </div>

        <div class="container">
          <div class="content">
            <div class="freight-container">
              <div class="freight-bian">
                <div class="input-wrap flex_sb">
                  <div class="flex input-wrap-k">
                    <!-- 起运港 -->
                    <div class="pol-input flex_ac">
                      <div class="input">
                        <p>起运港</p>

                        <el-autocomplete
                          v-model="queryOptions.startPortObj"
                          :fetch-suggestions="searchPort"
                          placeholder="请输入出发地（支持城市/港口名称）"
                          @select="handleSelectStartPort"
                          :highlight-first-item="true"
                          trigger-on-focus
                          clearable
                          @clear="handleClearStartPort"
                          value-key="displayText"
                          popper-class="my-autocomplete"
                          :popper-append-to-body="false"
                        >
                          <template #default="{ item }">
                            <div class="name">{{ item.displayText }}</div>
                            <div class="addr">
                              {{ item.country }} {{ item.city }}
                            </div>
                          </template>
                        </el-autocomplete>
                      </div>
                      <div class="port-panel-tan" v-if="showStartPanel">
                        <div class="port-panel" style="top: 55px; left: 0px">
                          <div class="title">热门港口</div>
                          <div class="port-wrap flex_fs">
                            <div
                              class="port-item flex_cc"
                              v-for="port in startPorts"
                              :key="port"
                              @click="selectPort('start', port)"
                            >
                              {{ port }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 目的港 -->
                    <div class="pol-input flex_ac">
                      <div class="input">
                        <p>目的港</p>
                        <el-autocomplete
                          v-model="queryOptions.destinationPortObj"
                          :fetch-suggestions="searchPort"
                          placeholder="请输入目的地（支持城市/港口名称）"
                          @select="handleSelectDestinationPort"
                          :highlight-first-item="true"
                          trigger-on-focus
                          clearable
                          @clear="handleClearDestinationPort"
                          value-key="displayText"
                          popper-class="my-autocomplete"
                          :popper-append-to-body="false"
                        >
                          <template #default="{ item }">
                            <div class="name">{{ item.displayText }}</div>
                            <div class="addr">
                              {{ item.country }} {{ item.city }}
                            </div>
                          </template>
                        </el-autocomplete>
                      </div>
                      <div class="port-panel-tan" v-if="showEndPanel">
                        <div class="port-panel" style="top: 55px; left: 0px">
                          <div class="title">热门港口</div>
                          <div class="port-wrap flex_fs">
                            <div
                              class="port-item flex_cc"
                              v-for="port in endPorts"
                              :key="port"
                              @click="selectPort('end', port)"
                            >
                              {{ port }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 货好时间 -->
                    <div class="pol-input flex_ac">
                      <div class="input">
                        <p>货好时间</p>
                        <!-- <div id="haohuo-date">
                          <input
                            type="text"
                            id="haohuo-input-date"
                            v-model="readyDate"
                            placeholder="请选择(非必填)"
                            @focus="showDatePicker = true"
                          />
                          <i
                            class="input-date-close"
                            v-if="readyDate"
                            @click="readyDate = ''"
                            >x</i
                          >
                        </div> -->
                        <el-date-picker
                          v-model="queryOptions.loadingDate"
                          value-format="yyyy-MM-dd"
                          type="date"
                          placeholder="选择货好时间"
                        >
                        </el-date-picker>
                      </div>
                    </div>
                  </div>
                  <div class="search-btn flex_cc ml_16" @click="searchFreight">
                    <img src="@/assets/images/ss_icon_3.png" class="ss" />
                    查运价
                  </div>
                </div>
              </div>
              <!-- 过滤栏 -->
              <div class="freight-bian search-tool flex_bc">
                <div class="left-part-nr">
                  <div>
                    <el-autocomplete
                      popper-class="my-autocomplete"
                      v-model="queryOptions.carrier"
                      clearable
                      :fetch-suggestions="searchCarrier"
                      placeholder="请输入船司"
                      @select="handleSelectCarrier"
                      trigger-on-focus
                      value-key="companyCode"
                    >
                    </el-autocomplete>
                  </div>
                  <div>
                    <el-checkbox
                      v-model="queryOptions.transferType"
                      label="只看直达"
                      @change="handleTransferTypeChange"
                      true-value="DIRECT"
                    ></el-checkbox>
                  </div>
                </div>
                <div class="right-part flex item-nn">
                  <div class="copy-template">复制运价模板</div>
                  <div
                    class="price-order-item flex_cc"
                    :class="{ active: queryOptions.orderField === 'fee20gp' }"
                    @click="handlePriceTypeClick('fee20gp')"
                  >
                    20GP低价优先
                  </div>
                  <div
                    class="price-order-item flex_cc"
                    :class="{ active: queryOptions.orderField === 'fee40gp' }"
                    @click="handlePriceTypeClick('fee40gp')"
                  >
                    40GP低价优先
                  </div>
                  <div
                    class="price-order-item flex_cc"
                    :class="{ active: queryOptions.orderField === 'fee40hq' }"
                    @click="handlePriceTypeClick('fee40hq')"
                  >
                    40HQ低价优先
                  </div>
                </div>
              </div>

              <!-- 运价列表 -->
              <div class="content-container">
                <div class="list-wrap">
                  <div
                    class="list-item"
                    v-for="(item, index) in freightOfferList"
                    :key="index"
                  >
                    <div class="ship-content">
                      <div class="ship-info flex_ac">
                        <div
                          class="ship-logo-wrap mr_4"
                          style="width: 44px; height: 30px"
                        >
                          <!-- <img :src="item.logo" /> -->
                        </div>
                        <div>
                          <p>{{ item.carrier }}</p>
                          <span>航程：{{ item.voyageDays }}天</span>
                        </div>
                      </div>
                      <div class="ship-wrap flex_ac">
                        <div class="item">
                          <div class="e-name">
                            {{ item.startPortObj?.cityEnName }}
                          </div>
                          <div class="c-name">
                            {{ item.startPortObj?.city }}
                          </div>
                        </div>
                        <el-popover
                          class="box-item"
                          placement="top"
                          width="220"
                          :disabled="
                            !item.transferPortList ||
                            item.transferPortList.length === 0
                          "
                        >
                          <template #reference>
                            <div class="arrow-img">
                              <img
                                src="@/assets/images/transfer.png"
                                alt="箭头图标"
                                class="arrow"
                              />
                            </div>
                          </template>
                          <template #default>
                            <div class="transfer-content">
                              <div class="title">中转港口</div>
                              <div class="transfer-list">
                                <p
                                  v-for="(port, index) in item.transferPortList"
                                  :key="index"
                                >
                                  {{ port.portName }}({{ port.cityEnName }})
                                </p>
                              </div>
                            </div>
                          </template>
                        </el-popover>
                        <div class="item">
                          <div class="e-name">
                            {{ item.destinationPortObj?.cityEnName }}
                          </div>
                          <div class="c-name">
                            {{ item.destinationPortObj?.city }}
                          </div>
                        </div>
                      </div>
                      <div class="price-wrap flex_ac">
                        <el-popover popper-style="width:480px">
                          <template #reference>
                            <div class="price-content">
                              <div
                                class="price-item"
                                :class="{
                                  'price-click':
                                    formatPriceText(item.fee20gp) !== '--',
                                }"
                              >
                                <div class="price-type">20GP</div>
                                <span
                                  class="flex_ac"
                                  :class="{
                                    'price-heng':
                                      formatPriceText(item.fee20gp) === '--',
                                  }"
                                >
                                  {{ formatPriceText(item.fee20gp) }}
                                </span>
                              </div>
                            </div>
                          </template>
                          <template #default>
                            <div class="commonPopper">
                              <div class="title">20GP-预估价格(单箱)</div>
                              <div class="fee-container">
                                <div class="content-top">
                                  <div>
                                    <div class="total mb_12">
                                      预估总费用：
                                      <span class="mr_4"
                                        >USD
                                        <span class="fee">{{
                                          item.fee20gp
                                        }}</span></span
                                      >
                                    </div>
                                    <div>
                                      <div class="fee-item flex_bc mb_4">
                                        海运费 (箱型)
                                        <span> USD {{ item.fee20gp }} </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </el-popover>
                        <el-popover popper-style="width:480px">
                          <template #reference>
                            <div class="price-content">
                              <div
                                class="price-item"
                                :class="{
                                  'price-click':
                                    formatPriceText(item.fee40gp) !== '--',
                                }"
                              >
                                <div class="price-type">40GP</div>
                                <span
                                  class="flex_ac"
                                  :class="{
                                    'price-heng':
                                      formatPriceText(item.fee40gp) === '--',
                                  }"
                                >
                                  {{ formatPriceText(item.fee40gp) }}
                                </span>
                              </div>
                            </div>
                          </template>
                          <template #default>
                            <div class="commonPopper">
                              <div class="title">40GP-预估价格(单箱)</div>
                              <div class="fee-container">
                                <div class="content-top">
                                  <div>
                                    <div class="total mb_12">
                                      预估总费用：
                                      <span class="mr_4"
                                        >USD
                                        <span class="fee">{{
                                          item.fee40gp
                                        }}</span></span
                                      >
                                    </div>
                                    <div>
                                      <div class="fee-item flex_bc mb_4">
                                        海运费 (箱型)
                                        <span> USD {{ item.fee40gp }} </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </el-popover>
                        <el-popover popper-style="width:480px">
                          <template #reference>
                            <div class="price-content">
                              <div
                                class="price-item"
                                :class="{
                                  'price-click':
                                    formatPriceText(item.fee40hq) !== '--',
                                }"
                              >
                                <div class="price-type">40HQ</div>
                                <span
                                  class="flex_ac"
                                  :class="{
                                    'price-heng':
                                      formatPriceText(item.fee40hq) === '--',
                                  }"
                                >
                                  {{ formatPriceText(item.fee40hq) }}
                                </span>
                              </div>
                            </div>
                          </template>
                          <template #default>
                            <div class="commonPopper">
                              <div class="title">40HQ-预估价格(单箱)</div>
                              <div class="fee-container">
                                <div class="content-top">
                                  <div>
                                    <div class="total mb_12">
                                      预估总费用：
                                      <span class="mr_4"
                                        >USD
                                        <span class="fee">{{
                                          item.fee40hq
                                        }}</span></span
                                      >
                                    </div>
                                    <div>
                                      <div class="fee-item flex_bc mb_4">
                                        海运费 (箱型)
                                        <span> USD {{ item.fee40hq }} </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </el-popover>
                      </div>
                      <div class="operate-wrap">
                        <div class="operate-info">
                          <!-- 本地费用操作项 -->
                          <div class="operate-item flex_ac">
                            <el-popover
                              trigger="click"
                              popper-style="width:800px"
                            >
                              <template #reference>
                                <div class="operate-item-1">
                                  <img
                                    :src="
                                      require('@/assets/images/t1-icon.png')
                                    "
                                  />
                                  本地费用
                                </div>
                              </template>
                              <template #default>
                                <!-- 本地费用弹窗 -->
                                <div class="commonPopper">
                                  <div class="title">本地费用</div>
                                  <div class="fee-container">
                                    <!-- 表格内容... -->
                                    <el-table :data="item.localFeeData">
                                      <el-table-column
                                        width="60"
                                        property="serialNo"
                                        label="序号"
                                      />
                                      <el-table-column
                                        width="80"
                                        property="itemName"
                                        label="名称"
                                      />
                                      <el-table-column
                                        width="60"
                                        property="unit"
                                        label="单位"
                                      />
                                      <el-table-column
                                        width="80"
                                        property="fee20gp"
                                        label="20GP"
                                      />
                                      <el-table-column
                                        width="80"
                                        property="fee40gp"
                                        label="40GP"
                                      />
                                      <el-table-column
                                        width="80"
                                        property="fee40hq"
                                        label="40HQ"
                                      />
                                      <el-table-column
                                        width="80"
                                        property="oneTicketAmount"
                                        label="单票价格"
                                      />
                                      <el-table-column
                                        width="80"
                                        property="currency"
                                        label="币种"
                                      />
                                    </el-table>
                                  </div>
                                </div>
                              </template>
                            </el-popover>
                          </div>

                          <div class="el-divider el-divider--vertical"></div>

                          <!-- 特别说明操作项 -->
                          <div class="operate-item flex_ac">
                            <el-popover trigger="click" width="700">
                              <template #reference>
                                <div class="operate-item-2">
                                  <img
                                    :src="
                                      require('@/assets/images/t2-icon.png')
                                    "
                                    class="t"
                                  />
                                  特别说明
                                </div>
                              </template>
                              <template #default>
                                <div class="commonPopper">
                                  <div class="title">特别说明</div>
                                  <div
                                    class="fee-container specialDesc-container"
                                  >
                                    {{ item.specialNote }}
                                  </div>
                                </div>
                              </template>
                            </el-popover>
                          </div>

                          <!-- 特别说明弹窗 -->
                        </div>

                        <div class="operate-info">
                          <!-- 复制运价按钮 -->
                          <div class="operate-item flex_ac">
                            <div class="operate-item-1">
                              <img
                                :src="require('@/assets/images/t3-icon.png')"
                              />
                              复制运价
                            </div>
                          </div>

                          <div class="el-divider el-divider--vertical"></div>

                          <!-- 运价趋势操作项 -->
                          <div class="operate-item flex_ac">
                            <div
                              class="operate-item-2"
                              @click="showSpecialNotePopup = true"
                            >
                              <img
                                :src="require('@/assets/images/t4-icon.png')"
                                class="t"
                              />
                              运价趋势
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="btn-wrap flex_cc">订舱</div>
                    </div>
                    <div class="line-content">
                      <div class="line-left">
                        <div class="tag-wrap">
                          <div class="straight flex_cc mr_4">
                            {{ formatTransferTypeText(item.transferType) }}
                          </div>
                        </div>
                        <div class="detail-info">
                          <div class="validate-date">
                            <span>航线代码</span>
                            <span class="text"
                              >({{
                                item.destinationPortObj?.shippingRoutesCode
                              }})</span
                            >
                          </div>
                          <div class="validate-date">
                            <span
                              >有效类别：{{
                                formatValidDateTypeText(item.validDateType)
                              }}</span
                            >
                            <span class="text"
                              >截关时间：{{
                                formatDateText(item.cutoffDate)
                              }}</span
                            >
                          </div>
                        </div>
                        <div class="date-info leftPadding">
                          <span>有效期</span>
                          <span class="text"
                            >{{ formatDateText(item.validStartDate) }} ~
                            {{ formatDateText(item.validEndDate) }}</span
                          >
                        </div>
                      </div>
                      <div class="line-right">预估费用</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <pagination
                v-show="totalRecord > 0"
                :total="totalRecord"
                v-model:page="queryOptions.pageNo"
                v-model:limit="queryOptions.pageSize"
                @pagination="getOfferList"
              /> -->
              <div class="freight-bian page-container">
                <el-pagination
                  v-show="totalRecord > 0"
                  background
                  v-model:page="queryOptions.pageNo"
                  v-model:limit="queryOptions.pageSize"
                  layout="prev, pager, next"
                  :total="totalRecord"
                  @current-change="handlePageChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps } from "vue";
import PortAPI from "@/api/qms/port";
import CarrierAPI from "@/api/qms/carrier";
import OfferAPI from "@/api/qms/offer";
import { formatDate } from "@/utils/date";

const props = defineProps({
  startPort: {
    type: Number,
    default: null,
  },
  destinationPort: {
    type: Number,
    default: null,
  },
});

// 数据定义
const activeTab = ref("FCL");
const tabs = [
  { label: "海运整箱", type: "FCL" },
  { label: "空运", type: "AFC" },
  { label: "海运拼箱", type: "LCL" },
];

// const startPort = ref("");
// const endPort = ref("");
// // const readyDate = ref("");
const showStartPanel = ref(false);
const showEndPanel = ref(false);
const showDatePicker = ref(false);

// 搜索框自动完成参数
const queryOptions = ref({
  pageNo: 1,
  pageSize: 20,
  itemType: null,
  carrier: null,
  loadingDate: null,
  startPortObj: null,
  startPort: null,
  startPortName: null,
  destinationPortObj: null,
  destinationPort: null,
  destinationPortName: null,
  transferType: null,
  orderDirection: "asc",
  orderField: null,
});
let portOptions = ref([]);

/**
 * 搜索港口
 * @param kw
 * @param callback
 */
const searchPort = async (kw = "", callback) => {
  kw = kw === "null" || kw === null || kw === undefined ? "" : kw.trim();
  const params = {
    pageSize: 20,
    pageNo: 1,
    keyword: kw || "",
  };
  try {
    const response = await PortAPI.fetchList(params);
    console.log("response", response);
    let list = portOptions;
    if (response) {
      // list = response.data.list;
      list = response.list.map((item) => ({
        ...item,
        displayText: formatPortText(item),
      }));
    }
    callback(list);
  } catch (error) {
    console.error("searchPort error", error);
  }
  // const response = await PortAPI.fetchList(params);
  // console.log("response", response);
  // let list = [];
  // if (response) {
  //   // list = response.data.list;
  //   list = response.data.list.map((item) => ({
  //     ...item,
  //     displayText: formatPortText(item),
  //   }));
  // }
  // callback(list);
};

// const formatTransferPortText = (transferPortList) => {
//   if (!transferPortList || transferPortList.length === 0) return "";
//   return transferPortList
//     .map((item) => `${item.portName}(${item.cityEnName})`)
//     .join(", ");
// };
const formatPortText = (port) => {
  if (port) {
    return `${port.portName}(${port.cityEnName},${port.country})`;
  }
  return "";
};
/**
 * 搜索港口信息
 */
const getPortList = (kw = "") => {
  const params = {
    pageSize: 20,
    pageNo: 1,
    keyword: kw || "",
  };
  PortAPI.fetchList(params)
    .then((response) => {
      // this.portOptions = response.data.list;
      portOptions = response.list.map((item) => ({
        ...item,
        displayText: formatPortText(item),
      }));
    })
    .catch((error) => {
      console.error("getPortList error", error);
    });
};
/**
 * 选择起运港事件
 * @param item
 */
const handleSelectStartPort = (item) => {
  if (!item) return;
  console.log("handleSelectStartPort item=", item);
  queryOptions.value.startPort = item.id;
};
/**
 * 清除起运港
 */
const handleClearStartPort = () => {
  console.log("handleClearStartPort");
  queryOptions.value.startPort = null;
};

const handleSelectDestinationPort = (item) => {
  if (!item) return;
  console.log("handleSelectStartPort item=", item);
  queryOptions.value.destinationPort = item.id;
};
/**
 * 清除起运港
 */
const handleClearDestinationPort = () => {
  console.log("handleClearDestinationPort");
  queryOptions.value.destinationPort = null;
};

/**
 * 运价搜索结果列表
 */
const freightOfferList = ref([]);
/**
 * 搜索结果总数
 */
const totalRecord = ref(0);

// 选择港口
// const selectPort = (type, value) => {
//   if (type === "start") {
//     startPort.value = value;
//     showStartPanel.value = false;
//   } else if (type === "end") {
//     endPort.value = value;
//     showEndPanel.value = false;
//   }
// };

// 搜索运价
const searchFreight = () => {
  getOfferList();
};

// 点击外部关闭面板
const handleClickOutside = (event) => {
  if (!event.target.closest(".pol-input")) {
    showStartPanel.value = false;
    showEndPanel.value = false;
    showDatePicker.value = false;
  }
};

// const formatListPortText = (port) => {
//   if (port) {
//     return `${port.cityEnName}(${port.portCode})`;
//   }
//   return "";
// };

const formatValidDateTypeText = (status) => {
  const statusMap = {
    DEPARTURE: "开船时间",
    DEADLINE: "截关时间",
  };
  return statusMap[status];
};

const formatTransferTypeText = (transferType) => {
  if (transferType && transferType === "TRANSIT") {
    return "中转";
  }
  return "直达";
};

// const formatVoyageDaysText = (voyageDays) => {
//   if (voyageDays) {
//     return voyageDays + "D";
//   }
//   return "";
// };

const formatDateText = (date) => {
  if (date) {
    return formatDate(new Date(date), "yyyy-MM-dd");
  } else {
    return "";
  }
};
const formatPriceText = (price) => {
  if (price) {
    return "$ " + price;
  }
  return "--";
};

const getOfferList = () => {
  const params = queryOptions.value;
  OfferAPI.fetchList(params)
    .then((response) => {
      console.log("getOfferList response", response);
      if (response) {
        // callback(freightOfferList, response.data.list);
        freightOfferList.value = response.list;
        // 处理本地费用数据
        freightOfferList.value.forEach((item) => {
          let localFeeData = [];
          item.feeList.forEach((fee) => {
            localFeeData.push({
              serialNo: localFeeData.length + 1,
              itemName: fee.itemName,
              unit: fee.unit,
              fee20gp: fee.containerSpec === "20GP" ? fee.amount : "--",
              fee40gp: fee.containerSpec === "40GP" ? fee.amount : "--",
              fee40hq: fee.containerSpec === "40HQ" ? fee.amount : "--",
              oneTicketAmount: fee.unit === "票" ? fee.amount : "--",
              currency: fee.currency,
            });
          });
          freightOfferList.value.localFeeData = localFeeData;
        });
        totalRecord.value = response.total;
      }
    })
    .catch((error) => {
      console.error("getOfferList error", error);
    });
};

const searchCarrier = (kw, callback) => {
  kw = kw === "null" || kw === null ? "" : kw;
  const params = {
    pageSize: 20,
    pageNo: 1,
    keyword: kw,
  };
  CarrierAPI.fetchList(params)
    .then((response) => {
      console.log("response", response);
      if (response) {
        callback(response.list);
      }
    })
    .catch((error) => {
      console.error("searchCarrier error", error);
    });
};

const handlePriceTypeClick = (type) => {
  if (queryOptions.value.orderField === type) {
    queryOptions.value.orderField = null; // 如果已经选中，则取消选中
  } else {
    queryOptions.value.orderField = type; // 否则选中
  }
  handlePageChange(1);
};

const handlePageChange = (newPage) => {
  queryOptions.value.pageNo = newPage;
  getOfferList();
};

const handleTransferTypeChange = (value) => {
  queryOptions.value.transferType = value ? "DIRECT" : null;
  handlePageChange(1);
};

// 监听props变化
watch(
  () => [props.startPort, props.destinationPort],
  ([newStartPort, newDestinationPort]) => {
    if (newStartPort) {
      queryOptions.value.startPort = Number(newStartPort);
    }
    if (newDestinationPort) {
      queryOptions.value.destinationPort = Number(newDestinationPort);
    }

    // 只有当两个端口都有值时才查询
    // if (newStartPort && newDestinationPort) {
    //   handlePageChange(1);
    // }
    handlePageChange(1);
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  getPortList();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* 从原 HTML 文件中提取的样式 */
.query-con {
  /* padding-top: 80px; 假设顶部导航高度 */
  /* position: relative; */
}

.app-main {
  min-height: calc(100vh - 300px); /* 根据底部高度调整 */
}

.freight-rate-list {
  /* padding: 20px; */
}

.search-tab .tab-wrap {
  display: flex;
}

.tab-item {
  padding: 10px 20px;
  cursor: pointer;
}

.tab-item.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.input-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-wrap-k {
  flex: 1;
}

.pol-input {
  /* margin-right: 16px; */
  padding: 5px;
  position: relative;
}

.input p {
  /* margin-bottom: 5px; */
  line-height: 18px;
  text-indent: 20px;
  padding: 5px;
}

/* .input-qiyun,
.input-mudi,
#haohuo-input-date {
  width: 100%;
  padding: 8px;
  border: none;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
} */
.haohuo-input-date {
  width: 100%;
  padding: 8px;
  border: none;
  height: auto;
}

.input-qiyun-close,
.input-mudi-close,
.input-date-close {
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.port-panel-tan {
  position: absolute;
  z-index: 10;
}

.port-panel {
  background: #fff;
  border: 1px solid #dcdfe6;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.port-item {
  cursor: pointer;
  padding: 5px;
}

.port-item:hover {
  background: #f5f7fa;
}

.search-btn {
  background: #409eff;
  color: #fff;
  /* padding: 10px 20px; */
  cursor: pointer;
  height: 100% !important;
}

.search-btn img {
  margin-right: 5px;
}

.list-item {
  border: 1px solid #ebeef5;
  margin-bottom: 10px;
  padding: 10px;
}

.ship-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ship-info,
.ship-wrap,
.price-wrap {
  display: flex;
  align-items: center;
}

.price-item {
  margin-right: 10px;
}

.btn-wrap {
  background: #409eff;
  color: #fff;
  padding: 5px 15px;
  cursor: pointer;
}

.line-content {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.straight {
  background: #67c23a;
  color: #fff;
  padding: 2px 5px;
}

/* 其他样式根据需要从原文件补充 */
:deep(.el-input .el-input__inner) {
  height: auto;
  position: relative;
}
:deep(.el-input .el-input__wrapper) {
  box-shadow: none;
  /* width: 100%; */
  padding: 0px;
}

:deep(.el-autocomplete .el-input__inner) {
  /* border: none; */
  box-shadow: none;
  width: 100%;
  font-size: 16px;
  /* padding: 0px; */
}

:deep(.el-autocomplete .el-input__wrapper) {
  /* border: none; */
  box-shadow: none;
  width: 100%;
  padding: 0px;
}

.my-autocomplete {
  /* border: none; */
  /* font-size: 14px !important; */
}

.my-autocomplete li {
  /* line-height: 24px !important; */
  .name {
    line-height: 25px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .addr {
    line-height: 20px;
    font-size: 12px;
    color: #b4b4b4;
  }

  .highlighted .addr {
    color: #ddd;
  }
}

.search-tool {
  display: flex;
  /* width: 1280px; */
  /* margin: 0 auto; */
  margin-top: 20px;
}
.search-tool .left-part-nr {
  display: flex;
  float: left;
}
.right-part {
  margin-top: 10px;
  float: right;
}
.copy-template {
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  font-size: 16px;
  color: #c5120e;
  cursor: pointer;
}
.price-order-item {
  cursor: pointer;
  margin-left: 16px;
  padding: 9px 12px;
  border-radius: 5px;
  border: 1px solid #dfe2e6;
  background: var(--grey-grey-1, #fff);
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
}
.price-order-item.active {
  color: #c5120e;
}

.page-container {
  /* float: right; */
  height: 100px;
}

/* 分页样式 */
/* :deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next),
:deep(.el-pagination.is-background .el-pager li) {
  background-color: #c5120e;
  color: #fff;
} */
:deep(.el-pagination.is-background .btn-prev:hover),
:deep(.el-pagination.is-background .btn-next:hover),
:deep(.el-pagination.is-background .el-pager li:hover) {
  background-color: #c5120e;
}
:deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #c5120e;
}

/** 本地费用弹窗样式 */
.commonPopper {
  width: 100%;
}
.commonPopper .fee-container {
  padding: 24px;
}
.commonPopper .title {
  color: #fff;
  padding: 12px 24px;
  border-radius: 2px 2px 0 0;
  background: #95a3c0;
  font-size: 16px;
}

.specialDesc-container {
  max-height: 420px;
  overflow-y: auto;
}
.leftPadding {
  padding-left: 10px;
}
</style>
