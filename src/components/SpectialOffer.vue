<!-- src/components/HomeContent.vue -->
<template>
  <div class="home-content">
    <div class="sell-wrap">
      <h1><img src="@/assets/images/th-icon.png" class="th" />特惠运价</h1>
      <div class="sell-wrap-top">
        <div class="tab-wrap">
          <div
            class="tab-item"
            v-for="(tab, index) in discountTabs"
            :key="index"
            :class="{ active: activeDiscountTab === index }"
            :data-index="index + 1"
            @click="handleClickTab(index)"
          >
            {{ tab.name }}
          </div>
        </div>
        <span class="view-all">更多航线</span>
      </div>

      <div
        class="sell-list-wrap"
        v-for="(list, index) in discountLists"
        :key="index"
        :class="'sell-list-wrap-' + (index + 1)"
        v-show="activeDiscountTab === index"
      >
        <div class="sell-item" v-for="item in list" :key="item.id">
          <div class="flex-end">
            <img src="@/assets/images/th2-icon.png" />
            <p>
              特价有效期至 <span>{{ formatDateText(item.validEndDate) }}</span>
            </p>
          </div>
          <div class="voyage">
            <div class="pol">{{ formatPortText(item.startPortObj) }}</div>
            <div class="d">···</div>
            <div class="info">
              <div class="flex">
                <div class="type">
                  {{ formatTransferTypeText(item.transferType) }}
                </div>
                {{ formatVoyageDaysText(item.voyageDays) }}
              </div>
            </div>
            <div class="d">···</div>
            <div class="pod">{{ formatPortText(item.destinationPortObj) }}</div>
          </div>
          <div class="base-info">
            <img src="@/assets/images/sj-icon.png" class="sj" /> 截关时间：
            {{ formatDateText(item.cutoffDate) }}
          </div>
          <div class="price-wrap">
            <div class="price-item"><p>20GP</p></div>
            <div class="price-item"><p>40GP</p></div>
            <div class="price-item"><p>40HQ</p></div>
          </div>
          <div class="price-wrap">
            <div class="price-item">
              <p
                :class="{
                  s: formatPriceText(item.fee20gp) !== '--',
                  h: formatPriceText(item.fee20gp) === '--',
                }"
              >
                {{ formatPriceText(item.fee20gp) }}
              </p>
            </div>
            <div class="price-item">
              <p
                :class="{
                  s: formatPriceText(item.fee40gp) !== '--',
                  h: formatPriceText(item.fee40gp) === '--',
                }"
              >
                {{ formatPriceText(item.fee40gp) }}
              </p>
            </div>
            <div class="price-item">
              <p
                :class="{
                  s: formatPriceText(item.fee40hq) !== '--',
                  h: formatPriceText(item.fee40hq) === '--',
                }"
              >
                {{ formatPriceText(item.fee40hq) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="news-wrap">
      <div class="title-wrap">
        <span class="flex-ac"
          ><img src="@/assets/images/info-icon.png" /> 行业资讯</span
        >
      </div>
      <div class="zx-more">更多新闻</div>
      <div class="news-item" v-for="(item, index) in newsList" :key="index">
        <div class="index">{{ String(index + 1).padStart(2, "0") }}</div>
        <div class="title">
          <p>{{ item.title }}</p>
          <span>{{ item.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import OfferAPI from "@/api/qms/offer";
import { formatDate } from "@/utils/date";

const discountTabs = ref([
  { name: "全部", route: "", country: "", list: [] },
  { name: "欧洲线", route: "IE", country: "", list: [] },
  { name: "泰国线", route: "", country: "TH", list: [] },
  { name: "菲律宾线", route: "", country: "PH", list: [] },
  { name: "印尼线", route: "", country: "ID", list: [] },
]);
const activeDiscountTab = ref(0);
const discountLists = ref([]);

const newsList = ref([
  {
    title:
      "44个集装箱落水，30个箱子损坏！挂靠国内多个港口的达飞集装箱船遭遇突发事故！",
    date: "2025-01-08 11:50:09",
  },
  {
    title: "突发：2月曾挂靠国内港口！MSC一货船被伊朗扣押！",
    date: "2025-01-08 11:50:09",
  },
  {
    title: "多项服务受影响！马士基船舶与大桥相撞后，暂停巴尔的摩港停靠",
    date: "2025-01-08 11:50:09",
  },
  {
    title:
      "曾挂靠国内港口！一集装箱船在巴尔的摩与桥柱相撞，大桥坍塌，多人落水！",
    date: "2025-01-08 11:50:09",
  },
  { title: "MOL将开发连接葡萄牙和北欧的绿色走廊", date: "2025-01-08 11:50:09" },
  { title: "笛卡尔报告：目前美国集装箱进口强劲", date: "2025-01-08 11:50:09" },
]);

const handleClickTab = (index) => {
  activeDiscountTab.value = index;
  const tab = discountTabs.value[index];
  getHotOfferList(tab.route, tab.country, (list) => {
    discountLists.value[index] = list;
  });
};

const getHotOfferList = async (route = "", country = "", callback) => {
  const params = {
    pageSize: 4,
    pageNo: 1,
    routesCode: route,
    countryCode: country,
  };
  OfferAPI.specialList(params)
    .then((response) => {
      console.log("response", response);
      if (response) {
        callback(response.list);
      }
    })
    .catch((error) => {
      console.error("getHotOfferList error", error);
    });
};

const formatPortText = (port) => {
  if (port) {
    return `${port.cityEnName}(${port.portCode})`;
  }
  return "";
};

const formatTransferTypeText = (transferType) => {
  if (transferType && transferType === "TRANSIT") {
    return "中转";
  }
  return "直达";
};

const formatVoyageDaysText = (voyageDays) => {
  if (voyageDays) {
    return voyageDays + "D";
  }
  return "";
};

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

onMounted(() => {
  // getHotOfferList("", "", (list) => {
  //   console.log("list", list);
  //   // hotOfferList.value = list;
  //   discountLists.value[0] = list;
  // });
  handleClickTab(0);
});
</script>
