<template>
	<view class="containerBox">
		<view class="container">
			<div class="heardBox">
				<div class="heardBg" :class="'heardBg' + checkItem">
					<!-- 自定义标题栏 -->
					<navigationBar :title="memberText + '特权'" fontSize="36rpx" :fontWeight="600" extClass="nav" id="top" background="transparent"
					 :fixed="false" :color="colors[checkItem]"></navigationBar>
					<div class="t-c col-3 f-24" :style="'color:' + colors[checkItem]">开通{{memberText}}解锁更多功能</div>
				</div>
				<div class="member bgW m-top">
					<member :checkItem="checkItem" @upCheckItem="upCheckItem"></member>
				</div>
				<div class="listBox">
					<list-box :checkItem="checkItem" ref="listBox"></list-box>
				</div>
			</div>
			<div class="butBox bgW m-top">
				<div class="receiveBut" @tap.stop="showTips(checkItem)" :class="'receiveBut' + checkItem">{{buts[checkItem]}}</div>
			</div>
		</view>
		<!-- 提示 -->
    <popup-official ref="popupOfficial"></popup-official>
	</view>
</template>

<script>
	let App = getApp().globalData;
	import member from './member/index';
	import listBox from './list-box/index';
	import popupOfficial from '@/components/popup-official/index';

	export default {
		data() {
			return {
				memberText: App.member,
				colors: {
					1: '#333',
					2: '#FFE3C1',
					3: '#6E4A23',
				},
				buts: {
					1: '立即领取',
					2: '开通' + App.member,
					3: '开通' + App.member,
				},
				checkItem: '1',
				userInfo: {},
			};
		},

		components: {
			member,
			listBox,
			popupOfficial
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
		},

		/**
		 * 生命周期函数--监听页面显示
		 */

		onShow: function() {
			this.getData()
		},
		methods: {
			getData() {
				App._get('user.index/vipDetail', {}, (res) => {
					if (res.code == '1') {
						let data = res.data.userInfo || {}
						data.vip_expireText = data.vip_expire ? data.vip_expire.substring(0, 10) : ''
						this.userInfo = data
						if (this.userInfo.vip) {
							if (this.userInfo.vip == 1) {
								this.checkItem = '1'
							} else if (this.userInfo.vip == 2 || this.userInfo.vip == 3) {
								this.checkItem = '3'
							} else if (this.userInfo.vip == 4) {
								this.checkItem = '2'
							}
						}
					}
				})
			},
			upCheckItem(type) {
				this.checkItem = type
			},
			showTips(type) {
				if (type != 1 && App.ios) {
					App.showError('ios暂不支持，请到APP进行操作')
					return false
				}
				let next = () => {
					this.type = type
					this.show = true
				}
				let vip = type == 1 ? 1 : type == 2 ? 4 : 3;
				if (!this.userInfo.vip || (this.userInfo.vip == '' || this.userInfo.vip <= vip)) {
					if (type == 1) {
						uni.showLoading()
						App._post_form('vip.collection/getXiamiVip', {}, (result) => {
							if (result.code == '1') {
								next()
							} else {
								App.showSuccess(result.msg);
							}
						}, false, () => {
							uni.hideLoading()
						})
					} else {
						if (App.ios) {
							this.type = type
							this.$refs.popupOfficial.open()
							return
						}
						let data = {}
						if (type == 2) {
							data.rights = '4'
						}
						if (type == 3) {
							data.rights = '3'
						}
						/* #ifdef APP-PLUS */
						data.platform = 'app'
						/* #endif */
						uni.showLoading();
						App._post_form('weixin.mini_program/appletsPay', data, (result) => {
						if (result.code == '1') {
							let data =  result.data
							let that = this
							let data1 = {}
							/* #ifdef MP */
							data1 = {
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: 'MD5',
							paySign: data.paySign,
							sign: data.sign,
							success(res) {
								next()
							},
							fail(res) {
								// console.log(res)
							},
							complete(res) {
								// console.log(res)
							}
							}
							/* #endif */
							/* #ifdef APP-PLUS || H5 */
							data1 = {
								provider: 'wxpay',
								orderInfo: JSON.stringify(data),
								success(res) {
									next()
								},
								fail(res) {
									// console.log(res)
								},
								complete(res) {
									// console.log(res)
								}
							}
							/* #endif */
							wx.requestPayment(data1);
						} else {
							App.showSuccess(result.msg);
						}
						}, (result) => {
							// console.log(result)
						}, () => {
							uni.hideLoading()
						})
					}
				} else {
					let obj = {
						1: '虾米' + this.memberText,
						2: '体验' + this.memberText,
						3: '明虾' + this.memberText,
						4: '龙虾' + this.memberText,
					}
					this.$api.msg('当前已是' + obj[this.userInfo.vip] + '，有效期为' + this.userInfo.vip_expireText + '天')
				}


			},
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
