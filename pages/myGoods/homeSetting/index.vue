<template>
	<view class="bgf5 min-h100">
		<!-- 自定义标题栏 -->
		<navigationBar title="首页配置" extClass="nav" id="top"></navigationBar>
		<!--main -->
		<view class="container">
			<view class="listBox" style="background:white">
				<view class="list dis-flex">
					<view class="label">采购设置</view>
					<view class="control dis-flex flex-x-end flex-y-center">
						<cust-switch ref="switch" :checked="isOpen" @change="switchCange"></cust-switch>
					</view>
				</view>
				<view class="notes f-24 col-9">
					<text class="iconfont2 icon-jingshi f-24"></text>默认打开，浏览你的店铺的用户可直接进入当前店铺采购页（自己店铺无法查看）。
					<text class="app-red" @tap.stop="showIntro">详情解析</text>
				</view>
			</view>
		</view>
		<!-- 详情解析弹窗 -->
		<popup-tips ref="popupTips" type="custom" confirmText="确定">
			<view class="popTips-title f-32 col-3 t-c">详情解析</view>
			<view class="mcontent">
				<image src="https://pic.kaidanxia.com/2020-09-03/20200903095031fbcac3333.png" mode="widthFix"></image>
			</view>
		</popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import custSwitch from '@/components/cust-switch/index.vue';
	import popupTips from '@/components/popup-tips/index';
	export default{
		components: {
			custSwitch,
			popupTips
		},
		data(){
			return{
				isOpen: true,
			}
		},
		onLoad() {
			this.getInfo()
			this.home()
		},
		methods:{
			home() {
				app._post_form('shop.wxapp.click_record/reportClickRecord', {
					module: 'home'
				}, res => {
				});
			},
			getInfo(){
				app._get('shop.setting/store',{},res => {
					let info = res.data.values;
					if(info.showDealerGoods!='off'){
						this.isOpen = true;
					}else{
						this.isOpen = false;
					}
				})
			},
			//switch
			switchCange(e) {
				let data = {
					showDealerGoods: this.isOpen==true? 'off': 'on'
				}
				app._post_form('shop.setting/store',data,res => {
					this.$api.msg(res.msg)
					if(res.code==1){
						this.isOpen = e;
					}
				})
			},
			showIntro(){
				this.$refs.popupTips.open();
			}
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	.notes{background-color: #fff;}
	.mcontent{
		padding: 30rpx 50rpx 60rpx;
	}
</style>
