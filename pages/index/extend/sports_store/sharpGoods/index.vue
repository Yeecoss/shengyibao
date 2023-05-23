<template>
<!-- 商品组 -->
<view v-if="itemData && itemData.goodsList && itemData.goodsList.data && itemData.goodsList.data.length" class="diy-sharpGoods radius16" :style="'background: ' + itemStyle.background + ';'" @tap="onTargetSharpIndexFun($event, params.source)">
  <view class="sharp-top dis-flex flex-y-center m-b-20">
    <view class="sharp-top--left flex-box dis-flex flex-y-center">
      <view class="sharp-title-img1 col-f"><text class="iconfont2 icon-seckill1 f-36"></text></view>
      <!-- <view class="sharp-modular dis-flex flex-y-center">
        <text class="iconfont icon-miaosha-b"></text>
        <text class="modular-name">限时秒杀</text>
      </view> -->
      <!-- <view class="sharp-active-status">
        <text>{{ data.active.sharp_modular_text }}</text>
      </view> -->
      <!-- 倒计时 -->
      <view v-if="itemData && itemData.active && itemData.active.status == ActiveStatusEnum.STATE_BEGIN.value" class="active-count-down">
        <view class="clock dis-flex col-f">
          <view class="clock-time">
            <text>{{ countDownList[0] ? countDownList[0].dynamic.hou : '' }}</text>
          </view>
          <view class="clock-symbol">
            <text>:</text>
          </view>
          <view class="clock-time">
            <text>{{ countDownList[0] ? countDownList[0].dynamic.min : '' }}</text>
          </view>
          <view class="clock-symbol">
            <text>:</text>
          </view>
          <view class="clock-time">
            <text>{{ countDownList[0] ? countDownList[0].dynamic.sec : '' }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- <view class="sharp-top--right">
      <view @tap="onTargetSharpIndexFun($event, params.source)" class="sharp-more">
        <text class="sharp-more-text">更多</text>
        <text class="sharp-more-arrow iconfont icon-xiangyoujiantou f-w"></text>
      </view>
    </view> -->
  </view>

  <view :class="'goods-list display__list clear column__' + itemStyle.column">
    <template v-for="(dataItem, index) in list">
      <view class="goods-item" :key="index" v-if="index<3">
        <form report-submit="true"><!-- @submit="onTargetGoodsFun($event,dataItem)" -->
          <button formType="submit" class="btn-normal">
            <view class="goods-item--container">
              <!-- 单列商品 -->
              <block v-if="itemStyle.column == 1">
              </block>
              <!-- 两列三列 -->
              <block v-else>
                <!-- 商品图片 -->
                <view class="goods-image">
                  <image lazy-load class="image" mode="aspectFill" :src="dataItem.goods_image"></image>
                </view>
                <!-- <view class="detail">
                  商品标题
                  <view v-if="itemStyle.show.goodsName" class="goods-name onelist-hidden">{{ dataItem.goods_name }}</view>
                  商品价格
                  <view class="detail-price onelist-hidden" v-if="params.source=='hot'">
                    <text class="goods-price f-24 col-m"><text class="f-16">￥</text>{{ dataItem.goods_price }}</text>
                    <text class="line-price col-9 f-20" v-if="dataItem.line_price>0"><text  class="f-12">￥</text>{{ dataItem.line_price }}</text>
                  </view>
                  <view class="detail-price onelist-hidden" v-else-if="params.source=='recommend'">
                    <text class="goods-price f-24 col-m"><text class="f-16">￥</text>{{ dataItem.goods_price }}</text>
                    <text class="line-price col-9 f-20" v-if="dataItem.line_price>0"><text  class="f-12">￥</text>{{ dataItem.line_price }}</text>
                  </view>
                  <view class="detail-price onelist-hidden" v-else>
                    <text v-if="itemStyle.show.seckillPrice" class="goods-price f-24 col-m"><text class="f-16">￥</text>{{ dataItem.goods_sku.seckill_price }}</text>
                    <text v-if="itemStyle.show.originalPrice && dataItem.goods_sku.original_price > 0" class="line-price col-9 f-20"><text class="f-12">￥</text>{{ dataItem.goods_sku.original_price }}</text>
                  </view>
                </view> -->
              </block>
            </view>
          </button>
        </form>
      </view>
    </template>
  </view>


</view>
</template>

<script>
const App = getApp().globalData; // 工具类
// 工具类
import util from "@/utils/util"; // 倒计时插件
// 倒计时插件
import CountDown from "@/utils/countdown"; // 枚举类：秒杀活动商品状态
// 枚举类：秒杀活动商品状态
import ActiveStatusEnum from "@/utils/enum/sharp/GoodsStatus";

export default {
  data() {
    return {
      list: [],
      goodsList: {},
      ActiveStatusEnum,
      // 秒杀活动商品状态
      countDownList: [] // 倒计时

    };
  },

  components: {},
  props: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    itemData: {
      type: Object,
      // observer: '_initCountDownData'
    },
  },
  options: {
    addGlobalClass: true,
  },

  /**
   * 在组件实例进入页面节点树时执行
   */
  beforeMount() {
    this.initCountDownDataFun();
    this.getList()
  },

  methods: {
	unit() {
		this.initCountDownDataFun();
		this.getList()
	},
    getList() {
      this.list = this.itemData.goodsList.data||[];
    },
    /**
     * 跳转商品详情页
     */
    onTargetGoodsFun(e, dataItem) {
      // 记录formid
      App.saveFormId(e.detail.formId); // 生成query参数
      let _this = this;
      let source = _this.params.source;
      let wxapp_goods_id = dataItem.sharp_goods_id? dataItem.sharp_goods_id: dataItem.wxapp_goods_id
      if (source == 'hot') {
        uni.navigateTo({
          url: '/pages/goods/index?goods_id=' + wxapp_goods_id
        });
      } else if (source == 'recommend') {
        uni.navigateTo({
          url: '/pages/goods/index?goods_id=' + wxapp_goods_id
        });
      } else {
        let query = util.urlEncode({
          active_time_id: _this.itemData.active.active_time_id,
          sharp_goods_id: wxapp_goods_id
        }); // 跳转到秒杀商品详情页

        uni.navigateTo({
          url: `/pages/sharp/goods/index?${query}`
        });
      }
    },

    /**
     * 更多秒杀
     */
    onTargetSharpIndexFun(e, source) {
      // 记录formid
      App.saveFormId(e.detail.formId);

      if (source == 'hot' || source == 'recommend') {
        uni.navigateTo({
          url: `/pages/category/extend/list?sortType=` + source
        });
      } else {
        // 跳转到秒杀会场首页
        uni.navigateTo({
          url: `/pages/sharp/index/index`
        });
      }
    },

    /**
     * 初始化倒计时组件
     */
    initCountDownDataFun(data) {
      let _this = this;
      if (!_this.params.source) {
        let active = _this.itemData.active;
        if (!active) return false; // 记录倒计时的时间
        if (this.countDownList.length == 0) {
          this.countDownList.push({
              date: active.count_down_time
          })
        } else {
          this.countDownList[0].date = active.count_down_time
        }
        // 执行倒计时
        CountDown.onSetTimeList(_this, 'countDownList');
      }
    }

  }
};
</script>
<style>
@import "./index.css";
</style>