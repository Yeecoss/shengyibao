<template>
	<view class="wrap30">
		<!-- 自定义标题栏 -->
		<navigationBar title="选择商品" extClass="nav" id="top"></navigationBar>
		<!-- 搜索框 -->
		<view class="dis-flex flex-y-center flex-x-between">
			<search class="flex-box" :value="searchValue" @search="searchList" placeholder="商品名称/货号/条形码"></search>
			<view class="cate_btn f-28 col-3" @tap.stop="screen"><text class="iconfont2 icon-preparation m-r-10"></text>分类</view>
		</view>
		<!-- 历史搜索 -->
		<view class="recentSearch" v-if="recentOrder.length">
			<view class="title-box col-3 dis-flex flex-y-center flex-x-between">
				<text class="f-28">历史搜索</text>
				<view @tap="clearSearch" class="iconfont2 icon-shanchu f-24"></view>
			</view>
			<view class="sale-button-box">
				<view class="seconds-kill-li" v-for="(recent, idx) in recentOrder" :key="idx">
					<view @tap="searchList(recent)" class="recent-button col-6">{{recent}}</view>
				</view>
			</view>
		</view>
		<!-- 列表 -->
		<view class="prolist-wrap dis-flex flex-wrap" v-if="list.data!=''">
			<view class="prolist-item" v-for="(item, index) in list.data" :key="index" @tap="showSpecs(item, index)">
				<view class="prolist-pic">
					<image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image>
					<view v-if="item.checked_num>0||item.checked_num<0" class="checked_num dis-flex flex-y-center flex-x-center f-28">已选{{item.checked_num}}</view>
				</view>
				<view class="prolist-info f-24" v-if="item.goods">
					<view class="prolist-name onelist-hidden col-3">{{item.goods.goods_name}}</view>
					<view class="prolist-stock col-6">库存：{{item.goods.stock_num}}</view>
					<view class="prolist-price col-6">¥{{item.goods.min_price}}</view>
				</view>
				<view class="prolist-add"><text class="iconfont2 icon-increase"></text></view>
			</view>
		</view>
		<!--加载loadding-->
		<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
		<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#fff"></tui-nomore>
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view>暂无数据</view>
		</tui-no-data>
		<!--加载loadding-->
		<!-- 底部 -->
		<view class="bottom-wrap" v-if="checkList.length">
			<view class="bottom wrap30">
				<view class="dis-flex flex-y-center flex-x-center f-32" @tap="toSubmit">已选好（共  {{checked_num}}  件）</view>
			</view>
		</view>
		<!-- 规格弹窗 -->
		<pop-specs ref="popSpecs" @confirm="confirm"></pop-specs>
		<right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import popSpecs from '../pop-specs/index';
	import rightDrawer from '../rightDrawer/index';
	export default {
		components: {
			search,
			popSpecs,
			rightDrawer
		},
		data() {
			return {
				recentOrder: [],
				searchValue: '',
				source:'',
				category_id: '',//分类id
				list: [],
				checkList: [],//选择的商品列表
				page: 1,
				loadding: false,
				pullUpOn: true,
				checked_num: 0,
			}
		},
		onLoad(options) {
			this.searchValue = options.search;
			this.source = options.source || '';
			let stockGoods = uni.getStorageSync('stockGoods');
			this.stockGoods = stockGoods;
			uni.removeStorageSync('stockGoods');//uni.setStorageSync('stockGoods', []);
			// this.checkList = JSON.parse(decodeURIComponent(options.checkList))//JSON.parse(decodeURIComponent(options.checkList)) || [];
			
			this.getList();
		},
		// 获取历史搜索
		onShow () {
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
				this.list.data[index].checked_num = val.goods_num
				if (val.spec_type == 20) {
					this.list.data[index].goods.goods_multi_spec = val.goodsMultiSpec
				}
				let num = 0;
				this.checkList = this.list.data.filter(item => {
					if(item.checked_num > 0 ||item.checked_num < 0){
						num = num + Math.abs(item.checked_num)
						return item
					}
				});
				this.checked_num = num;
			},
			// 选择提交
			toSubmit(){
				let that = this;
				let data = {
					wxapp_goods: JSON.stringify(that.getGoods(that.checkList))
				};
				that.$nextTick(() => {
					app._post_form('shop.goods.stock_check/form', data, res => {
						let obj = {
							goods: res.data.wxapp_goods,
							finish_stock_num: res.data.finish_stock_num
						}
						that.pageBack(JSON.stringify(obj));
					});
				})
			},
			// 获取列表
			getList (){
				let that = this;
				let data = {
					page: that.page,
					category_id: that.category_id || 0,
					search: that.searchValue || ''
				}, 
					url = 'shop.wxapp.goods/index';
				app._get(url, data, res => {
					that.loadding = false;
					let _list = that.list,
							data = res.data.list;
					if(that.page==1){
						_list = data;
					}else{
						_list.data = _list.data.concat(data.data);
					}
					that.list = _list;
					if(that.stockGoods){
						that.initGoodsData(that.stockGoods,that.list.data)
					}
				});
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
			searchList (e) {
				this.searchValue = e;
				if (this.searchValue) {
					// 记录最近搜索
					let recentOrder = wx.getStorageSync('recentOrder') || [];
					let index = recentOrder.indexOf(this.searchValue);
					index > -1 && recentOrder.splice(index, 1);
					recentOrder.unshift(this.searchValue);
					wx.setStorageSync('recentOrder', recentOrder); 
				}
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList();
				this.getRecentSearch();
			},
			//获取历史搜索
			getRecentSearch () {
				let recentOrder = wx.getStorageSync('recentOrder');
				this.recentOrder = recentOrder;
			},
			//清空最近搜索记录
			clearSearch () {
				wx.removeStorageSync('recentOrder');
				this.getRecentSearch();
			},
			//打开筛选框
			screen() {
			  this.$refs.rightDrawer.screen(app.myShopInfo.wxapp_id)
			},
			//筛选框确定
			rightDrawerChange(obj) {
				this.page = 1;
				this.category_id = obj.category_id;
				this.pullUpOn = true;
				this.loadding = false;
				this.getList();
			},
			// 格式选中相关商品
			getGoods(list){
				let goods_list = [];
				for (let i in list) {
					let goods = {};
					goods.goods_id = list[i].goods_id;
					goods.wxapp_goods_id = list[i].wxapp_goods_id;
					
					if(list[i].goods.spec_type==20){
						goods.sku = [];//选中的规格id列表
						
						let spec_attr = list[i].goods.goods_multi_spec.spec_attr;
						let spec_list = list[i].goods.goods_multi_spec.spec_list;
						
						for (let i2 in spec_list) {
							if(spec_list[i2].goods_num > 0 || spec_list[i2].goods_num < 0){
								let item_spec = {};
								item_spec.spec_sku_id = spec_list[i2].spec_sku_id;
								item_spec.goods_sku_id = spec_list[i2].goods_sku_id;
								item_spec.change_num = spec_list[i2].goods_num;
								goods.sku.push(item_spec);
							}
						}
					}else{
						if(list[i].checked_num > 0 || list[i].checked_num < 0){
							goods.change_num = list[i].checked_num;
							goods.goods_sku_id = list[i].goods.goods_sku.goods_sku_id;
						}
					}
					goods_list.push(goods);
				}
				return goods_list;
			},
			//初始化已选中的商品
			initGoodsData(checkList, goods_list){
				for (let i = 0; i < checkList.length; i++) {
					for (let j = 0; j < goods_list.length; j++) {
						let item = goods_list[j];
						if(checkList[i].wxapp_goods_id == goods_list[j].wxapp_goods_id){
							let val = {};
							if(checkList[i].sku){
								val = {
									spec_type: 20,
									goods_num: this.calcNum(checkList[i].sku),
									goodsMultiSpec: this.calcGoodsMultiSpec(checkList[i].sku,goods_list[j].goods.goods_multi_spec)
								};
							}else{
								val = {
									spec_type: 10,
									goods_num: checkList[i].change_num
								};
							}
							this.confirm(val,j)
						}
					}
				}
			},
			calcNum(sku){
				let num = 0;
				for (let i in sku) {
					num += Math.abs(sku[i].change_num)
				}
				return num
			},
			calcGoodsMultiSpec(sku,goods_multi_spec){
				let spec_attr = goods_multi_spec.spec_attr;
				let spec_list = goods_multi_spec.spec_list;
				for (let i in sku) {
					for (let j in spec_list) {
						if(sku[i].goods_sku_id == spec_list[j].goods_sku_id){
							spec_list[j].goods_num = sku[i].change_num
						}
					}
				}
				return goods_multi_spec
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'list.scss';
	.navigator-hover{
		background: none;
		opacity: 1;
	}
	radio{
		transform:scale(0.7);
		transform-origin:50% 90%;
	}
	.prolist-wrap{padding-top: 30rpx;}
</style>