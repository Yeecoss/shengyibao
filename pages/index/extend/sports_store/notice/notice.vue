<template>
	<!-- 店铺公告 -->
	<view class="notice bgf" v-if="wxapp.notice!=''" @tap.stop="toNotice(wxapp.notice)">
		<view class="f-28 col-0 notice-con sixlist-hidden t-c m-b-10">
			{{wxapp.notice}}
		</view>
		<view class="theme4-more dis-flex flex-x-center flex-y-center">
			<text class="iconfont2 icon-MORE f-24"></text>
		</view>
	</view>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
			animation:false
		};
  },
  props: {
    wxapp: Object
  },
	beforeMount() {
		setTimeout(() => {
			this.animation = true
		}, 600)
	},
  methods: {
		toNotice(text){
			uni.navigateTo({
				url: '/pages/myGoods/shopNotice/detail?text='+text
			})
		}
	}
};
</script>
<style lang="scss">
	
	// 公告
	.notice{
		padding: 40rpx 30rpx;
	}
	.notice-con{
		line-height: 40rpx;
	}
	// more
	.theme4-more{
		width: 80rpx;
		height: 36rpx;
		margin: 0 auto;
		color: $theme4Red;
		border: 1rpx solid $theme4Red;
	}
	/* @import "./notice.css"; */
</style>