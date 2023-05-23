<template>
<view class="listBox" :class="!nomore ? 'listBox1' : ''">
  <!-- 销费榜 -->
  <view class="listTitle dis-flex flex-y-center">
    <view class="orderNum">排名</view>
    <view class="imgBox oneList-hide">
      头像
    </view>
    <view class="name">
      昵称
    </view>
    <view class="orderNum1">
      订单数
    </view>
    <view class="money">
      实际消费
    </view>
  </view>
  <div v-if="userExpendRanking.length > 0">
    <view class="listItem dis-flex flex-y-center" v-for="(item, index) in userExpendRanking" :key="index" :class="index < 3 ? 'listItem' + (index+1) : ''">
      <view class="orderNum">{{index + 1}}</view>
      <view class="imgBox" @tap.stop="toDetail(item.user_id)">
        <image v-if="index < 3" class="rankImg" :src="'/static/images/ranking/rank' + (index + 1) + '.png'" alt=""></image>
        <image class="userImg" :src="item.avatarUrl" alt=""></image>
      </view>
      <view class="name">
        <view class="twolist-hidden nameText">
          {{item.nickName || ''}}
        </view>
      </view>
      <view class="orderNum1 twolist-hidden">{{item.order_num || '0'}}</view>
      <view class="num twolist-hidden">￥{{item.order_money || ''}}</view>
    </view>
    <view v-if="!nomore" class="more" @tap.stop="toSalesFeeList">
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
    userExpendRanking: {
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
    // 浏览轨迹详情
    toDetail(userId) {
      uni.navigateTo({
          url: '/pages/retailShop/shopAbout/trajectory/detail/index?userId=' + userId
      });
    },
    // 消费榜
    toSalesFeeList() {
      uni.navigateTo({
          url: '/pages/retailShop/shopAbout/dataSummary/salesFeeList/index'
      });
    },
  }
};
</script>
<style lang="scss" scoped>
@import "../list.scss";
@import "./index.scss";
</style>