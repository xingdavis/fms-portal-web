<template>
  <el-popover popper-style="width:480px">
    <template #reference>
      <div class="price-content">
        <div
          class="price-item"
          :class="{
            'price-click': formatPriceText(price) !== '--',
          }"
        >
          <div class="price-type">{{ type }}</div>
          <span
            class="flex_ac"
            :class="{
              'price-heng': formatPriceText(price) === '--',
            }"
          >
            {{ formatPriceText(price) }}
          </span>
        </div>
      </div>
    </template>
    <template #default>
      <div class="commonPopper">
        <div class="title">{{ type }}-预估价格(单箱)</div>
        <div class="fee-container">
          <div class="content-top">
            <div>
              <div class="total mb_12">
                预估总费用：
                <span class="mr_4"
                  >USD <span class="fee">{{ price }}</span></span
                >
              </div>
              <div>
                <div class="fee-item flex_bc mb_4">
                  海运费 (箱型)
                  <span> USD {{ price }} </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup>
import { defineProps } from "vue";
import { formatPriceText } from "@/utils/format";

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  type: String,
  price: [String, Number],
});
</script>

<style scoped>
.price-content {
  display: flex;
  align-items: center;
}

.price-item {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.price-click {
  background-color: #f5f7fa;
}

.price-click:hover {
  background-color: #e4e7ed;
}

.price-type {
  font-size: 14px;
  color: #606266;
}

.flex_ac {
  display: flex;
  align-items: center;
}

.price-heng {
  color: #909399;
  text-decoration: line-through;
}

.commonPopper {
  padding: 16px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}

.fee-container {
  font-size: 14px;
}

.total {
  font-weight: 500;
}

.mb_12 {
  margin-bottom: 12px;
}

.mr_4 {
  margin-right: 4px;
}

.fee {
  font-weight: 600;
  color: #409eff;
}

.fee-item {
  padding: 4px 0;
}

.flex_bc {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb_4 {
  margin-bottom: 4px;
}
</style>
