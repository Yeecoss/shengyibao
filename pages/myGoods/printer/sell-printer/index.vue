<template>
	<view class="">
		<!-- 自定义标题栏 -->
		<navigationBar title="打印机" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<image @tap="onPreviewSkuImage" :src="coverImage" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data(){
			return{
				coverImage:'https://pic.kaidanxia.com/2020-11-02/173750915960943.jpg',
			}
		},
		methods: {
			//预览Sku规格图片
			onPreviewSkuImage(e) {
			
			  wx.previewImage({
			    current: this.coverImage,
			    urls: [this.coverImage]
			  });
			},
		}
	}
</script>

<style lang="scss">
	image{
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
