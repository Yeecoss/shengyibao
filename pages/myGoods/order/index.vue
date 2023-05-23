<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar :title="title" isHelpme extClass="nav" id="top"></navigationBar>
		<!-- 搜索框 -->
		<view class="bgf search">
			<search :value="searchValue" @search="search" placeholder="搜索" placeStyle="color:#999;font-size:24rpx;">
				<view class="scan col-9" @tap.stop="scanCode" slot="right">
					<text class="iconfont2 icon-Scan f-30"></text>
				</view>
			</search>
		</view>
		<view class="main p-b-30" v-if="list.data!=''">
			<view class="list_wrap">
				<!-- 普通订单 -->
				<view class="list-item bgf pad_lr30" v-for="(item, index) in list" :key="index">
					<view class="list-top dis-flex flex-y-center flex-x-between">
						<view class="user col-3 f-32 dis-flex flex-y-center oh">
							<template v-if="item.user">
								<view class="user_img m-r-10 oh"><image :src="item.user.avatarUrl" mode="aspectFill"></image></view>
								<view class="dis-flex flex-dir-column flex-x-between">
									<text class="user_name onelist-hidden">{{item.user.nickName}}</text>
									<view class="m-t-10 dis-flex">
										<text class="distribution iconfont2 icon-channel m-r-10 f-30" v-if="item.order_type_arr.indexOf(2) != -1"></text>
										<text class="selling iconfont2 icon-Directselling m-r-10 f-30" v-if="item.order_type_arr.indexOf(1) != -1"></text>
										<view v-if="item.order_source==40" class="order-tag f-24 col-f t-c m-r-10">赚</view>
										<view v-if="item.user_operate&&item.user_operate!=''" class="order-tag1 f-24" @tap.stop="lookClerk(item.user_operate)">店员<text class="iconfont2 icon-more4 f-22"></text></view>
									</view>
								</view>
							</template>
						</view>
						<view class="t-r flex-box">
							<view class="order-no col-3 f-26">订单号：{{item.order_no}}</view>
							<view class="col-3 f-26 m-top10">下单时间：{{item.create_times}}</view>
						</view>
					</view>
					<view v-for="(items, indexs) in item.suborder" :key="indexs">
						<view class="laiyuan">
							<view class="flex-box seller_name f-28 col-3 onelist-hidden" v-if="(items.order_type==1)&&(items.dealer_seller_wxapp_name)">（来源：{{items.dealer_seller_wxapp_name||''}})</view><!-- a -->
						</view>
						<view v-for="(item1, index1) in items.goods" :key="index1" class="pro dis-flex flex-x-between" :class="index1==0?'no-m-t':''" @tap.stop="toDetail(item)">
							<view class="pro_img">
								<image lazy-load :src="item1.file_path" mode="aspectFill"></image>
							</view>
							<view class="pro_info">
								<view class="twolist-hidden col-3 f-28 pro_name">{{item1.goods_name}}</view>
								<view class="col-6 f-26 norm">规格：{{item1.goods_attr||'无'}}</view>
							</view>
							<view class="pro-r flex-box">
								<!-- <view class="col-3 f-26">¥{{item1.total_pay_price}}</view> -->
								<view class="col-3 f-26">¥{{item1.goods_price}}</view>
								<view class="col-3 f-26">X{{item1.total_num}}</view>
								<view class="color_red f-26 pro_state">{{items.order_status.text}}</view>
							</view>
						</view>
					</view>
					<!-- 操作按钮 -->
					<view class="operation-wrap dis-flex flex-y-center flex-x-between">
						<view class="col-3 f-26">{{item.address ? item.address.name : ''}} {{item.address ? item.address.phone : ''}}</view>
						<view class="operation dis-flex flex-y-center flex-wrap flex-x-end">
							<template v-if="item.order_status&&(item.order_status.value==20||item.order_status.value==30)">
								<view class="oper-item f-24" @tap.stop="deleteOrder(item)">删除订单</view>
							</template>
							<view class="oper-item f-24" @tap.stop="toDetail(item)">订单详情</view>
							<view v-if="item.confirm_pay_button" class="oper-item f-24 oper-red" @tap.stop="toModel1(item)">确认收款</view>
						</view>
					</view>
				</view>
				
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.length!=0) || page==last_page" backgroundColor="#f5f5f5"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.length == 0">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<popup-tips ref="popupTip" :title="mtitle" :content="mcontent"></popup-tips>
		<!-- 收款/赊账弹窗 -->
		<popup-tips ref="sheTips" type="custom" @tipsCallback="toModel" confirmText="确定">
			<view class="sheTab f-32 tb-lr-center">
				<view class="col-9" :class="sheTab==1?'on':''" @tap.stop="sheTabChange(1)">已付款</view>
				<view class="col-9" :class="sheTab==2?'on':''" @tap.stop="sheTabChange(2)">赊账</view>
			</view>
			<view class="mcontent szMoney">
				<input v-if="sheTab==2" class="f-28 bgf8" type="text" v-model="szMoney" placeholder="请输入赊账金额"/>
			</view>
		</popup-tips>
		<!-- 收款提示Model -->
		<popup-tips ref="popupTips" type="custom" @tipsCallback="toShouQian" confirmText="确认">
			<view class="f-32 col-3 tb-lr-center">确认已收款</view>
			<view class="mcontent f-30 col-3">
				<view class="f-30 col-3">确认已接收顾客资金，确认后状态同步通知顾客！</view>
				<view class="f-30 col-9 dis-flex flex-y-center flex-x-end">
					<view class="duihao" :class="!isModel? 'duihao_red':''" @tap.stop="toCheck">
						<text v-show="!isModel" class="iconfont2 icon-duihao f-28 f-w app-red"></text>
					</view>
					不再提示
				</view>
			</view>
		</popup-tips>
		<loading ref="loading" v-if="showLoad"></loading>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	let app = getApp().globalData;
	const util = require('@/utils/util');
	import popupTips from '@/components/popup-tips/index';
	import loading from '@/components/loading';
	import search from '@/components/uni-search/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			popupTips,
			loading,
			search,
			guidePage
		},
		data() {
			return {
				defaultImg:'https://pic.kaidanxia.com/2020-09-01/202009011505247912a9701.png',
				showLoad: true,
				title: '待处理',
				order_status: '',//订单状态
				last_page: '',
				list: {},
				page: 1,
				loadding: false,
				pullUpOn: true,
				searchValue: '',
				wxapp:{},//会员信息
				
				isModel: true,//是否显示收款提示
				mtitle:'',//提示标题
				mcontent:'',//提示内容
				sheTab: 1,
				szMoney:'',
				checkedOrder: '',
			}
		},
		onLoad(options) {
			this.order_status = options.status;
			if (this.order_status == '10') {
				this.title = '待处理'
			} else if (this.order_status == '20') {
				this.title = '已完成'
			} else if (this.order_status == '30') {
				this.title = '已取消'
			} else if (this.order_status == '50') {
				this.title = '已发货'
			} else {
				this.title = '全部订单'
			}
			
			this.isModel = uni.getStorageSync('isModel')===''? true : uni.getStorageSync('isModel');
			this.getWxappData();
		},
		onShow() {
			this.page = 1;
			this.loadding= false;
			this.pullUpOn= true;
			this.getList();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			//延时为了看效果
			setTimeout(() => {
				this.list = [];
				this.page = 1;
				this.getList();
				this.pullUpOn = true;
				this.loadding = false;
				uni.stopPullDownRefresh();
				this.$api.msg('刷新成功!');
			}, 200)
		},
		// 上拉加载下一页
		onReachBottom () {
			let that = this;
			if (!that.pullUpOn) return;
				that.loadding = true;
			if (that.page >= that.last_page) {
				that.loadding = false;
				that.pullUpOn = false
			} else {
				that.page = ++that.page;
				that.loadding = true;
				that.getList();
			}
		},
		methods: {
			//获取列表
			getList(){
				let data = {
					page: this.page,
					order_status: this.order_status,
					search: this.searchValue || ''
				};
				app._get('shop.order/getOrderList', data, res => {
					this.loadding = false
					let _list = this.list;
					let data = res.data.list;
					this.last_page = data.last_page;
					for (let k in data.data) {
						data.data[k].create_times = data.data[k].create_time.substring(0, 16);
					}
					if(this.page==1){
						_list = data.data;
					}else{
						_list = _list.concat(data.data);
					}
					this.list = _list;
					this.showLoad = false;
					// this.$refs.loading._hide();
				});
			},
			//删除订单
			deleteOrder(item){
				this.mtitle = '删除订单';
				this.mcontent = '是否确认删除此订单？';
				this.$refs.popupTip.open(() => {
					app._post_form('shop.order/delete', {
						order_no: item.order_no
					}, res => {
						this.$api.msg(res.msg)
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList();
					});
				})
			},
			// 详情
			toDetail (item){
				uni.navigateTo({
					url: 'detail/index?order_no='+item.order_no
				})
			},
			//确认收款
			toShouQian(){
				let data = {
					order_no: this.checkedOrder.order_no,
					pay_type: this.sheTab
				};
				if(this.sheTab==2){
					data.user_id = this.checkedOrder.user.user_id;
					data.money = this.szMoney;
					data.dealer_wxapp_id = this.checkedOrder.suborder[0].seller_wxapp_id
				}
				app._post_form('shop.order/comfirmPay', data, res => {
					this.$api.msg(res.msg)
					this.page = 1;
					this.loadding= false;
					this.pullUpOn= true;
					this.getList();
					this.money = '';
					this.checkedOrder = '';
					this.sheTab = 1;
				});
			},
			//打开收款/赊账弹窗
			toModel1(item){
				this.checkedOrder = item;
				let dealer_wxapp_id = this.checkedOrder.suborder[0].dealer_wxapp_id || '',
						seller_wxapp_id = this.checkedOrder.suborder[0].seller_wxapp_id || '';
				if(this.wxapp.vip==4 && (dealer_wxapp_id != seller_wxapp_id) && dealer_wxapp_id==app.myShopInfo.wxapp_id){
					this.$refs.sheTips.open();
				}else{
					this.toModel()
				}
			},
			//打开确认收款
			toModel(){
				if(this.sheTab==2){
					this.toShouQian();
				}else{
					if(this.isModel){
						this.$refs.popupTips.open();
					}else{
						this.toShouQian();
					}
				}
			},
			//不再提示
			toCheck(){
				this.isModel = !this.isModel;
				uni.setStorageSync('isModel', this.isModel);
			},
			// 切换收款方式
			sheTabChange(id){
				this.sheTab = id
			},
			//会员信息
			getWxappData() {
				app._get('user.index/vipDetail', {}, (result) => {
					if (result.code == '1') {
						let data = result.data.userInfo || {}
						data.vip_expireText = data.vip_expire ? data.vip_expire.substring(0, 10) : ''
						this.wxapp = data
					}
				})
			},
			// 搜索提交
			search (e) {
				this.searchValue = e;
				this.page = 1;
				this.loadding= false;
				this.pullUpOn= true;
				this.getList();
			},
			//扫码
			scanCode(){
				let types = ['QR_CODE','DATA_MATRIX','PDF_417','WX_CODE'];
				uni.scanCode({
					scanType: ['barCode'],
					success: (res) => {
						if(types.indexOf(res.scanType) == -1){
							this.searchValue = res.result;
							util.music.play_dede()
							this.page = 1;
							this.loadding= false;
							this.pullUpOn= true;
							this.getList();
						}
					}
				});
			},
			// 查看店员
			lookClerk(user_operate){
				
				let obj = {};
				let peon = user_operate.reduce((cur,next) => {
				    obj[next.real_name] ? "" : obj[next.real_name] = true && cur.push(next);
				    return cur;
				},[]);
				
				let name = peon.map((obj,index) =>{
						return obj.real_name;
				}).join(",");
				this.$api.msg('参与店员：'+name)
				// uni.showModal({
				// 	title: '店员昵称',
				// 	content: '店员昵称昵称',
				// 	showCancel:false,
				// 	confirmColor: '#FF7541'
				// })
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
