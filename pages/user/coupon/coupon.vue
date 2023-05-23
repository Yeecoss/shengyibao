<template>
	<view class="container bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="我的优惠券" extClass="nav" id="top"></navigationBar>
		<!-- 顶部选项卡 -->
		<view class="swiper-tab box-align-center dis-flex flex-y-center flex-x-between">
			<view :class="'swiper-tab-item ' + ( dataType === 'not_use' ? 'on' : '')" data-current="not_use"
				@tap="swichNav"><text>未使用</text></view>
			<view :class="'swiper-tab-item ' + ( dataType === 'is_use' ? 'on' : '')" data-current="is_use"
				@tap="swichNav"><text>已使用</text></view>
			<view :class="'swiper-tab-item ' + ( dataType === 'is_expire' ? 'on' : '')" data-current="is_expire"
				@tap="swichNav"><text>已过期</text></view>
		</view>
		<view class="tab-height"></view>
		<scroll-view scroll-y="true" :style="'height: ' + swiperHeight + 'px;'">
			<coupon-templete1 ref="couponTemplete1" @receive="receive"></coupon-templete1>
			<tui-no-data v-if="notcont" imgUrl="https://pic.kaidanxia.com/2020-08-21/20200821154706b82751596.png"
				:imgWidth="264" :imgHeight="264">
				<view class="col-9">亲，暂无优惠券哦</view>
			</tui-no-data>
		</scroll-view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import couponTemplete1 from './_templete/templete1';

	export default {
		components: {
			couponTemplete1
		},
		data() {
			return {
				// 选项卡标示
				dataType: 'not_use',
				// 列表高度
				swiperHeight: 0,
				// 优惠券列表
				list: [],
				// show
				notcont: false,
				wxapp_id: '',
				homeStyle: 'div',
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.wxapp_id = app.wxapp_id || '';
			this.homeStyle = app.homeStyle?app.homeStyle:'div';
			// 获取优惠券列表
			this.getCouponList();
			this.$nextTick(() => {
				// 设置高度
				this.setSwiperHeight();
			})
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {},
		methods: {
			/**
			 * 获取优惠券列表
			 */
			getCouponList() {
				let that = this;

				app._get('user.coupon/lists', {
					data_type: that.dataType
				}, res => {;
					that.list = res.data.list;
					that.notcont = !res.data.list.length;
					that.$nextTick(() => {
						that.$refs.couponTemplete1._show({
							list: res.data.list,
							homeStyle: that.homeStyle,
							wxapp_id: that.wxapp_id,
						})
					})
				});
			},

			/**
			 * 设置swiper的高度
			 */
			setSwiperHeight() {
				// 获取系统信息(拿到屏幕宽度)
				const query = wx.createSelectorQuery();
				query.select('#top').boundingClientRect();
				query.selectViewport().scrollOffset();
				query.exec(res => {
					let systemInfo = wx.getSystemInfoSync(),
						rpx = systemInfo.windowWidth / 750,
						// 计算rpx
						tapHeight = Math.floor(rpx * 80),
						// tap高度
						swiperHeight = systemInfo.windowHeight - tapHeight - res[0].height; // swiper高度
						
					this.swiperHeight = swiperHeight;
				});
			},

			/** 
			 * 点击tab切换 
			 */
			swichNav(e) {
				let _this = this;

				_this.setData({
					list: {},
					dataType: e.currentTarget.dataset.current
				}, function() {
					// 获取优惠券列表
					_this.getCouponList();
				});
			},

		}
	};
</script>
<style lang="scss">
	@import "coupon";
	// @import '@/pages/coupon/_templete/templete1/index';
	// @import 'templete1';
</style>
