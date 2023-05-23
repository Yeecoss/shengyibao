<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="店铺公告" extClass="nav" id="top"></navigationBar>
		<view class="main col-3 f-26">
			<view class="content m-top30">
				<view class="text">{{context}}</view>
				<view class="sanjiao"><image src="../../../static/images/sanjiao.png" mode="widthFix"></image></view>
				<view class="douhao1"><image src="https://pic.kaidanxia.com/2020-08-18/202008181946025b49d4340.png" mode="widthFix"></image></view>
				<view class="douhao2"><image src="https://pic.kaidanxia.com/2020-08-18/20200818194602c7c1e0066.png" mode="widthFix"></image></view>
				<!-- <view class="sanjiao"><view></view></view> -->
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		data(){
			return {
				context: ''
			}
		},
		onLoad(options) {
			this.context = options.text
		}
	}
</script>

<style lang="scss">
	@import 'detail';
</style>
