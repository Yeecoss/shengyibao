<template>
	<view class="bgf8 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar lLidth="width:60rpx" extClass="nav">
			  <view slot="center" class="left-title onelist-hidden t-l flex-box">#{{title}}</view>
		</navigationBar>
		<view class="top-bg"></view>
		<!-- 搜索框 -->
		<view class="wrap30 search-wrap">
			<search @search="search" placeholder="搜索你想找的商品"></search>
		</view>
		<view class="main wrap30">
			<product-water ref="waterfall" :list="list.data"></product-water>
		</view>
		<!--加载loadding-->
		<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
		<tui-nomore v-if="!pullUpOn&&list.data!=''" backgroundColor="#f8f8f8"></tui-nomore>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import productWater from '@/components/waterfall/product-water.vue';
	export default {
		components: {
			search,
			productWater
		},
		data() {
			return {
				title:'',
				keyword:'',
				list: '',
				page: 1,
				loadding: false,
				pullUpOn: true,
			}
		},
		onLoad(options) {
			this.title = options.tag || '';
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
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			// 获取列表
			getList (){
				let that = this;
				let data = {
					short_name: that.keyword,
					tag_name: that.title,
					wxapp_id: app.wxapp_id
				};
				app._get('shop.wxapp.goods/searchTagGoods', data,res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data;
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
				});
			},
			search(val){
				this.keyword = val ||'';
				this.page = 1;
				this.list = '';
				this.getList();
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
