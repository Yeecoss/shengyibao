<template>
<view class="listBox" :class="!nomore ? 'listBox1' : ''">
  <!-- 销售榜 -->
  <view class="listTitle listItem dis-flex flex-y-center">
    <view class="orderNum">排名</view>
    <view class="img">
      商品图片
    </view>
    <view class="name">
      <view class="nameText">
        名称
      </view>
    </view>
    <view class="num">
      销售量
    </view>
  </view>
  <div v-if="goodsRanking.length > 0">
    <view class="listItem dis-flex flex-y-center" v-for="(item, index) in goodsRanking" :key="index">
      <view class="orderNum">{{index + 1}}</view>
      <view class="imgBox" @tap.stop="onTargetGoods(item.wxapp_goods_id)">
        <image mode="aspectFill" :src="item.goods_image"></image>
      </view>
      <view class="name">
        <view class="twolist-hidden nameText">
          {{item.goods_name}}
        </view>
      </view>
      <view class="num">{{item.total_sales_num}}</view>
    </view>
    <view v-if="!nomore" class="more" @tap.stop="toSalesList">
      查看更多<text class="iconfont2 icon-more1 f-24"></text>
    </view>
  </div>
  <!-- 无数据 -->
  <div v-else class="no_data">
    <tui-no-data imgUrl="/static/images/no_content.png" :fixed="false" :imgWidth="300" :imgHeight="260">
      <view>暂无数据</view>
    </tui-no-data>
  </div>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
    };
  },

  components: {
  },
  props: {
    goodsRanking: {
      type: Array,
      default: () => []
    },
    nomore: {
      type: Boolean,
      default: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  methods: {
    /**
     * 跳转商品详情页
     */
    onTargetGoods(goods_id) {
      uni.navigateTo({
        url: '/pages/goods/index?goods_id=' + goods_id
      });
    },
    // 消量榜
    toSalesList() {
      uni.navigateTo({
          url: '/pages/retailShop/shopAbout/dataSummary/salesList/index'
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../list.scss";
@import "./index.scss";
</style>