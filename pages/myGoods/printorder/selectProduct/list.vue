<template>
	<view class="wrap30 bgf min_h_100">
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
    <radio-group @change="listChange">
			<scroll-view>
			<view class="prolist-wrap dis-flex flex-wrap" v-if="list.data!=''">
				<label class="prolist-item" v-for="(item, index) in list.data" :key="index">
					<view class="prolist-pic">
						<image lazy-load :src="item.goods.goods_image" mode="aspectFill"></image>
						<view v-if="item.checked_num>0" class="checked_num dis-flex flex-y-center flex-x-center f-28">已选{{item.checked_num}}</view>
					</view>
					<view class="prolist-info f-24" v-if="item.goods">
						<view class="prolist-name onelist-hidden col-3">{{item.goods.goods_name}}</view>
						<view class="prolist-stock col-6">库存：{{item.goods.stock_num}}</view>
						<view class="prolist-price col-6">¥{{item.goods.min_price}}</view>
					</view>
					<view v-if="source == 'rotation' || source == 'seckill'" class="prolist-add">
						<radio :value="item.goods_id + ''" color="#FF7541" />
					</view>
					<view v-else class="prolist-add" @tap="showSpecs(item, index)"><text class="iconfont2 icon-increase"></text></view>
				</label>
			</view>
			</scroll-view>
    </radio-group>
		<!--加载loadding-->
		<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
		<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#fff"></tui-nomore>
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view>暂无数据</view>
		</tui-no-data>
		<!--加载loadding-->
		<!-- 底部 -->
		<view class="bottom-wrap" v-if="checkList.length || checkItem.goods_id != ''">
			<view class="bottom wrap30">
				<view class="dis-flex flex-y-center flex-x-center f-32" @tap="toSubmit">{{source == 'rotation' || source == 'seckill' ? '确定' : '已选好（共' + checked_num + '件）'}}</view>
			</view>
		</view>
		<!-- 规格弹窗 -->
		<pop-specs ref="popSpecs"  @confirm="confirm"></pop-specs>
		<right-drawer ref="rightDrawer" @change="rightDrawerChange"></right-drawer>
		
	</view>
</template>

<script>
	const app = getApp().globalData;
	import search from '@/components/uni-search/index';
	import popSpecs from '@/components/printing/pop-specs/index';
	import rightDrawer from '../../stockTaking/rightDrawer/index';
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
				category_id: '',//分类id
				fieldName: '',
				source:'',
				iscustBill: '',
				checkItem: {
					goods_name: '',
					goods_id: '',
					goods_image: ''
				},
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
			this.fieldName = options.fieldName;
			this.source = options.source || '';
			this.iscustBill = options.iscustBill || '0'
			
			//带入的商品
			let printGoods = uni.getStorageSync('printGoods') ||[];
			this.printGoods = printGoods;
			uni.removeStorageSync('printGoods');
			
			this.$nextTick(() =>{
				this.getList();
			});
		},
		// 获取历史搜索
		onShow () {
			this.getRecentSearch();
		},
		//页面相关事件处理函数--监听用户下拉动作
		// onPullDownRefresh () {
		// 	let that = this;
		// 	//延时为了看效果
		// 	that.list = [];
		// 	that.checkList = [];
		// 	that.page = 1;
		// 	that.getList();
		// 	that.pullUpOn = true;
		// 	that.loadding = false;
		// 	uni.stopPullDownRefresh();
		// 	that.$api.msg("刷新成功")
		// },
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
			// 确认
			confirm(val, index) {
				this.list.data[index].checked_num = val.goods_num
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
					category_id: this.category_id || 0,
					search: that.searchValue || ''
				}, 
					url = 'shop.wxapp.goods/index';
				if (that.iscustBill == '1') {
					data.wxapp_id = app.wxapp_id
				}
				if (this.source == 'seckill') {
					url = 'shop.goods/searchBuiltGoods';
				}
				app._get(url, data, res => {
					that.loadding = false;
					let _list = that.list,
							data = res.data.list.data;
					if(that.page==1){
						_list = res.data.list;
					}else{
						_list.data = _list.data.concat(data);
					}
					that.list = _list;
					
					//打单带入
					if(that.printGoods&&that.printGoods.length>0){
						that.initGoodsData(that.printGoods,that.list.data)
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
					if (this.source == 'rotation' || this.source == 'seckill') {
						prevPage.$vm.proCheck(this.checkItem, this.fieldName)
					} else {
						prevPage.$vm.proCheck(checkList, this.fieldName)
					}
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
				this.loadding= false;
				this.pullUpOn= true;
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
				this.loadding= false;
				this.pullUpOn= true;
				this.getList();
			},
			// 选择
			listChange(e) {
				let goodsItem = this.list.data.find(val => {
					return val.goods_id == e.detail.value;
				});
				let checkItem = {
					goods_id: goodsItem.wxapp_goods_id,
					goods_name: goodsItem.goods.goods_name,
					goods_image: goodsItem.goods.goods_image
				}
				if(this.source=='seckill'){
					checkItem.diff_skus = goodsItem.goods.diff_skus;
				}
				this.checkItem = checkItem;
			},
			//初始化已选中的商品
			initGoodsData(checkList, goods_list){
				for (let i = 0; i < checkList.length; i++) {
					for (let j = 0; j < goods_list.length; j++) {
						let item = goods_list[j];
						if(checkList[i].wxapp_goods_id == item.wxapp_goods_id){
							let val = {};
							if(checkList[i].goods.spec_type==20){
								val = {
									spec_type: 20,
									goods_num: this.calcNum(checkList[i].goods.goods_multi_spec.spec_list),
									goodsMultiSpec: checkList[i].goods.goods_multi_spec
								};
							}else{
								val = {
									spec_type: 10,
									goods_num: checkList[i].checked_num
								};
							}
							this.confirm(val,j)
							this.$nextTick(() => {
								this.printGoods.splice(i,1)
							});
						}
					}
				}
			},
			calcNum(sku){
				let num = 0;
				for (let i in sku) {
					if(sku[i].goods_num&&sku[i].goods_num>0){
						num += Math.abs(sku[i].goods_num)
					}
				}
				return num
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import 'search.scss';
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