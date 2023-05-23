<template>
	<view>
		<!-- 自定义标题栏 -->
		<navigationBar :title="navtitle" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<view class="list-wrap pad_lr30 bgf m-top20">
				<view class="list dis-flex flex-wrap" v-for="(item, index) in logistics" :key="index">
					<view class="list-title f-32 col-3">{{item.title}}</view>
					<view class="list-item f-28" :class="checkItem.express_id==vo.express_id?'checked':''" v-for="(vo,i) in item.list" :key="vo.express_id" @tap="change(vo)">
						{{vo.express_name}}
					</view>
				</view>
			</view>
			<!-- 搜索 -->
			<view class="search-wrap pad_lr30 bgf m-top20">
				<view class="search dis-flex flex-x-between">
					<input type="text" v-model="searchVal" placeholder="找不到搜索一下" placeholder-class=""/>
					<view class="search-btn f-28" @tap="search">搜索</view>
				</view>
				<view class="search-list dis-flex flex-wrap">
					<view class="list-item f-28" :class="checkItem.express_id==item.express_id?'checked':''" v-for="(item,index) in searchList" :key="item.express_id" @tap="change(item)">
						{{item.express_name}}
					</view>
				</view>
					<view class="saler_nodata p-bottom" v-if="searchList=='' && isSearch">
						<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :fixed="false" :imgWidth="264" :imgHeight="264">
							<view class="col-9">暂无搜索数据</view>
						</tui-no-data>
					</view>
			</view>
			
		</view>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toSubmit">确定</view>
			</view>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	import fieldList from "@/components/field-list/index.vue";
	export default {
		components: {
			fieldList,
		},
		data() {
			return {
				navtitle: '添加物流公司',
				index: 1,//提示框{express_name:'圆通速递',express_id: 10005},{express_name:'天天快递',express_id: 10009},{express_name:'宅急送',express_id: 10013},
				type: 1,//默认新增{express_name:'安能物流',express_id: 10020},{express_name:'天地华宇',express_id: 10086},{express_name:'中铁物流',express_id: 10303},{express_name:'壹米滴答',express_id: 10223},
				logistics: [{
					title: '常用快递',
					list: [{express_name:'顺丰速运',express_id: 10001},{express_name:'中通快递',express_id: 10003},{express_name:'申通快递',express_id: 10004},{express_name:'百世快递',express_id: 10002},{express_name:'韵达速递',express_id: 10006},]
				},{
					title: '常用物流',
					list: [{express_name:'德邦物流',express_id: 10012},]
				},],
				checkItem: '',//选中的
				searchVal: '',
				searchList: [],
				isSearch: false,
				express_order: 0,
			}
		},
		onLoad(options) {
			let that = this;
			that.express_order = options.express_order || 0;
		},
		methods: {
			// 提交
			toSubmit(){
				let that = this;
				if(that.checkItem){
					// app._post_form('shop.express/add', {express_id: that.checkItem.express_id}, res => {
					// 		that.$api.msg(res.msg);
					// 	if(res.code==1){
					// 		setTimeout(() => {uni.navigateBack();},1500)
					// 	}
					// });
					that.pageBack(that.checkItem);
				}else{
					that.$api.msg('选择不能为空!');
				}
			},
			//搜索物流公司
			search(){
				let that = this;
				let data = {
					keyword: that.searchVal
				};
				if(that.express_order==1){
					data.express_order = that.express_order
				}
				app._get('shop.order/getExpressList', data, res => {
					that.searchList = res.data.list;
					that.isSearch = true;
				})
			},
			// 选中
			change(item) {
				this.checkItem = this.checkItem == item ? '': item;
			},
			//返回
			pageBack(data){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.expressChange){
					prevPage.$vm.expressChange(data)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import 'index';
</style>
