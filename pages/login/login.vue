<template>
	<view class="page">
		<navigationBar :back="false" @back="goHome">
			<view slot="left">
				<div class="title" @tap.stop="goHome">
					<text class="iconfont2 icon-fanhui"></text>
					返回首页
				</div>
			</view>
		</navigationBar>
		<view class="loginBox">
			<image src="https://pic.kaidanxia.com/2020-08-20/20200820101039068879649.png"></image>
		</view>
		<view class="container">
			<view class="login-btn">
				<!-- #ifdef H5 || APP-PLUS -->
				<button class="btn-normal" @tap.stop="appGetUser" lang="zh_CN"><text
						class="iconfont2 icon-WeChat"></text>微信一键登录</button>
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<button class="btn-normal" @tap="getUserInfo" lang="zh_CN"><text
						class="iconfont2 icon-WeChat"></text>微信一键登录</button>
				<!-- #endif -->
			</view>
			<!-- <view class="Mobile-login-btn" @tap.stop="mobileLogin">
        手机号登录
    </view> -->
			<view class="footer"><text class="col-m" @tap.stop="toPermit">用户协议</text>和<text class="col-m"
					@tap.stop="toPrivacy">隐私政策</text></view>
		</view>
		<popup :show="showPopup" @clickmask="clickmask">
			<view class="popup-main">
				<view class="pop-close" @tap="clickmask"><text class="iconfont2 icon-shanchu1"></text></view>
				<view class="pop-input infoBox">
					<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					  <image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
					</button>
					<view class="nickNameBox dis-flex flex-y-center">
						<view class="label col-2">
							昵称
						</view>
						<input v-model="nickName" @change="nickNameChange" type="nickname" class="weui-input app-red" placeholder="请输入昵称"/>
					</view>
				</view>
				<view class="pop-input">
					<text class="f-30">
						登录代表同意<text class="col-m" @tap.stop="toPermit">用户协议</text>和<text class="col-m"
							@tap.stop="toPrivacy">隐私政策</text>
					</text>
				</view>
				<view class="pop-btn">
					<view @tap="clickmask">不同意</view>
					<!-- #ifdef H5 || APP-PLUS -->
					<view class="col-m" openType="getPhoneNumber" @tap="appGetPhoneNumber">同意</view>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<view>
						<button v-if="nickName != ''" class="btn-agree col-m" openType="getPhoneNumber" lang="zh_CN"
							@getphonenumber="getPhoneNumber">同意</button>
						<button v-else class="btn-agree col-m" @tap="showMsg">同意</button>
					</view>
					<!-- #endif -->
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	const App = getApp().globalData;
	import popup from "@/components/pop-manager/index";

	export default {
		data() {
			return {
				options: {},
				showPopup: false,
				avatarUrl: '/static/images/default-avatar.jpg',
				nickName: ''
			};
		},
		components: {
			popup
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.options = options
		},

		methods: {
			nickNameChange(e) {
				console.log(e)
				this.nickName = e.detail.value
			},
			onChooseAvatar(e) {
				let that = this
				const { avatarUrl } = e.detail
				App.uploadFile({
					name: 'avatarUrl',
					filePath: avatarUrl,
					isShop: false,
					success: function(res) {
						if (res.code == 1) {
							that.avatarUrl = res.data.file_path || ''
							console.log()
						} else {
							that.$api.msg(res.msg);
						}
					},
					fail: function(res) {
					},
					complete: (res) => {
					}
				})
			},
			goHome() {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			toPermit() {
				uni.navigateTo({
					url: '/pages/user/agreement/permit'
				});
			},
			toPrivacy() {
				uni.navigateTo({
					url: '/pages/user/agreement/privacy'
				});
			},
			appGetUser() {
				this.showPopup = true
			},
			appGetPhoneNumber() {
				this.showPopup = false
				let that = this
				uni.getProvider({
					service: 'oauth',
					success: function(res) {

						//支持微信、qq和微博等
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								success: function(loginRes) {


									App.wxUserInfo = loginRes.authResult
									uni.getUserInfo({
										provider: 'weixin',
										success: function(res) {

											// 发送用户信息
											App._get(
												'weixin.mini_program/getuserbyunionid', {
													union_id: res.userInfo.unionId,
													flatform_id: App.getUniacid()
												}, result => {
													if (result.data.token == '') {
														App.session = result.data
															.session || {
																openid: "",
																session_key: ""
															}
														// 跳转授权页面
														uni.navigateTo({
															url: "/pages/login/mobileLogin/login?&delta=" +
																that
																.options
																.delta +
																'&isBack=' +
																that
																.options
																.isBack
														});
													} else {
														wx.setStorageSync('token',
															result.data.token);
														wx.setStorageSync(
															'user_id', result
															.data.user.user_id);
														if (result.data.shop) {
															App.setMyShopInfo(
																result.data
																.shop)
															// App.wxapp_id = result.data.shop.wxapp_id;
														} else {
															App.setMyShopInfo({})
														}
														let pages =
															getCurrentPages();
														let prevPage = pages[pages
															.length - 2]; //上一个页面
														if (prevPage && prevPage
															.$vm && prevPage.$vm
															.unitData) {
															prevPage.$vm.unitData()
														}
														uni.navigateBack()
													}
												}, (res) => {}, (e) => {
													wx.hideLoading();
												});
										},
										fail: (res) => {}
									});
								},
								fail: (res) => {}
							})
						}
					}
				})


			},
			/**
			 * 授权登录
			 */
			getUserInfo() {
				let that = this;
				let code = '';
				wx.login({
					success(res) {
						// console.log('登录失败！' + res.code)
						if (res.code) {
							code = res.code;
						} else {
							// console.log('登录失败！' + res.errMsg)
						}
					}
				});
				wx.getUserProfile({
					lang: 'zh_CN',
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (e) => {
						console.log(e)
						that.avatarUrl = e.userInfo.avatarUrl
						App.wxUserInfo = e.userInfo;
						App.wxUserInfo.user_profile_iv = e.iv || '';
						App.wxUserInfo.user_profile_encrypted_data = e.encryptedData || '';
						App.wxUserInfo.user_profile_signature = e.signature || '';
						App.wxUserInfo.user_profile_code = code || '';
						// console.log(App.wxUserInfo)
						if (e.errMsg == 'getUserProfile:ok') {
							that.showPopup = true
						}
					}
				})
			},
			showMsg() {
				if (this.nickName == '') {
					this.$api.msg('请输入昵称')
				}
			},
			// 获取手机号
			getPhoneNumber(e) {
				this.showPopup = false
				console.log(App.wxUserInfo)
				App.wxUserInfo.nickName = this.nickName
				App.wxUserInfo.avatarUrl = this.avatarUrl
				console.log(e.detail)
				if (e.detail.errMsg == 'getPhoneNumber:ok') {
					let invitation_code = uni.getStorageSync('invitation_code') || ''
					let channel_id = wx.getStorageSync('channel_id') || '';
					App._post_form('weixin.mini_program/wxPhoneLogin', {
						nickName: this.nickName,
						avatarUrl: this.avatarUrl,
						sessionKey: App.session.session_key,
						phoneIv: e.detail.iv,
						UserIv: App.wxUserInfo.iv || '',
						encrypted_data: App.wxUserInfo.encryptedData || '',
						encryptedData: e.detail.encryptedData,
						signature: App.wxUserInfo.signature || '',

						user_profile_encrypted_data: App.wxUserInfo.user_profile_encrypted_data,
						user_profile_iv: App.wxUserInfo.user_profile_iv,
						user_profile_signature: App.wxUserInfo.user_profile_iv,
						code: App.wxUserInfo.user_profile_code,

						referee_id: wx.getStorageSync('referee_id'),
						invitation_code: invitation_code,
						sessionKey: App.session.session_key || '',
						wxapp_id: App.wxapp_id,
						flatform_id: App.getUniacid(),
						channel_id: channel_id
					}, result => {
						if (result.code == 1) {
							wx.setStorageSync('token', result.data.token);
							wx.setStorageSync('user_id', result.data.user.user_id);

							App.bindMbid();
							if (result.data.shop) {
								App.setMyShopInfo(result.data.shop)
							} else {
								App.setMyShopInfo({})
							}
							if (result.data.user.is_setting_info) {
								// if (this.options.isBack == '1') {
								let pages = getCurrentPages();
								let prevPage = pages[pages.length - 2]; //上一个页面
								if (prevPage.$vm.unitData) {
									prevPage.$vm.unitData()
								}
								wx.navigateBack({
									delta: 1
								});
								// } else {
								//   uni.reLaunch({
								//     url:'/pages/index/index'
								//   })
								// }
							} else {
								uni.navigateTo({
									url: '/pages/user/myinfo/index?login=1&delta=2'
								});
							}
						} else {
							this.$api.msg(result.msg)
						}
					})
				}
			},

			/**
			 * 跳转到手机登录页
			 */
			mobileLogin() {
				let url = '/pages/login/mobileLogin/login?delta=' + this.options.delta
				if (this.options.isBack == 1) {
					url += '&isBack=' + this.options.isBack
				}
				uni.navigateTo({
					url: url
				});
			},

			/**
			 * 授权成功 跳转回原页面
			 */
			onNavigateBack(delta) {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if (prevPage.$vm.unitData) {
					prevPage.$vm.unitData()
				}
				wx.navigateBack({
					delta: Number(delta || 1)
				});
			},
			clickmask() {
				this.showPopup = false
			}

		}
	};
</script>
<style lang="scss" scoped>
	@import "./login.scss";
</style>
