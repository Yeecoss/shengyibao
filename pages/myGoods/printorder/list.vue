<template>
	<view class="bgf7">
		<!-- 自定义标题栏 -->
		<navigationBar title="打单/快递" isHelpme extClass="nav" id="top"></navigationBar>
		<view class="topwrap">
			<view class="top_main">
				<tui-tabs :tabs="navbar" :currentTab="tabOn" @change="changeTab" itemWidth="50%" color="#333" selectedColor="#FF7541" :height="88" :sliderWidth="110" :size="30" :padding="0" :sliderHeight="4" sliderBgColor="#FF7541"></tui-tabs>
				<!-- 搜索框 -->
				<view class="bgf search">
					<search :value="searchValue" @search="search" placeholder="搜索" placeStyle="color:#999;font-size:24rpx;">
						<view class="scan col-9 p-l-10 p-r-10" @tap.stop="scanCode" slot="right">
							<text class="iconfont2 icon-Scan f-30"></text>
						</view>
					</search>
				</view>
			</view>
		</view>
		<view class="main" v-if="list.data!=''">
			<view class="list_wrap">
				<!-- 打单 -->
				<view class="list-item bgf pad_lr30" v-for="(item, index) in list.data" :key="index" @tap.stop="toDetail(item.express_order_id)">
					<view class="list-top dis-flex flex-y-center flex-x-between">
						<view class="order-no dis-flex flex-y-center col-3 f-26">
							<text v-if="item.express_type==4" class="iconfont2 icon-makeanappointment m-r-10 f-32 tag tag_red"></text>
							<text v-else class="iconfont2 icon-Outlets m-r-10 f-32 tag"></text>
							<template v-if="tabOn==0">
								订单号：{{item.order_no}}
								<text class="m-l-10 col-3 iconfont2 icon-copy2 f-30 p-l-10 p-t-10 p-b-10 p-r-10 dis-block" @tap.stop="clipboard(item.order_no)"></text>
							</template>
							<template v-else>
								<template v-if="item.express_type==4">
									{{item.express.express_name?item.express.express_name+'：':''}}{{item.express_no}}
								</template>
								<template v-else>
									{{item.customer&&item.customer.express_name?item.customer.express_name+'：':''}}{{item.express_no}}
								</template>
								<text v-if="item.express_no" class="m-l-10 col-3 iconfont2 icon-copy2 f-30 p-l-10 p-t-10 p-b-10 p-r-10 dis-block" @tap.stop="copy(item)"></text>
							</template>
						</view>
						<view class="order-status f-30 color_red">{{item.status.text}}</view>
					</view>
					<!-- 地址 -->
					<view class="address-wrap wrap30 bgf">
						<view class="address dis-flex flex-y-center flex-x-between">
							<view class="address-type f-26 col-f bgred">寄</view>
							<view class="address-r dis-flex flex-y-center">
								<view class="address-info">
										<view class="f-24 col-6">{{item.sender.name}}  {{item.sender.phone}}</view>
										<view class="f-24 col-6 onelist-hidden m-top10">
											{{item.sender.region.province}} {{item.sender.region.city}} {{item.sender.region.region}} {{item.sender.detail}}
										</view>
								</view>
							</view>
						</view>
						<view class="address dis-flex flex-y-center flex-x-between">
							<view class="address-type f-26 col-f">收</view>
							<view class="address-r dis-flex flex-y-center">
								<view class="address-info">
										<view class="f-24 col-6">{{item.receiver.name}}  {{item.receiver.phone}}</view>
										<view class="f-24 col-6 onelist-hidden m-top10">
											{{item.receiver.region.province}} {{item.receiver.region.city}} {{item.receiver.region.region}} {{item.receiver.detail}}
										</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 关联商品 -->
					<template v-if="item.wxapp_goods.length>1">
						<view class="pro_relate dis-flex flex-y-center flex-x-between m-top30">
							<view class="pro_r dis-flex">
								<template v-for="(vo,k) in item.wxapp_goods">
									<view class="pro_r_img" :key="vo.wxapp_goods_id" v-if="k<4">
										<image lazy-load :src="vo.wxapp_good.goods.goods_image" mode="aspectFill"></image>
									</view>
								</template>
							</view>
							<view class="pro_r_more f-28 col-3">
								共{{item.total_num}}件 <text class="iconfont2 icon-gengduobeifen2 f-28"></text>
							</view>
						</view>
					</template>
					<template v-else>
						<view class="pro_relate dis-flex flex-y-center flex-x-between m-top30" v-for="(vo,k) in item.wxapp_goods" :key="vo.goods_id">
							<view class="dis-flex">
								<view class="pro_r_img">
									<image lazy-load :src="vo.wxapp_good.goods.goods_image" mode="aspectFill"></image>
								</view>
								<view class="pro_r_info">
									<view class="onelist-hidden col-3 f-28">{{vo.wxapp_good.goods.goods_name}}</view>
									<view class="onelist-hidden col-6 f-26 m-top10" v-if="vo.sku">
										<template v-for="(vv,ii) in vo.sku">
											<text :key="ii">{{vv.goods_sku?vv.goods_sku.goods_attr+'*':''}}</text>{{vv.goods_num}}
										</template>
									</view>
									<view class="onelist-hidden col-6 f-26 m-top10" v-else>{{vo.goods_num}}</view>
								</view>
							</view>
						</view>
					</template>
					<!-- 操作按钮 -->
					<view class="operation-wrap dis-flex flex-y-center flex-x-between">
						<view class="col-6 f-24 dis-flex flex-y-center flex-wrap">
							{{item.create_newtime}}
							<view class="m-l-10 app-red p-l-10 p-t-10 p-b-10 p-r-10" @tap.stop="delData(item)">
								<text class="iconfont2 icon-shanchu f-24"></text>
							</view>
						</view>
						<view class="operation dis-flex flex-y-center flex-wrap flex-x-end">
							<view class="oper-item f-24" v-if="tabOn==0" @tap.stop="toEdit(item.express_order_id)">编辑</view>
							<view class="oper-item f-24 oper-red" v-if="tabOn==0" @tap.stop="print(item)">{{item.express_type==4?'立即预约':'打印'}}</view>
							<view class="oper-item f-24" v-if="tabOn==1" @tap.stop="clearExpress(item)">{{item.express_type==4?'取消预约':'回收单号'}}</view>
							<!-- <view class="oper-item f-24 oper-red" v-if="tabOn==0&&item.customer==''" @tap.stop="toDone(item.express_order_id)">强制完成</view> -->
							<view class="oper-item f-28 oper-red" v-if="tabOn==1" @tap.stop="toExpress(item)">查看物流</view>
						</view>
					</view>
				</view>
				
			</view>
			<!--加载loadding-->
			<view class="no-more f-24 col-9" v-if="loadding">加载中...</view>
			<tui-nomore v-if="(!pullUpOn && list.data!='') || page==list.last_page" backgroundColor="#F7F7F7" text="生意宝技术支持～"></tui-nomore>
		</view>
		<!-- 无数据 -->
		<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="list.data==''">
			<view class="col-9">暂无数据</view>
		</tui-no-data>
		<!-- 底部 -->
		<view class="footer">
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toAddbtn"><text class="iconfont2 icon-jiahao f-36"></text>添加打单</view>
			</view>
		</view>
		<!-- 打单信息弹窗 -->
		<prinit-model ref="prinitModel"></prinit-model>
		<!-- 提示 -->
		<popup-tips ref="popupTips" :title="mtitle" :content="mcontent" confirmText="确定"></popup-tips>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast"></tui-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	const app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	const util = require('@/utils/util');
	import popupTips from '@/components/popup-tips/index';
	import search from '@/components/uni-search/index';
	import prinitModel from './prinit-model/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			popupTips,
			search,
			prinitModel,
			guidePage
		},
		data() {
			return {
				navbar: [{
					name: "待打单",
					status: 0
				}, {
					name: "已完成",
					status: 1
				}],
				tabOn: 0,//默认是待打单
				page: 1,
				loadding: false,
				pullUpOn: true,
				list: {},
				searchValue: '',
				mtitle:'',
				mcontent:'',
				info: {},//打单信息
			}
		},
		onShow() {
			this.page = 1;
			this.loadding= false;
			this.pullUpOn= true;
			this.getList();
		},
		//页面相关事件处理函数--监听用户下拉动作
		onPullDownRefresh () {
			this.page = 1;
			this.getList();
			this.pullUpOn = true;
			this.loadding = false;
			uni.stopPullDownRefresh();
			this.$api.msg("刷新成功")
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
			//获取列表
			getList(){
				let that = this;
				let data = {
					page: that.page,
					status: that.tabOn,
					search: that.searchValue || ''
				};
				app._get('shop.order.fast_print/getList', data, res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data.list;
					if(that.page==1){
						data.data = that.initTime(data.data);
						_list = data;
					}else{
						let list = that.initTime(data.data);
						_list.data = _list.data.concat(list);
					}
					that.list = _list;
				});
			},
			initTime(data){
				data.forEach(item => {
					item.create_newtime = item.create_time.substring(0,16);
				});
				return data;
			},
			//打印
			print(item){
				this.mtitle = '提示',
				this.mcontent = item.express_type==4?'是否预约？':'是否打单？';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.order.fast_print/print',{express_order_id: item.express_order_id}, res =>{
						this.$api.msg(res.msg);
						this.info = res.data.express_order;
						this.info.now_time = util.dateFormat('YYYY-mm-dd HH:MM', new Date());
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList()
						this.$refs.prinitModel._open(this.info)
					});
				})
			},
			//回收单号
			clearExpress(item){
				this.mtitle = '提示',
				this.mcontent = item.express_type==4?'是否取消预约？':'是否回收单号？';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.order.fast_print/clearExpress',{express_order_ids: item.express_order_id}, res =>{
						this.$api.msg(res.msg);
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList()
					});
				})
			},
			//删除
			delData(item){
				this.mtitle = '提示',
				this.mcontent = '删除并回收快递单号！';
				this.$refs.popupTips.open(() => {
					app._post_form('shop.order.fast_print/delete',{express_order_id: item.express_order_id}, res =>{
						this.$api.msg(res.msg);
						this.page = 1;
						this.loadding= false;
						this.pullUpOn= true;
						this.getList()
					});
				})
			},
			//复制
			clipboard(data) {
				thorui.getClipboardData(data, (res) => {
					// #ifdef H5 || MP-ALIPAY
					if (res) {
						this.$api.msg("复制成功")
					} else {
						this.$api.msg("复制失败")
					}
					// #endif
				})
			},
			//强制完成
			// toDone(id){
			// 	this.mtitle = '强制完成',
			// 	this.mcontent = '是否强制完成？';
			// 	this.$refs.popupTips.open(() => {
			// 		app._post_form('order.fast_print/finish',{express_order_id: id}, res =>{
			// 			this.$api.msg(res.msg);
			// 			this.page = 1;
			// 			this.loadding= false;
			// 			this.pullUpOn= true;
			// 			this.getList()
			// 		});
			// 	})
			// },
			//添加
			toAddbtn(){
				uni.navigateTo({
					url: './add'
				})
			},
			//编辑
			toEdit(id){
				uni.navigateTo({
					url: './add?id='+id
				})
			},
			// 详情
			toDetail (id){
				uni.navigateTo({
					url: './detail?id='+id
				})
			},
			// 切换tab
			changeTab(e){
				this.tabOn = this.navbar[e.index].status;
				this.page = 1;
				this.loadding= false;
				this.pullUpOn= true;
				this.getList();
			},
			//查看物流
			toExpress(item){
				let express = {
					express_no: item.express_no||''
				};
				if(item.express_type==4){
					express.express_company = item.express.express_name||''
				}else{
					express.express_company = item.customer.express_name||''
				}
				let file_path = item.wxapp_goods[0].wxapp_good.goods.goods_image;
				let goods = {
					file_path: file_path,
					goods_num: item.total_num
				};
				uni.navigateTo({
					url: '/pages/order/express/express?order_no=' + item.order_no + '&express=' + encodeURIComponent(JSON.stringify(express)) + '&goods=' + encodeURIComponent(JSON.stringify(goods))
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
			copy(item){
				// let data = '';
				// if(item.express_type==4){
				// 	data = item.express.express_name?item.express.express_name+'：' +item.express_no:'' +item.express_no;
				// }else{
				// 	data = item.customer.express_name?item.customer.express_name+'：' +item.express_no:'' +item.express_no;
				// }
				let data = item.receiver.name +' ' + item.receiver.phone +' ' + item.receiver.region.province +' ' + item.receiver.region.city +' ' + item.receiver.region.region +' ' + item.receiver.detail +' '+ item.order_no;
				this.clipboard(data)
			}
		}
	}
</script>

<style lang="scss">
	@import '../order/index';
	@import 'list';
</style>
