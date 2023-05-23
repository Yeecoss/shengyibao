<template>
	<view class="wrap30">
		<!-- 自定义标题栏 -->
		<navigationBar title="选择商品" extClass="nav" id="top"></navigationBar>
		<!-- 搜索框 -->
		<view>
			<search :value="searchValue" @search="search" placeholder="商品名称/货号/条形码" placeStyle="color:#999;font-size:24rpx;"></search>
		</view>
		<!-- 历史搜索 -->
		<view class="recentSearch" v-if="recentOrder.length">
			<view class="title-box col-3 dis-flex flex-y-center flex-x-between">
				<text class="f-28">历史搜索</text>
				<view @tap="clearSearch" class="iconfont2 icon-shanchu f-24"></view>
			</view>
			<view class="sale-button-box">
				<view class="seconds-kill-li" v-for="(recent, idx) in recentOrder" :key="idx">
					<view @tap="goSearch(recent)" class="recent-button col-6">{{recent}}</view>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="list-tab dis-flex flex-y-center">
			<view class="list-tab-item" :class="tabon==0?'on':''" @tap="changeTab(0)">热销</view>
			<view class="list-tab-item" :class="tabon==1?'on':''" @tap="changeTab(1)">推荐</view>
			<view class="list-tab-item" :class="tabon==2?'on':''" @tap="changeTab(2)">全部</view>
		</view>
		<view class="prolist-wrap dis-flex flex-wrap" v-if="list.data!=''">
			<view class="prolist-item" v-for="(item, index) in list.data" :key="index">
				<view class="prolist-pic">
					<image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image>
					<view v-if="item.checked_num>0" class="checked_num dis-flex flex-y-center flex-x-center f-28">已选{{item.checked_num}}</view>
				</view>
				<view class="prolist-info f-24">
					<view class="prolist-name onelist-hidden col-3">{{item.goods.goods_name}}</view>
					<view class="prolist-stock col-6">库存：{{item.goods.stock_num}}</view>
					<view class="prolist-price col-6">¥{{item.goods.min_price}}</view>
				</view>
				<view class="prolist-add" @tap="showSpecs(item, index)"><text class="iconfont2 icon-increase"></text></view>
			</view>
		</view>
		<!--加载loadding-->
		<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
		<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#fff"></tui-nomore>
		<tui-no-data v-if="list.data==''" imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264">
			<view>暂无数据</view>
		</tui-no-data>
		<!--加载loadding-->
		<!-- 底部 -->
		<view class="bottom-wrap" v-if="checkList.length">
			<view class="bottom wrap30">
				<view class="dis-flex flex-y-center flex-x-center f-32" @tap="toSubmit">已选好（共{{checked_num}}件）</view>
			</view>
		</view>
		
		<!-- 规格弹窗 -->
		<pop-specs ref="popSpecs" @confirm="confirm"></pop-specs>
		
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import popSpecs from '@/components/printing/pop-specs/index';
	export default {
		components: {
			search,
			popSpecs,
		},
		data() {
			return {
				recentOrder: [],
				searchValue: '',
				tabon: 0,//默认显示热销商品
				list: [],
				checkList: [],//选择的商品列表
				page: 1,
				loadding: false,
				pullUpOn: true,
				checked_num: 0,
				
			}
		},
		onLoad(options) {
			this.source = options.source || '';
		},
		// 获取历史搜索
		onShow: function () {
			this.getList();
			this.getRecentSearch();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			let that = this;
			//延时为了看效果
			that.list = [];
			that.checkList = [];
			that.page = 1;
			that.getList();
			that.pullUpOn = true;
			that.loadding = false;
			uni.stopPullDownRefresh();
			that.$api.msg("刷新成功")
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
			that.loadding = true;
			if (that.page >= that.list.last_page) {
				that.loadding = false;
				that.pullUpOn = false
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			confirm(val, index) {
				this.list.data[index].checked_num = val.goods_num;
				if (val.spec_type == 20) {
					this.list.data[index].goods.goods_multi_spec = val.goodsMultiSpec
				}
				let num = 0;
				this.checkList = this.list.data.filter(item => {
					if(item.checked_num > 0){
						num = num +item.checked_num
						return item
					}
				});
				this.checked_num = num;
			},
			// 选择提交
			toSubmit(){
				let that = this;
				that.pageBack(that.checkList);
			},
			// 获取列表
			getList (){
				let that = this;
				let data = {
					page: that.page,
					// sortType: that.tabon==0?'hot' :'recommend',
					sortPrice: 0,
					category_id: 0,
					search: that.searchValue || ''
				}, 
					url = 'shop.wxapp.goods/index';
				if(that.searchValue == ''){ 
					data.sortType = that.tabon==0?'hot' :'recommend';
				}else{ 
					data.sortType = ''; 
				}
				if(that.tabon==0){ 
					data.is_hot = '1';
				}
				if(that.tabon==1){ 
					data.shop_rmd = '1'; 
				}
				app._get(url, data, res => {
					that.loadding = false;
					let _list = that.list,
							data = res.data.list.data;
					data.forEach(element => {
						element.checked_num = 0
					});
					if(that.page==1){
						_list = res.data.list;
					}else{
						_list.data = _list.data.concat(data);
					}
					that.list = _list;
				});
				
			},
			// tab切换
			changeTab(id){
				let that =this;
				that.page = 1;
				that.loadding= false;
				that.pullUpOn= true;
				that.tabon = id;
				that.checkList = [];
				that.getList();
			},
			// 搜索提交
			search (e) {
				this.searchValue = e;
				if (this.searchValue) {
					// 记录最近搜索
					let recentOrder = wx.getStorageSync('recentOrder') || [];
					let index = recentOrder.indexOf(this.searchValue);
					index > -1 && recentOrder.splice(index, 1);
					recentOrder.unshift(this.searchValue);
					wx.setStorageSync('recentOrder', recentOrder); 
					// 跳转到商品列表页
					wx.redirectTo({
					  url: '/pages/myGoods/printorder/selectProduct/list?search=' + this.searchValue
					});
				}
			},
			// 跳转到最近搜索
			goSearch: function (e) {
			  wx.redirectTo({
			    url: '/pages/myGoods/printorder/selectProduct/list?search=' + e
			  });
			},
			//获取历史搜索
			getRecentSearch () {
				let recentOrder = wx.getStorageSync('recentOrder');
				this.setData({
					recentOrder
				});
			},
			//清空最近搜索记录
			clearSearch: function () {
				wx.removeStorageSync('recentOrder');
				this.getRecentSearch();
			},
			//打开规格弹窗
			showSpecs(item, index){
				let data = {
					goods: item,
					index: index,
				}
				if (this.source == 'refundOrder') {
					data.noMax = true
				}
				this.$refs.popSpecs._open(data);
			},
			//返回
			pageBack(checkList){
				// 返回上一页传递选中的数据
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2]; //上一个页面
				if(prevPage.$vm.proCheck){
					prevPage.$vm.proCheck(checkList)
				}
				uni.navigateBack();
			},
		}
	}
</script>

<style lang="scss">
	@import 'search';
</style>
