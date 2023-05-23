<template>
	<view class="mobileLogin">
		<!-- 自定义标题栏 -->
		<!-- <navigationBar title="手机号登录"></navigationBar> -->
		<navigationBar :back="false" @back="goHome">
			<view slot="left">
				<div class="title" @tap.stop="goHome">
					<text class="iconfont2 icon-fanhui"></text>
					返回首页
				</div>
			</view>
		</navigationBar>
		<view class="container">
			<form @submit="formSubmit">
				<view class="inputBox dis-flex flex-y-center">
					<view class="areaCode">
						+86
						<!-- <text class="iconfont2 icon-pull-down"></text> -->
					</view>
					<view>
						<input placeholder-class="uni-input" class="inputClass" type="number" v-model="mobileNum" :maxlength="11"
						 placeholder="输入您的手机号" />
					</view>
				</view>
				<view class="inputBox dis-flex flex-y-center">
					<input placeholder-class="uni-input" type="number" class="inputClass inputClass1" :maxlength="6" v-model="verificat"
					placeholder="请输入验证码" />
					<div v-if="mobileNum.length == 11">
						<div v-if="isTime" class="verificat">{{time}}s后重发</div>
						<div class="verificat" v-else @tap.stop="getVerificat">获取验证码</div>
					</div>
				</view>
				<view class="login-btn">
					<button v-if="mobileNum.length == 11 && verificat.length == 4" class="btn-normal" form-type="submit">同意协议并登录</button>
					<button v-else class="btn-normal btn-normal1">同意协议并登录</button>
				</view>
				<view class="footer">登录代表同意<text class="col-m" @tap.stop="toPermit">用户协议</text>和<text class="col-m" @tap.stop="toPrivacy">隐私政策</text></view>
			</form>
		</view>
	</view>
</template>

<script>
	const App = getApp().globalData;

	export default {
		data() {
			return {
				options: {},
				mobileNum: '',
				verificat: '',
				isTime: false,
				time: 60,
				delta: ''
			};
		},

		components: {
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			this.options = options
			this.mobileNum = options.phone || ''
		},

		methods: {
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
			appLogin() {
				wx.showLoading({
					title: "正在登录",
					mask: true
				});
				// 执行微信登录
				// 发送用户信息
				let obj = {
        			wxapp_id: App.wxapp_id,
					phone: this.mobileNum,
					code: this.verificat
				}
				let channel_id = wx.getStorageSync('channel_id');
				
				if (channel_id) {
					obj.channel_id = channel_id
				}
				// #ifdef MP
				let scene = uni.getStorageSync('scene')
				if (scene) {
					obj.scene = scene
				}
				// #endif
				obj = Object.assign(obj, App.wxUserInfo);
				
				App._post_form('user/codelogin', obj, result => {
					// 记录 token user_id
					// wx.setStorageSync('token', result.data.token);
					// wx.setStorageSync('user_id', result.data.user.user_id);

					// if (result.data.shop) {
					// 	App.setMyShopInfo(result.data.shop)
					// } else {
					// 	App.setMyShopInfo({})
					// }
					if (result.data.user.is_setting_info) {
						// if (this.options.isBack == '1') {
							let pages = getCurrentPages();
							
							let delta = Number(this.options.delta || 2)
							
							let prevPage = pages[pages.length - delta - 1]; //上一个页面
							if(prevPage.$vm.unitData){
								prevPage.$vm.unitData()
							}
							wx.navigateBack({
								delta: delta
							});
						// } else {
						// 	uni.reLaunch({
						// 		url:'/pages/index/index'
						// 	})
						// }
					} else {
						uni.navigateTo({
							url: '/pages/user/myinfo/index?login=1&delta=3'
						});
					}
					
					// 更新主题tabbar
					App.$store.commit('getTheme',App)
				}, false, () => {
					wx.hideLoading();
				});
			},
			/**
			 * 登录
			 */
			formSubmit() {
				/* #ifdef APP-PLUS  */
				  this.appLogin()
      			/* #endif */
      			/* #ifdef MP-WEIXIN || H5 */
				App.getUserInfo({
					phone: this.mobileNum,
					code: this.verificat
				}, (data) => {
					// let pages = getCurrentPages();
					// if (pages.length) {
					//   wx.navigateBack({
					//     delta: Number(2)
					//   });
					// } else {
					if (data.user.is_setting_info) {
						
						// if (this.options.isBack == '1') {
							let pages = getCurrentPages();
							let delta = Number(this.options.delta || 2)
							let prevPage = pages[pages.length - delta - 1]; //上一个页面
							if(prevPage.$vm.unitData){
								prevPage.$vm.unitData()
							}
							wx.navigateBack({
								delta: delta
							});
						// } else {
						// 	uni.reLaunch({
						// 		url:'/pages/index/index'
						// 	})
						// }
					} else {
						uni.navigateTo({
							url: '/pages/user/myinfo/index?login=1'
						});
					}
					// }
				});
      			/* #endif */
			},
			// 获取验证码
			getVerificat() {
				this.setTime()
				App._post_form('sms/logincode', {
					phone: this.mobileNum
				}, result => {
					
				}, false, result => {
					
					this.$api.msg(result.msg)
				})
			},
			setTime() {
				this.time = 60
				this.isTime = true
				let timer = setInterval(() => {
					this.time += -1
					if (this.time == 0) {
						clearInterval(timer)
						this.isTime = false
					}
				}, 1000)
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./login.scss";
</style>
