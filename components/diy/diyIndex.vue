<template>
	<view>
		<view class="banner" v-if="diyItems.banner">
			<diy-banner :itemStyle="diyItems.banner.style" :params="diyItems.banner.params"
				:dataList="diyItems.banner.data"></diy-banner>
		</view>

		<view class="coupon" v-if="diyItems.coupon && diyItems.coupon.data && diyItems.coupon.data.length > 0">
			<diy-coupon :itemStyle="diyItems.coupon.style" :dataList="diyItems.coupon.data"></diy-coupon>
		</view>
		<view class="check">
			<diy-check :wxapp="wxapp" :cartList="cartList" :coupon_id="coupon_id"></diy-check>
		</view>
		<view v-if="diyItems.hot">
			<diy-sharpGoods :itemStyle="diyItems.hot.style" :dataList="diyItems.hot.data" :params="diyItems.hot.params">
			</diy-sharpGoods>
		</view>
		<view v-if="diyItems.recommend" class="recommend">
			<view class="titleBox dis-flex flex-y-end flex-x-between">
				<view class="title">
					<view class="titleBg"></view>
					<text>为你推荐</text>
				</view>
				<view @tap="toOther('recommend')" class="sharp-more">
					<text class="sharp-more-text">更多</text>
					<text class="sharp-more-arrow iconfont icon-xiangyoujiantou f-w"
						style="font-size: 20rpx;"></text>
				</view>
			</view>
			<diy-goods :list="diyItems.recommend.data"></diy-goods>
		</view>
		<view class="evaluate">
			<view class="titleBox dis-flex flex-y-end flex-x-between">
				<view class="title">
					<view class="titleBg"></view>
					<text>评价</text>
				</view>
				<view @tap="toOther('evaluate')" class="sharp-more">
					<text class="sharp-more-text">全部评价</text>
					<text class="sharp-more-arrow iconfont icon-xiangyoujiantou f-w"
						style="font-size: 20rpx;"></text>
				</view>
			</view>
			<diy-evaluate :heardHeight="heardHeight" :scrollTop="scrollTop" :comments="comments"></diy-evaluate>
		</view>
	</view>
</template>

<script>
	import diyBanner from "./banner/banner";
	import diyCoupon from "./couponFood/coupon";
	import diyCheck from "./check/index";
	import diySharpGoods from "./sharpGoods/index";
	import diyGoods from "./goods/index";
	import diyEvaluate from "./evaluate/index";

	export default {
		data() {
			return {};
		},
		props: {
			heardHeight: {
				type: Number,
				default: 0
			},
			scrollTop: {
				type: Number,
				default: 0
			},
			diyItems: {
				type: Object,
				default: () => {
					return {}
				}
			},
			wxapp: {
				type: Object,
				default: () => {
					return {}
				}
			},
			comments: {
				type: Array,
				default: () => {
					return []
				}
			},
			cartList: {
				type: Array,
				default: () => {
					return []
				}
			},
			coupon_id: {
				type: [Number, String],
				default: 0
			},
		},
		components: {
			diyBanner,
			diyCoupon,
			diyCheck,
			diySharpGoods,
			diyGoods,
			diyEvaluate
		},
		options: {},
		methods: {
			toOther(type) {
				if (type == 'recommend') {
					uni.navigateTo({
						url: `/pages/category/extend/list?sortType=recommend`
					});
				}
				if (type == 'evaluate') {
					uni.navigateTo({
						url: `/pages/myGoods/goodsList/allComment/comment`
					});
				}
			}
		}
	};
</script>
<style lang="scss">
	.navBar {
		background: linear-gradient(to bottom, #fff, #f8f8f8);
	}

	.banner {
		padding: 32rpx;
		background: #fff;
	}

	.coupon {
		padding-bottom: 32rpx;
		background: #fff;
	}

	.check {
		margin-top: 32rpx;
		background: #fff;
		padding: 32rpx;
	}

	.recommend {
		background: #fff;
		padding: 32rpx;
	}
	.evaluate{
		background: #fff;
		margin-top: 32rpx;
		padding: 32rpx;
	}
	
	.titleBox{
		.title{
			height: 44rpx;
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
			position: relative;
			.titleBg{
				width: 100%;
				height: 24rpx;
				background: linear-gradient(270deg, #FFFFFF 0%, #FFC7B2 100%);
				border-radius: 12rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				z-index: 1;
			}
			text{
				position: relative;
				z-index: 2;
			}
		}
		.sharp-more{
			color: #999999;
			font-size: 26rpx;
		}
	}
</style>
