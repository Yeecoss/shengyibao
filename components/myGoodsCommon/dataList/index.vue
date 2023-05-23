<template>
<view class="dataList dis-flex flex-x-betten">
  <!-- 数据概况 -->
  <view class="dataItem" v-for="(item, index) in dataList" :key="index" :style="index % 3 == 2 ? 'margin-right: 0': ''">
    <view class="num">
      <text class="numText">
        <text class="numIcon" :style="{background: item.color}"></text>
        {{survey[item.filedName] || 0}}
      </text>
    </view>
    <view class="title">{{item.name}}</view>
  </view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
      dataList: [{
        color: '#F30102',
        filedName: 'order_total',
        name: '付款订单数'
      }, {
        color: '#FF8E00',
        filedName: 'order_total_money',
        name: '付款订单总额'
      }, {
        color: '#7FD224',
        filedName: 'consume_users',
        name: '下单用户数'
      }, {
        color: '#7FD224',
        filedName: 'goods_total',
        name: '商品数量'
      }, {
        color: '#77EFB7',
        filedName: 'user_total',
        name: '用户数量'
      }, {
        color: '#7B11D8',
        filedName: 'uv',
        name: '访客总数'
      }, {
        color: '#FF8E00',
        filedName: 'comment_num',
        name: '评论总数'
      }]
    };
  },

  components: {
  },
  props: {
    survey: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  methods: {
  }
};
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>