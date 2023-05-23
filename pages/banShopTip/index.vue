<!-- 店铺封禁整改 -->
<template>
	<view class="min_h_100 dis-flex flex-x-center flex-y-center">
		<!-- 自定义标题栏 -->
		<navigationBar :back="false" extClass="nav" id="top">
			<view slot="left" @tap="navigateTo"><text class="iconfont2 icon-fanhui"></text></view>
		</navigationBar>
		
		<view class="main min_h_100 dis-flex flex-dir-column flex-x-center flex-y-center">
			<view class="tip-ico app-red"><text class="iconfont2 icon-Tips"></text></view>
			<view class="tip-title col-3">提示</view>
			<view class="tip-con col-3 f-32 t-c m-t-20">
				{{content}}
			</view>
			<view v-if="type==1" class="tip-contact col-3" @tap="contact">联系客服</view>
		</view>
	</view>
</template>

<script>
	import siteinfo from "@/siteinfo";
	export default {
		props:{
			
		},
		data(){
			return{
				content: '店铺涉及违规问题',
				isPreview: false,
				type: 2, //1店主，2个人
			}
		},
		onLoad(options) {
			if(!this.isPreview){
				this.content = options.data;
				this.type = options.type||2;
			}
		},
		methods:{
			contact(){
				uni.previewImage({
				  urls: ['https://pic.kaidanxia.com/2020-08-04/20200804201647edec72399.png'],
				})
				this.isPreview = true;
			},
			navigateTo(){
				uni.reLaunch({
					url: '/pages/index/index?wid='+siteinfo.defultId
				})
				// uni.reLaunch({
				// 	url: '/pages/retailShop/shopAbout/choiceShop/index'
				// })
			},
		}
	}
</script>

<style lang="scss">
	.main{
		padding: 0 40rpx;
	}
	.tip-ico text{
		font-size: 120rpx;
		font-weight: 300;
	}
	.tip-title{
		margin-top: 30rpx;
		font-size: 40rpx;
	}
	.tip-contact{
		margin-top: 60rpx;
		font-size: 28rpx;
		text-align: center;
		width: 292rpx;
		line-height: 78rpx;
		border-radius: 40rpx;
		border: 1rpx solid #DEDEDE;
	}
</style>
