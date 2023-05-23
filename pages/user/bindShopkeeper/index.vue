<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="绑定店主" extClass="nav" id="top"></navigationBar>
		<view class="main wrap30" v-if="list!=''">
			<view class="list bgf f-24 dis-flex flex-y-center flex-x-between" v-for="(item,index) in list" :key="index">
				<view class="user_img oh m-r-20">
					<image lazy-load :src="item.wxapp_user.avatarUrl||defaultImg" mode="aspectFill"></image>
				</view>
				<view class="user_info flex-box oh">
					<view class="user-name f-28 col-3 onelist-hidden">{{item.wxapp_user.nickName}}</view>
					<view class="col-6 m-t-10">{{item.create_time}}</view>
				</view>
				<template v-if="item.is_bind&&item.is_bind.value==2">
					<view class="opera-btn col-6" @tap="changeBind(0,item.store_user_id)">拒绝</view>
					<view class="opera-btn2" @tap="changeBind(1,item.store_user_id)">同意</view>
				</template>
				<template v-if="item.is_bind&&item.is_bind.value==1">
					<view class="opera-btn col-6" @tap.stop="unbind(item.store_user_id)">解绑</view>
				</template>
			</view>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	export default {
		components:{
			popupTips
		},
		data (){
			return {
				mtitle:'',
				mcontent:'',
				defaultImg:'/static/images/defaultImg.png',
				list: {},
			}
		},
		onLoad(options) {
			this.getList()
		},
		methods: {
			// 获取列表
			getList (){
				let that = this;
				app._get('user.salesclerk/invite',{}, res => {
					let data = res.data.list;
					
					that.list = data;
				});
			},
			// 解绑
			unbind(store_user_id){
				this.mtitle = '提示',
				this.mcontent = '确定解绑？';
				this.$refs.popupTips.open(() => {
					app._post_form('user.salesclerk/unbind',{
						store_user_id: store_user_id,
					}, res =>{
						this.$api.msg(res.msg);
						this.getList()
					});
				});
			},
			// 拒绝/同意
			changeBind(is_bind,store_user_id){
				this.mtitle = '提示',
				this.mcontent = is_bind?'点击确定后，您将自动绑定到该店铺下(如果您已经拥有个人小店，将无法管理个人小店)。是否确定同意？ ': '确定拒绝？';
				this.$refs.popupTips.open(() => {
					let url = is_bind? 'user.salesclerk/approve': 'user.salesclerk/refuse';
					app._post_form(url,{
						store_user_id: store_user_id,
					}, res =>{
						this.$api.msg(res.msg);
						this.getList()
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
