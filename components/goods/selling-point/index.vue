<template>
	<view v-if="selling_point.length">
		<view class="goods-comment">
		  <view v-if="selling_point.length" class="cont-box b-f goods-property-box dis-flex flex-y-center flex-x-between" @tap.stop="openPoint">
		    <text class="col-0 f-30 m-r-40">商品卖点</text>
				<view class="flex-box onelist-hidden f-26 col-3">{{selling_point}}</view>
        <text class="iconfont icon-xiangyoujiantou f-26 theme4_gray m-l-20 f-w"></text>
		  </view>
		  
			<view v-else class="cont-box b-f goods-property-box dis-flex flex-x-between">
				<text class="col-0 f-30">商品卖点</text>
				<text class="theme4_gray f-24">暂无卖点</text>
			</view>
		</view>
		<view class="gray-bg20"></view>
		
		<!-- 卖点弹窗 -->
		<popup :show="isShow" type="bottom" @clickmask="openPoint">
			<view class="popup-main" v-if="isShow" catchtouchmove='true'>
				<view class="pop-close" @tap="openPoint"><text class="iconfont2 icon-shanchu1 f-34 col-3"></text></view>
		    <!-- 主体信息 -->
		    <view class="trade-main pad_lr30">
					<view class="title f-32 col-3 m-b-20">商品卖点</view>
					<view class="content col-6 f-26" @tap.stop="clipboard(selling_point)">{{selling_point}}</view>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	import popup from "@/components/pop-manager/index";
	export default {
		components: {
			popup
		},
		data() {
			return {
				isShow: false
			};
		},
		props: {
		  selling_point: {
		    type: String,
		    default: ''
		  },
		},
		methods: {
			openPoint(){
				this.isShow = !this.isShow
			},
			// 复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						// this.$api.msg("复制失败")
					}
					// #endif
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.popup-main {
		position: relative;
		width: 750rpx;
	  z-index: 11;
	}
	.trade-main {
	  background: #fff;
	  box-sizing: border-box;
	  padding: 36rpx 30rpx 80rpx;
		max-height: 1000rpx;
		min-height: 400rpx;
	  border-radius: 16rpx 16rpx 0 0;
		overflow-y: auto;
	}
	.pop-close {
		position: absolute;
		right: 20rpx;
		top: 10rpx;
		color: #999;
	}
	// 内容
	.content{
		line-height: 48rpx;
	}
	.title{
		text-align: center;
		line-height: 1.1;
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #eee;
	}
</style>
