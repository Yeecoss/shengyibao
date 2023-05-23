<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="店铺模版" extClass="nav" id="top"></navigationBar>
		
		<view class="main dis-flex flex-x-between flex-wrap">
			<view class="template" v-for="(item,index) in list" :key="index" @tap="change(item.homeStyle)">
				<view class="tpic">
					<image lazy-load :src="item.image" mode="widthFix"></image>
					<view v-if="temDefault==item.homeStyle" class="default_tag f-24 col-f tb-lr-center">当前使用</view>
				</view>
				<view class="tb-lr-center f-30 col-3 m-t-20 m-b-30">{{item.name}}</view>
			</view>
		</view>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	export default {
		components: {
			popupTips
		},
		data (){
			return{
				mtitle:'提示',
				mcontent:'确定使用该模版到首页？',
				list: [
					{homeStyle: 'div', image: 'http://pic.kaidanxia.com/2020-08-13/20200813102059fd6776506.png',name:'默认'},
					{homeStyle: 'saler', image: 'http://pic.kaidanxia.com/2020-08-13/20200813102059919642609.png',name:'卖手圈'},
					{homeStyle: 'minishop', image: 'https://pic.kaidanxia.com/2020-10-19/174556083e57525.png',name:'小商店'},
					{homeStyle: 'sportshop', image: 'https://pic.kaidanxia.com/2021-04-29/180809e90626429.png',name:'运动潮服'},
				],
				temDefault: '',
			}
		},
		onLoad() {
			this.getSetting()
			this.template()
		},
		methods: {
			//获取模板配置
			getSetting(){
				app._get('shop.setting/store',{},res => {
					let info = res.data.values;
					this.info = res.data.values;
					this.temDefault = info.homeStyle || 'div';
				})
			},
			template() {
				app._post_form('shop.wxapp.click_record/reportClickRecord', {
					module: 'template'
				}, res => {
				});
			},
			//切换店铺模板
			change(id){
				this.$refs.popupTips.open(()=>{
					let homeStyle = id? id:'div';
					app._post_form('shop.setting/store',{homeStyle: homeStyle}, res => {
						this.$api.msg(res.msg)
						if(res.code ==1){
							this.temDefault = id;
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/index/index'
								})
							},1500)
						}
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
