<template>
	<div class="pageBox">
		<navigationBar ref="navigationBar" title="商户收款须知"></navigationBar>
		<div>
			<image src="https://pic.kaidanxia.com/2020-12-21/1109256bddb9020.png"></image>
		</div>
		<div class="pad link" @tap="agreement">《生意宝支付开户及服务协议》</div>
		<div class="pad link" @tap="policy">《生意宝支付开通隐私政策》</div>
		<div class="pad link" @tap="showImg">《费率结算规则》</div>
		<div class="pad-t pad dis-flex flex-y-center flex-x-center">
			<checkbox-group @change="change">
				<checkbox class="checkbox" value="1" :checked="checked" />
			</checkbox-group>
			<div class="f-26" style="color:#2A2A30">勾选代表你已阅读并同意 《生意宝支付开户及服务协议》 、 《生意宝支付隐私政策》</div>
		</div>
		<div class="butBox" @tap="toAgreement">
			<div class="but" :class="checked ? 'checked' : ''">立即申请</div>
		</div>
	</div>
</template>
<script>
	let App = getApp().globalData;
	export default {
		data() {
			return {
				checked: false,
				reSub: ''
			};
		},

		components: {
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(options) {
			if (options.reSub) {
				this.reSub = 1
			}
		},
		mounted() {},
		methods: {
			policy() {
				uni.navigateTo({
					url: './policy'
				});
			},
			agreement() {
				uni.navigateTo({
					url: './agreement'
				});
			},
            change(val) {
				this.checked = !!val.detail.value[0]
			},
			showImg() {
				uni.previewImage({
					current:0,
					urls: ['https://pic.kaidanxia.com/2020-11-06/1910409ed9a9284.jpg']
				})
			},
			toAgreement() {
				if (this.checked) {
					uni.navigateTo({
						url: '/pages/user/collectCertificat/index?reSub=' + this.reSub
					});
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	image{
		width: 750rpx;
		height: 3192rpx;
	}
	.link{
		color: #FF7541;
		font-size: 28rpx;
		text-decoration:underline;
		font-weight: 400;
		line-height: 56rpx;
	}
	.pad{
		padding: 0 60rpx;
	}
	.pad-t{
		padding-top: 40rpx;
		padding-bottom: 60rpx;
	}
	.checkbox{
		transform:scale(0.75);
	}
	.butBox{
		border-top: 1rpx solid #E5E5EC;
		height: 84rpx;
		background: #FFFFFF;
		padding-top: 14rpx;
		.but{
			width: 690rpx;
			height: 72rpx;
			background: rgba(153, 153, 153, 0.4);
			border-radius: 40rpx;
			margin: 0 auto;
			color: white;
			text-align: center;
			line-height: 72rpx;
		}
		.checked{
			background: #FF7541;
		}
	}
</style>
