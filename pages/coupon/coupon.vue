<template>
	<view class="container min_h_100" :class="homeStyle!='sportshop'?'bgf5':''">
		<!-- 自定义标题栏 -->
		<navigationBar title="领券中心" extClass="nav" id="top"></navigationBar>
		<template v-if="list.length">
			<coupon-templete1 :homeStyle="homeStyle" :list="list" @receive="receive"></coupon-templete1>
		</template>
		<!-- 无数据 -->
		<tui-no-data v-else-if="notcont" imgUrl="https://pic.kaidanxia.com/2020-08-21/20200821154706b82751596.png" :imgWidth="264"
		 :imgHeight="264">
			<view class="col-9">亲，暂无优惠券哦</view>
		</tui-no-data>
	</view>
</template>

<script>
	const app = getApp().globalData;
	// import defaultCoupon from './_templete/index/index.vue';
	import couponTemplete1 from './_templete/templete1/index.vue';

	export default {
		data() {
			return {
				// 优惠券列表
				list: [],
				notcont: false,
				homeStyle: 'div',
			};
		},

		components: {
			// defaultCoupon,
			couponTemplete1
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			// 当前页面参数
			this.options = options;
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			this.homeStyle = app.homeStyle?app.homeStyle:'div';
			// 获取优惠券列表
			this.getCouponList();
		},
		methods: {
			// 获取优惠券列表
			getCouponList() {
				let _this = this;

				app._get('coupon/lists', {}, res => {
					_this.setData({
						list: res.data.list||[],
						notcont: !res.data.list.length
					});
				});
			},
			// 立即领取
			receive(couponId) {
				let _this = this;

				app._post_form('user.coupon/receive', {
					coupon_id: couponId
				}, res => {
					this.$api.msg(res.msg)
					
					// 获取优惠券列表
					_this.getCouponList();
				});
			}
		}
	};
</script>
<style>
	/* @import "./coupon.css"; */
</style>
