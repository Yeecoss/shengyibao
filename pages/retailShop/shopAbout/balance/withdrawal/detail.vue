<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar title="提现详情" extClass="nav" id="top"></navigationBar>
		<view class="main wrap30 f-30 col-3">
			<view class="list-item dis-flex flex-y-center flex-x-between oh">
				<view class="oh">金额</view>
				<view class="oh flex-box m-l-30 t-r">¥{{info.amount}}</view>
			</view>
			<view class="list-item dis-flex flex-y-center flex-x-between oh">
				<view class="oh">状态</view>
				<view class="oh flex-box m-l-30 t-r app-red">{{info.status?info.status.text:''}}</view>
			</view>
			<view class="list-item dis-flex flex-y-center flex-x-between oh" v-if="info.status&&info.status.value=='FAIL'">
				<view class="oh">失败原因</view>
				<view class="oh flex-box m-l-30 t-r">{{info.reason}}</view>
			</view>
			<view class="list-item dis-flex flex-y-center flex-x-between oh">
				<view class="oh">时间</view>
				<view class="oh flex-box m-l-30 t-r">{{info.create_time}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components:{
		},
		data (){
			return {
				info:'',
				id: '',
			}
		},
		onLoad(options) {
			this.id = options.id ||'';
			this.getInfo();
		},
		methods: {
			getInfo(){
				app._get('shop.commerce.fund/withdrawDetail',{
					id: this.id
				}, res => {
					this.info = res.data
				});
			}
		}
	}
</script>

<style lang="scss">
	@import 'detail';
</style>
