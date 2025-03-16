<!-- src/components/Banner.vue -->
<template>
  <div class="train_banner">
    <div class="search-wrap-con">
      <div class="search-wrap">
        <div class="tab-wrap">
          <ul>
            <li
              v-for="(tab, index) in tabs"
              :key="index"
              :class="{ cur: activeTab === index }"
              @click="switchTab(index)"
            >
              {{ tab }}
            </li>
          </ul>
        </div>

        <div class="input-wrap" :class="'input-wrap-' + (activeTab + 1)">
          <ul>
            <li>
              <div class="input-wrap-title">
                <img src="@/assets/images/s1-icon.png" class="t" />起运港
              </div>
              <div class="input-wrap-text-box">
                <el-autocomplete
                  v-model="offerQuery.startPortObj"
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
                    <div class="addr">{{ item.country }} {{ item.city }}</div>
                  </template>
                </el-autocomplete>
              </div>
              <div class="port-panel" v-show="showStartPanel">
                <div class="title">热门港口</div>
                <div class="port-wrap">
                  <div
                    class="port-item"
                    v-for="port in startPorts"
                    :key="port"
                    @click="selectPort('start', port)"
                  >
                    {{ port }}
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="input-wrap-title">
                <img src="@/assets/images/s2-icon.png" class="t" />目的港
              </div>
              <div class="input-wrap-text-box">
                <el-autocomplete
                  v-model="offerQuery.destinationPortObj"
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
                    <div class="addr">{{ item.country }} {{ item.city }}</div>
                  </template>
                </el-autocomplete>
              </div>
              <div class="port-panel" v-show="showEndPanel">
                <div class="title">热门港口</div>
                <div class="port-wrap">
                  <div
                    class="port-item"
                    v-for="port in endPorts"
                    :key="port"
                    @click="selectPort('end', port)"
                  >
                    {{ port }}
                  </div>
                </div>
              </div>
            </li>
            <li v-if="activeTab === 1">
              <div class="input-wrap-title">
                <img src="@/assets/images/s3-icon.png" class="t" />航空公司
              </div>
              <div class="input-wrap-text-box">
                <input
                  v-model="airline"
                  class="input-wrap-text"
                  type="text"
                  placeholder="请输入目航司"
                  @focus="showPanel('airline')"
                />
                <img
                  src="@/assets/images/close.png"
                  class="port-panel-close"
                  v-show="airline"
                  @click="clearInput('airline')"
                />
              </div>
              <div class="port-panel port-panel-hk" v-show="showAirlinePanel">
                <div class="title">选择航司</div>
                <div class="port-wrap">
                  <div
                    class="port-item"
                    v-for="line in airlines"
                    :key="line"
                    @click="selectPort('airline', line)"
                  >
                    {{ line }}
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="btn-wrap" @click="searchFreight">
            <img src="@/assets/images/ss_icon_3.png" class="ss" />运价查询
          </div>
        </div>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="(slide, index) in slides"
          :key="index"
          :class="{ active: currentSlide === index }"
        >
          <a href="#">
            <img :src="slide.image" :alt="slide.title" class="swiper-img" />
          </a>
        </div>
      </div>
      <ul class="banner_index clearfix">
        <div class="banner_index-frame">
          <li
            v-for="(slide, index) in slides"
            :key="index"
            :class="{ current: currentSlide === index }"
            @click="goToSlide(index)"
          ></li>
        </div>
      </ul>
      <!-- 
      <div class="swiper-button-prev" @click="prevSlide">
        <img src="@/assets/images/train-banner-left.png" />
      </div>
      <div class="swiper-button-next" @click="nextSlide">
        <img src="@/assets/images/train-banner-right.png" />
      </div>
       -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import banner1 from "@/assets/images/banner_01.jpg";
import banner2 from "@/assets/images/banner_02.jpg";
import PortAPI from "@/api/qms/port";
// import CarrierAPI from "@/api/qms/carrier";
const router = useRouter();
// 搜索框自动完成参数
const offerQuery = ref({
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
});
let portOptions = ref([]);
const tabs = ref(["海运整柜", "空运", "海运拼箱"]);
const activeTab = ref(0);
const startPort = ref("");
const endPort = ref("");
const airline = ref("");
const showStartPanel = ref(false);
const showEndPanel = ref(false);
const showAirlinePanel = ref(false);

const startPorts = ref([
  "SHEKOU(蛇口,中国)",
  "NANSHA(南沙,中国)",
  "SHENZHEN(深圳,中国)",
  "YANTIAN(盐田,中国)",
  "DA CHAN BAY(大铲湾,中国)",
  "HUANGPU(黄埔,中国)",
  "FOSHAN(佛山,中国)",
  "ZHONGSHAN(中山,中国)",
  "SHANTOU(汕头,中国)",
  "GUANGZHOU(广州,中国)",
  "SHANGHAI(上海,中国)",
  "NINGBO(宁波,中国)",
  "QINGDAO(青岛,中国)",
  "XIAMEN(厦门,中国)",
]);
const endPorts = ref([
  "JEBEL ALI(杰贝阿里,阿联酋)",
  "DUBAI(迪拜,阿联酋)",
  "KARACHI(卡拉奇,巴基斯坦)",
  "NHAVA SHEVA(那瓦沙瓦,印度)",
  "INCHON(INCHEON)(仁川,韩国)",
  "BUSAN(釜山,韩国)",
  "JAKARTA(雅加达,印度尼西亚)",
  "BANGKOK(曼谷,泰国)",
  "OSAKA(大阪,日本)",
  "LAEM CHABANG(林查班,泰国)",
  "SINGAPORE(新加坡,新加坡)",
  "HAIPHONG(海防,越南)",
  "JEDDAH(吉达,沙特阿拉伯)",
]);
const airlines = ref([
  "AA",
  "B0",
  "BV",
  "DL",
  "CM*",
  "PQ",
  "M9",
  "MV",
  "VK",
  "AC",
  "UA",
  "IF*",
  "HO",
  "9R*",
  "LH*",
  "V3",
  "TE",
  "FX",
  "I8",
  "5K",
  "AS",
  "3A*",
  "YB",
  "VY",
  "PW",
  "KP",
  "LO*",
  "U8",
  "4C",
  "ZF",
  "TQ",
  "EX",
  "QC",
  "JQ",
  "X4",
  "KA",
  "AR",
  "LA",
  "P9*",
  "TP",
  "CY",
  "3L",
  "OA",
  "4U",
  "EI",
  "2D",
  "AZ",
  "2H*",
  "AF",
]);

const switchTab = (index) => {
  activeTab.value = index;
};

const showPanel = (type) => {
  showStartPanel.value = type === "start";
  showEndPanel.value = type === "end";
  showAirlinePanel.value = type === "airline";
};

const selectPort = (type, value) => {
  if (type === "start") {
    startPort.value = value;
    showStartPanel.value = false;
  } else if (type === "end") {
    endPort.value = value;
    showEndPanel.value = false;
  } else if (type === "airline") {
    airline.value = value;
    showAirlinePanel.value = false;
  }
};

const clearInput = (type) => {
  if (type === "start") startPort.value = "";
  else if (type === "end") endPort.value = "";
  else if (type === "airline") airline.value = "";
};

const searchFreight = () => {
  if (offerQuery.value.startPortObj && offerQuery.value.destinationPort) {
    router.push({
      path: "/freightRateList",
      query: {
        startPort: offerQuery.value.startPort,
        destinationPort: offerQuery.value.destinationPort,
      },
    });
  }
};

// 轮播图相关
const slides = ref([
  { image: banner1, title: "Banner 1" },
  { image: banner2, title: "Banner 2" },
]);
const currentSlide = ref(0);
let slideInterval = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

// const prevSlide = () => {
//   currentSlide.value =
//     (currentSlide.value - 1 + slides.value.length) % slides.value.length;
// };

const goToSlide = (index) => {
  currentSlide.value = index;
};

const startAutoPlay = () => {
  slideInterval = setInterval(nextSlide, 5000);
};

/**
 * 搜索港口
 * @param kw
 * @param callback
 */
const searchPort = async (kw = "", callback) => {
  // console.log("searchPort kw=", kw);
  kw = kw === "null" || kw === null ? "" : kw;
  // console.log("searchPort kw=", kw);
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
      list = response.data.list.map((item) => ({
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
      portOptions = response.data.list.map((item) => ({
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
  offerQuery.value.startPort = item.id;
};
/**
 * 清除起运港
 */
const handleClearStartPort = () => {
  console.log("handleClearStartPort");
  offerQuery.value.startPort = null;
};

const handleSelectDestinationPort = (item) => {
  if (!item) return;
  console.log("handleSelectStartPort item=", item);
  offerQuery.value.destinationPort = item.id;
};
/**
 * 清除起运港
 */
const handleClearDestinationPort = () => {
  console.log("handleClearDestinationPort");
  offerQuery.value.destinationPort = null;
};

// 解决el-input无法输入和清除
// eslint-disable-next-line no-unused-vars
const handleChangeAutoComplete = (e) => {
  console.log("handleChangeAutoComplete", e);
  // this.$forceUpdate();
  const instance = getCurrentInstance();
  if (instance) instance.proxy.$forceUpdate();
};

onMounted(() => {
  startAutoPlay();
  getPortList();
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<style scoped>
.swiper-container {
  position: relative;
  width: 100%;
  height: 534px;
  overflow: hidden;
}

.swiper-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.swiper-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.swiper-slide.active {
  opacity: 1;
}

.swiper-img {
  width: 100%;
  height: 534px;
  object-fit: cover;
}

.swiper-button-prev,
.swiper-button-next {
  position: absolute;
  top: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transform: translateY(-50%);
}

.swiper-button-prev {
  left: 10px;
}

.swiper-button-next {
  right: 10px;
}
.train_banner {
  position: relative;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.port-panel {
  position: absolute;
  z-index: 10;
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

/* 确保 el-autocomplete 与原 el-input 样式一致 */
/* .input-wrap-text {
  width: 100%;
} */

/* 自定义 el-autocomplete 的输入框样式，使其与 el-input 一致 */
:deep(.el-autocomplete .el-input__inner) {
  height: 40px;
  width: 100%;
  line-height: 40px;
  padding: 0px;
  border: none;
  box-sizing: border-box;
  border-radius: 5px;
  line-height: 50px;
  text-indent: 15px;
  font-size: 16px;
}

/* 自定义清除按钮样式 */
.port-panel-close {
  cursor: pointer;
  /* width: 16px;
  height: 16px;
  margin-right: 10px; */
}

/* 自定义 el-autocomplete 的下拉框样式 */

.my-autocomplete {
  border: none;
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
</style>
