<template>
<view>
  <view class="pad_lr30 p-b-20">
    <view class="top-nav b-f" v-if="isTitle">
      <view class="top-nav-bar col-0 f-30">商品描述</view>
    </view>
    <view class="order" :hidden="hiddenOrder">
      <view v-if="article_content!=''">
        <view class="b-f goods-detail-box oh">
          <!-- <view class="goods-cont-li"> -->
          <jyf-parser :html="article_content"></jyf-parser>
          <!-- </view> -->
        </view>
      </view>
      <view v-else>
        <view class="yoshop-notcont" style="position:relative;top:0;margin-top:0;">
          <text class="iconfont icon-wushuju"></text>
          <text class="cont">亲,此处暂无详情数据</text>
        </view>
      </view>
    </view>
  </view>
</view>
</template>

<script>

export default {
	name: 'detail-swiper', 
	data() {
		return {
		}
	},
	props: {
		//是否显示标题
		isTitle: {
      type: Boolean,
      default: true
		},
    article_content: {
      type: String,
      default: ''
    },
    hiddenOrder: {
      type: Boolean,
      default: false
    }
	},
	methods:{
  }
}
</script>
<style lang="scss" scoped>
@import "./index.scss";
</style>