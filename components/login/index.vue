<template>
	<view>
		<!--底部分享弹窗-->
		<tui-bottom-popup :show="show" @close="popup">
			<view class="login dis-flex flex-y-center flex-x-center">
				<!-- #ifdef MP-WEIXIN -->
				<button class="btn-normal" @tap="getUserInfo" lang="zh_CN"><text
						class="iconfont2 icon-WeChat"></text>微信一键登录</button>
				<!-- #endif -->
			</view>
		</tui-bottom-popup>
		
		<tui-bottom-popup :show="showPopup" @close="clickmask">
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
			<view class="login2">
				<view class="poptitle">
					为了您的账号安全，请绑定手机号
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="btn-normal btn-normal1"  openType="getPhoneNumber" lang="zh_CN" @getphonenumber="getPhoneNumber"></text>授权微信手机号</button>
				<!-- #endif -->
			</view>
		</tui-bottom-popup>
	</view>
</template>

<script>
	import popup from "@/components/pop-manager/index";
	const App = getApp().globalData; // 富文本插件
	export default {
		data() {
			return {
				show: false,
				showPopup: false,
				avatarUrl: '/static/images/default-avatar.jpg',
				nickName: ''
			};
		},

		components: {
			popup
		},
		props: {},
		watch: {},
		/**
		 * 生命周期函数--监听页面加载
		 */
		mounted() {},
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
			popup() {
				this.show = false
			},
			open(next) {
				this.show = true
				this.next = next || null
			},
			clickmask() {
				this.showPopup = false
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
						that.avatarUrl = e.userInfo.avatarUrl
						App.wxUserInfo = e.userInfo;
						App.wxUserInfo.user_profile_iv = e.iv || '';
						App.wxUserInfo.user_profile_encrypted_data = e.encryptedData || '';
						App.wxUserInfo.user_profile_signature = e.signature || '';
						App.wxUserInfo.user_profile_code = code || '';
						if (e.errMsg == 'getUserProfile:ok') {
							that.showPopup = true
						}
					}
				})
			},
			// 获取手机号
			getPhoneNumber(e) {
				this.showPopup = false
				// console.log(App.wxUserInfo)
				// console.log(e.detail)
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
							this.show = false
							this.next && this.next()
						} else {
							this.$api.msg(result.msg)
						}
					})
				}
			},
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
