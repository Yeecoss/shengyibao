<template>
	<view class="container">
		<!-- 用户信息 -->
		<view class="user">
			<view class="user_bg ">
				<image mode="aspectFill" :src="imgBaseUrl + 'userBg.png'"></image>
			</view>
			<navigationBar title="个人中心" extClass="nav" color="white" :back="false" background="transparent" :fixed="false">
			</navigationBar>
			<view class="user-header">
				<view class="tipsBox" v-show="showTips" @tap.stop="showIncrement">
					<text class="iconfont2 icon-Tips f-26" style="margin-right:6rpx"></text>
					立即关注公众号，及时接受订单信息！
					<text @tap.stop="showTips = false" class="iconfont2 icon-shanchu1 f-26 close"></text>
				</view>
				<!-- 已登录 -->
				<view v-if="isLogin" class="user-header-cont dis-flex flex-y-center flex-x-between">
					<view class="dis-flex flex-y-center" @tap="toInfo">
						<view class="user-header-avatar">
							<!-- 微信头1像 -->
							<!-- <open-data lang="zh_CN" type="avatarUrl"></open-data> -->
							<image v-if="userInfo.avatarUrl && userInfo.avatarUrl != ''" imageDefault
								:src="userInfo.avatarUrl"></image>
							<image v-else src="/static/images/default-avatar.jpg"></image>
						</view>
						<view class="user-header-right">
							<!-- 微信昵称 -->
							<view class="nickName onelist-hidden">{{userInfo.nickName && userInfo.nickName != '' ? userInfo.nickName : '暂无昵称'}}</view>
						</view>
					</view>
					<view class="myShop" @tap="toOpenAshop" v-if="isLogin">
						<text class="iconfont2 icon-Offlinestores"></text>
						{{store.payment && userInfo.identity ? '门店管理' : '立即开店'}}
					</view>
				</view>
				<!-- 未登录 -->
				<view v-else class="user-header-cont dis-flex flex-y-center" @tap.stop="onLogin">
					<view class="user-header-avatar">
						<image lazy-load src="/static/images/default-avatar.jpg"></image>
					</view>
					<view class="user-header-cont-name">点击登录</view>
				</view>
			</view>
			<!-- 订单导航栏 -->
			<view class="order-navbar bgf">
				<view class="order-navbar-footer dis-flex">
					<template v-for="(item,index) in orderNavbar">
						<view class="order-navbar-item flex-box" :key="index" @tap.stop="onTargetOrder(item)">
							<view class="imgBox dis-flex flex-y-center">
								<!-- <text class="order-navbar__icon iconfont2" :class="item.icon"></text> -->
								<image :src="'/static/images/' + item.icon + '.png'" mode=""></image>
							</view>
							<text class="order-navbar__name">{{item.text}}</text>
							<text class="order-badge" v-if="orderCount[item.type] > 0">{{orderCount[item.type]}}</text>
						</view>
					</template>
				</view>
			</view>
		</view>
		<view class="main">
			<!-- 菜单列表 -->
			<view class="menus-list">
				<view style="width:100%" class="dis-flex flex-wrap" v-for="(items, indexs) in menus" :key="indexs">
					<view class="menus-title col-3 f-32 f-w"><text>{{items.module}}</text></view>
					<view class="menus" v-for="(item, index) in items.items" :style="{width: 100/items.row_num+'%'}"
						:key="index" v-if="item.is_active && item.is_active == 1">
						<button @tap.stop="onTargetMenus(item)" class="btn-normal">
							<view class="imgBox dis-flex flex-y-center flex-x-center">
								<!-- <text class="iconfont2" :class="item.icon" :style="{color: item.active_color}"></text> -->
								<image mode="aspectFill" :src="imgIconUrl + item.icon + '.png'"></image>
							</view>
							<text v-if="item.is_notice" class="redDot"></text>
							<view class="menus-item__left">
								<text class="menus-item__name f-28 col-6">{{ item.alias }}</text>
							</view>
						</button>
					</view>
				</view>
			</view>
		</view>
		<view v-show="isLoading">
			<loading></loading>
		</view>
		<!-- 自定义tabbar -->
		<foot-tabBar ref="footTabBar" dIndex='2' :homeStyle="homeStyle"></foot-tabBar>
		<share-bottom ref="shareBottom" pageType="userIndex"></share-bottom>
		<popup-wx ref="popupWx"></popup-wx>
		<popup-tips ref="popupTips" title="提示" :content="mcontent" :confirmText="confirmText"></popup-tips>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import footTabBar from '@/components/foot-tabBar';
	import loading from '@/components/loading';
	import shareBottom from '@/components/share-bottom/index';
	import popupTips from '@/components/popup-tips/index';
	import popupWx from '@/components/popup-wx/index';


	export default {
		data() {
			return {
				imgBaseUrl: App.imgBaseUrl,
				imgIconUrl: App.imgIconUrl,
				member: '0',
				showTips: true,
				isLoading: true,
				setting: {},
				menus: [],
				isLogin: false,
				userInfo: {},
				store: {}, //店铺信息
				store_is_super: -1,
				// 用户信息
				orderNavbar: [{
						type: 'all',
						url: '/pages/order/index?type=all',
						icon: 'Allorders',
						text: '全部订单'
					},
					{
						type: 'payment',
						url: '/pages/order/index?type=payment',
						icon: 'Tobepaid',
						text: '待付款'
					},
					{
						type: 'delivery',
						url: '/pages/order/index?type=delivery',
						icon: 'Goodstobereceived',
						text: '待收货'
					},
					{
						type: 'refund',
						url: '/pages/order/refund/index',
						icon: 'refund',
						text: '退款/售后'
					}
				],
				orderCount: {}, // 订单数量

				mcontent: '',
				cY: '', //起始top
				qrcode: '',
				isiOS: false, //是否为iOS
				homeStyle: '',
				plugid: 'eab421e2efa432619dfd8d674719d81d',
				showQun: true, //是否显示店主群
				confirmText: '去认证',
			};
		},

		components: {
			'foot-tabBar': footTabBar,
			loading,
			shareBottom,
			popupTips,
			popupWx
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			let that = this;
			// #ifdef MP-WEIXIN || APP-PLUS
			wx.getSystemInfo({
				success: function success(res) {
					var ios = !!(res.system.toLowerCase().search('ios') + 1);
					that.isiOS = ios;
				}
			});
			// #endif
			// #ifndef MP-WEIXIN || APP-PLUS

			let u = navigator.userAgent;
			let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			that.isiOS = isiOS;
			// #endif
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow() {
			// this.isLoading = true;
			this.homeStyle = App.homeStyle ? App.homeStyle : 'div';
			this.isLogin = App.checkIsLogin()

			this.showQun = true;
			// 获取当前用户信息
			this.getUserDetail();
		},

		methods: {
			showIncrement() {
				// #ifdef MP-WEIXIN
				uni.navigateTo({
					url: '/pages/user/otherPage/index?url=https://mp.weixin.qq.com/s/m3zeAgj2E3VqF7w5k-HfwQ'
				});
				// #endif
				// #ifndef MP-WEIXIN
				this.$refs.popupWx.open()
				// #endif
			},
			toInfo() {
				uni.navigateTo({
					url: '/pages/user/myinfo/index'
				});
			},
			/**
			 * 获取当前用户信息
			 */
			getUserDetail() {
				App._get('user.index/detail', {}, (result) => {
					if (result.code == '1') {

						this.menus = result.data.menus || []
						this.setting = result.data.setting
						this.orderCount = result.data.orderCount
						this.userInfo = result.data.userInfo;
						this.store = result.data.store || {}; //店铺信息
						// 店铺信息
						if (result.data.store) {
							let store = result.data.store;
							if (JSON.stringify(store) == "{}") {
								this.store_is_super = -1; //未登录/没有店铺
							} else if (JSON.stringify(store.salesclerk) == "{}") {
								this.store_is_super = 1; //店主
							} else {
								this.store_is_super = 0; //店员
							}
						}
						this.member = this.userInfo.vip || '0'
						if (!this.userInfo) {
							this.isLogin = false
						} else {
							if (!this.isLogin) {
								this.isLogin = App.checkIsLogin()
							}
						}
						this.$nextTick(() => {
							this.isLoading = false
						})
					}
				});
			},
			/**
			 * 订单导航跳转
			 */
			onTargetOrder(item) {
				let _this = this;

				if (!_this.onCheckLogin()) {
					return false;
				}

				// 转跳指定的页面
				uni.navigateTo({
					url: item.url
				});
			},

			/**
			 * 菜单列表导航跳转
			 */
			onTargetMenus(item) {
				let that = this;
				if (!that.onCheckLogin()) {
					return false;
				}
				if (item.name == 'Shareshop') {
					if (!this.userInfo.identity || !this.store.payment) {
						this.confirmText = '确定'
						this.mcontent = '您还没有开店，请先开店'
						this.$refs.popupTips.open()
					} else {
						uni.navigateTo({
							url: item.page
						});
					}
				} else if (item.name == 'Officialcustomerservice') {
					// #ifndef MP-WEIXIN
					that.qrcode = 'https://pic.kaidanxia.com/2020-12-23/1518452c0af7367.png';
					that.$refs.shareBottom._popupShowImg('下载', that.qrcode)
					// #endif
				} else if (item.page && item.page != '') {
					uni.navigateTo({
						url: item.page
					});
				}
			},

			/**
			 * 跳转到登录页
			 */
			onLogin() {
				// uni.navigateTo({
				//   url: '../login/login',
				// });
				App.doLogin(2, () => {
					this.getUserDetail()
				});
			},

			/**
			 * 验证是否已登录
			 */
			onCheckLogin() {
				let _this = this;

				if (!_this.isLogin) {
					App.showError('很抱歉，您还没有登录');
					return false;
				}

				return true;
			},
			// 立即开店
			toOpenAshop() {
				App._post_form('user/createShop', {
					device: App.ios ? 'ios' : 'android'
				}, (result) => {
					if (!this.userInfo.identity) {
						this.confirmText = '去认证'
						this.mcontent = '请先进行身份认证'
						this.$refs.popupTips.open(() => {
							uni.navigateTo({
								url: '/pages/user/identity/index'
							})
						})
					} else if (!this.store.payment) {
						this.confirmText = '去认证'
						this.mcontent = '请先进行商户收款认证'
						this.$refs.popupTips.open(() => {
							uni.navigateTo({
								url: '/pages/user/collectCertificat/index'
							})
						})
					} else {
						uni.navigateTo({
							url: '/pages/retailShop/index'
						})
					}
				}, (res) => {
					this.$api.msg(res.msg)
				})
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
