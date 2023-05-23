<template>
	<div class="scrollBox">
		<swiper @change="swiperChange" previous-margin="40rpx" next-margin="40rpx" class="swiper" :indicator-dots="false"
		 :autoplay="false" :interval="3000" :duration="1000" :current="bigIdx">
			<template v-for="(vip, i) in vips">
				<swiper-item :key="i">
					<view class="swiper-item small" :class="'cardBg' + (i+1)">
						<div class="bgBox">
							<image :src="vip.imgUrl" mode="aspectFill"></image>
						</div>
						<div class="item dis-flex flex-y-center">
							<div class="imgBox">
								<image mode="aspectFill" v-if="userInfo.avatarUrl && userInfo.avatarUrl != ''" imageDefault :src="userInfo.avatarUrl"></image>
								<image mode="aspectFill" v-else src="/static/images/default-avatar.jpg"></image>
							</div>
							<div class="wdBox"></div>
							<div class="infoBox">
								<div class="name">{{userInfo.nickName || '暂无昵称'}}
									<!-- <text class="iconBox iconfont2 icon-questionmark"></text> -->
								</div>
								<div class="info" v-show="vip.vip >0">{{vip.vip >= userInfo.vip ? (userInfo.vip == vip.vip || userInfo.vip == vip.vip1 ? userInfo.vip_expireText + '到期' : vip.state) : ''}}</div>
							</div>
						</div>
						<div class="butBox" @tap.stop="showTips(i, vip)">
							<div class="but">{{vip.butText || ''}}</div>
						</div>
					</view>
				</swiper-item>
			</template>
		</swiper>
	</div>
</template>

<script>
	let App = getApp().globalData;

	export default {
		data() {
			return {
				member: App.member,
				bigIdx: 0,
				vips: [{
					imgUrl: 'http://pic.kaidanxia.com/2020-08-08/202008081336315dd660637.png',
					state: '待领取',
					butText: '立即领取',
					vip: 1
				}, {
					imgUrl: 'http://pic.kaidanxia.com/2020-08-08/20200808133629732082253.png',
					state: '待开通',
					// butText: '立即以1498元开通',
					butText: '立即购买',
					vip: 4
				}, {
					imgUrl: 'http://pic.kaidanxia.com/2020-08-08/20200808133630065717748.png',
					state: '待开通',
					// butText: '立即以498元开通',
					butText: '立即购买',
					vip: 3,
					vip1: 2
				}]
			};
		},

		components: {},
		props: {
			userInfo: {
				type: Object,
				default: function() {
					return {}
				}
			},
			checkItem: {
				type: String,
				default: '1'
			}
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},
		methods: {
			updata(val) {
				if (val == '1') {
					this.bigIdx = 0
				}
				if (val == '2') {
					this.bigIdx = 1
				}
				if (val == '3') {
					this.bigIdx = 2
				}
			},
			swiperChange(e) {
				this.bigIdx = e.detail.current
				this.$emit('check', this.bigIdx + 1 + '')
			},
			showTips(i, item) {
				if (!this.userInfo.vip || (this.userInfo.vip == '' || this.userInfo.vip <= item.vip || this.userInfo.vip <= item.vip1)) {
					this.$emit('showTips', i + 1 + '')
				} else {
					let obj = {
						1: '虾米' + this.member,
						2: '体验' + this.member,
						3: '明虾' + this.member,
						4: '龙虾' + this.member,
					}
					this.$api.msg('当前已是' + obj[this.userInfo.vip] + '，有效期为' + this.userInfo.vip_expireText + '天')
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	@import "./index.scss";
</style>
