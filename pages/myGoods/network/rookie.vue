<template>
	<view class="wraper bg_blue min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="菜鸟面单" extClass="nav" id="top"></navigationBar>
		
		<view class="main bgf f-26">
			<view class="main-title f-30">如何添加菜鸟面单账号</view>
			<view class="f-24 gray m-t-10">请使用淘宝卖家或买家账号，进行授权后使用</view>
			<view class="text">1.复制以下地址在浏览器打开</view>
			<view class="btn f-32 col-f t-c" @tap="clipboard()">点击复制链接，在浏览器打开</view>
			<view class="text">2.登录淘宝账号授权</view>
			<view class="imgBox">
				<image src="https://pic.kaidanxia.com/2021-01-25/180557200b84501.png" mode="widthFix"></image>
			</view>
			<view class="text">3.完成后，返回小程序自动读取面单账号</view>
		</view>
	</view>
</template>

<script>
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	export default{
		data(){
			return{
				isSucess: true,
			}
		},
		onLoad() {
			
		},
		methods:{// 复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
			},
		}
	}
</script>

<style lang="scss">
	.bg_blue{background: #4694FF;}
	.p-t-40{padding-top: 40rpx;}
	.f-44{font-size: 44rpx;}
	.wraper{padding: 20rpx 20rpx 40rpx;}
	.main{
		border-radius: 8rpx;
		padding: 40rpx 20rpx 20rpx;
		color: #2A2A30;
	}
	.text{
		margin-top: 60rpx;
		margin-bottom: 40rpx;
	}
	.gray{color: #828393;}
	.btn{
		line-height: 80rpx;
		background: #4694FF;
		border-radius: 8rpx;
	}
	image{
		width: 100%;
		display: block;
	}
</style>
