<template>
	<view class="min_h_100 bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="店员管理" isHelpme extClass="nav" id="top"></navigationBar>
		
		<!-- list -->
		<view class="main wrap30" v-if="list.data!=''">
			<view class="list-item bgf" v-for="(item,index) in list.data" :key="index">
				<view class="list-user dis-flex">
					<view class="user_img oh m-r-20"><image lazy-load :src="item.avatarUrl||defaultImg" mode="aspectFill"></image></view>
					<view class="user_info flex-box oh">
						<view class="user-name-wrap f-28 m-t-10 dis-flex flex-y-center flex-x-between oh">
							<view class="dis-flex flex-y-center user-name flex-box oh">
								<view class="onelist-hidden width100">{{item.real_name}}</view>
								<view class="onelist-hidden" v-show="item.remark">（备注：{{item.remark}}）</view>
							</view>
							<template v-if="item.is_bind">
								<view class="m-l-30 list-status oh" :class="item.is_bind.value==1?'blue':item.is_bind.value==0?'app-red':''">{{item.is_bind.text}}</view>
							</template>
						</view>
						<view class="list-data f-24 col-6 dis-flex flex-wrap">
							<text class="data-item">{{item.user_name}}</text>
							<text class="data-item">{{item.real_password}}</text>
							<text class="data-item">{{item.create_time}}</text>
						</view>
					</view>
				</view>
				<view class="operation f-24 m-t-40 dis-flex flex-x-end" v-if="item.is_bind&&item.is_bind.value!=2">
					<template v-if="item.is_bind.value==1">
						<view class="list-btn t-c blue-btn" @tap.stop="toAdd(item.store_user_id)">编辑</view>
						<view class="list-btn t-c yellow-btn" @tap.stop="toLog(item)">操作记录</view>
						<view class="list-btn t-c" @tap.stop="unbind(item.store_user_id)">解绑</view>
					</template>
					<view v-else class="list-btn t-c red-btn" @tap="toDelete(item.store_user_id)">删除</view>
				</view>
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#f5f5f5"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30 bgf dis-flex flex-y-center">
				<view class="foot-btn f-32 col-f flex-box" @tap.stop="toAdd('')"><text class="iconfont2 icon-jiahao f-36"></text>添加店员</view>
			</view>
		</view>
		
		<tui-tips position="center" ref="toast"></tui-tips>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	import guidePage from '@/components/guide-page';
	export default {
		components:{
			popupTips,
			guidePage
		},
		data (){
			return {
				mtitle:'',
				mcontent:'',
				defaultImg:'/static/images/defaultImg.png',
				list: {},
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onShow() {
			this.page = 1;
			this.loadding= false;
			this.pullUpOn= true;
			this.getList()
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false;
			} else {
				that.page = ++that.page;
				// that.loadding = false;
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			// 获取列表
			getList (){
				let that = this;
				let data = {
					page: that.page,
				};
				app._get('shop.setting.salesclerk/lists',data, res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data.list;
					
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				});
			},
			// 解绑
			unbind(store_user_id){
				this.mtitle = '提示',
				this.mcontent = '确定解绑？';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.setting.salesclerk/unbind',{store_user_id: store_user_id}, res =>{
						this.$api.msg(res.msg);
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList()
					});
				});
			},
			// 删除
			toDelete(store_user_id){
				this.mtitle = '提示',
				this.mcontent = '确定删除？';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.setting.salesclerk/delete',{store_user_id: store_user_id}, res =>{
						this.$api.msg(res.msg);
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList()
					});
				});
			},
			toAdd(store_user_id){
				let url = 'add/index?store_user_id='+store_user_id;
				uni.navigateTo({
					url: url
				})
			},
			toLog(item){
				uni.navigateTo({
					url: 'logRecord/index?store_user_id='+item.store_user_id
				})
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
