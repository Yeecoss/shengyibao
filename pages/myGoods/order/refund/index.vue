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
		<view class="main" v-if="list.data!=''">
			<view class="list_wrap">
				<!-- 普通订单 -->
				<view class="list-item bgf pad_lr30" v-for="(item, index) in list.data" :key="item.order_refund_id">
					<view class="list-top dis-flex flex-y-center flex-x-between">
						<view class="order-no dis-flex flex-y-center col-3 f-28">
							<text class="iconfont2 f-32 m-r-10" :class="item.is_master.value?'tag_orange icon-Thereisamaster':'tag_blue icon-Noowner'"></text>
							{{item.express_name?item.express_name+'：':''}}{{item.express_no?item.express_no:''}}
						</view>
						<template v-if="item.is_agree.value==0 &&item.is_master.value==1 && item.status.value==0">
							<view class="order-status f-30 color_red">{{item.is_agree.text}}</view>
						</template>
						<template v-else>
							<view class="order-status f-30 color_red">{{item.status.text}}</view>
						</template>
					</view>
					<view class="refund_info bgf5 col-3 f-28">
						<view class="refund_info_t dis-flex flex-y-center flex-x-between">
							<view class="sender flex-box">寄件人信息：{{item.user_name}} {{item.user_phone}}</view>
							<view class="refund_reason">{{item.apply_desc}}</view>
						</view>
						<view class="m-top10">原订单号：{{item.order_no||'无'}}</view>
					</view>
					<!-- 关联商品 -->
					<template v-if="item.refund_goods.length>1">
						<view class="pro_relate dis-flex flex-y-center flex-x-between m-top30" v-if="item.refund_goods[0].wxapp_goods_id!=0">
							<view class="pro_r dis-flex">
								<template v-for="(vo,k) in item.refund_goods">
									<view class="pro_r_img" :key="vo.wxapp_goods_id" v-if="k<4">
										<image lazy-load :src="vo.goods_image" mode="aspectFill"></image>
									</view>
								</template>
							</view>
							<view class="pro_r_more f-28 col-3">
								共{{item.goods_total_num}}件 <text class="iconfont2 icon-gengduobeifen2 f-28"></text>
							</view>
						</view>
					</template>
					<template v-else>
						<template v-for="(vo,k) in item.refund_goods">
							<view class="pro_relate dis-flex flex-y-center flex-x-between m-top30" :key="vo.goods_id" v-if="item.refund_goods[0].wxapp_goods_id!=0">
								<view class="dis-flex">
									<view class="pro_r_img">
										<image lazy-load :src="vo.goods_image" mode="aspectFill"></image>
									</view>
									<view class="pro_r_info">
										<view class="onelist-hidden col-3 f-28">{{vo.goods_name}}</view>
										<view class="onelist-hidden col-6 f-26 m-top10">{{vo.goods_sku_name?vo.goods_sku_name+'*':''}}{{vo.goods_num}}</view>
									</view>
								</view>
							</view>
						</template>
					</template>
					<!-- 操作按钮 -->
					<view class="operation-wrap dis-flex flex-y-center flex-x-between">
						<view class="col-6 f-24">下单时间：{{item.create_newtime}}</view>
						<view class="operation dis-flex flex-y-center flex-wrap flex-x-end">
							<view class="oper-item f-24" @tap.stop="toDetail(item)">售后详情</view>
							<template v-if="item.is_agree.value==10 && !item.address && item.status.value==0">
								<view v-if="item.type.value==10" class="oper-item f-24" @tap.stop="toModel(item.order_refund_id)">退货地址</view>
							</template>
							<template v-if="item.is_master.value==0 && item.status.value==0&& (!item.order_no||item.order_no=='')"> 
								<view class="oper-item f-24 oper-red" @tap.stop="toBindOrder(item.order_refund_id)">绑定原订单</view>
							</template>
							<template v-if="item.is_agree.value==0 &&item.is_master.value==1 && item.status.value==0">
								<view class="oper-item f-24 oper-red" @tap.stop="review(item)">审核</view>
							</template>
						</view>
					</view>
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
			<view class="foot wrap30">
				<view class="foot-btn f-32 col-f" @tap.stop="toAddbtn"><text class="iconfont2 icon-jiahao f-36"></text>登记售后</view>
			</view>
		</view>
		<!-- 提示框 -->
		<tui-tips position="center" ref="toast" v-if="index==1"></tui-tips>
		<!-- 提示Model -->
		<popup-tips ref="popupTips" type="custom" confirmText="确定"><!-- @tipsCallback="toAddAdress"-->
			<view class="f-32 col-3 tb-lr-center">{{mtitle}}</view>
			<view class="mcontent f-26 col-3">
				<!-- 解析 -->
				<view class="analysis-wrap bgf dis-flex">
					<view class="analysis f-24 dis-flex flex-x-between">
						<textarea v-model="addrText" placeholder="输入或粘贴地址" placeholder-class="place" @blur="analysis"/>
						<view class="clear dis-flex flex-x-center flex-y-center" v-if="addrText!=''" @tap="clear">
							<text class="iconfont2 icon-cross-mini col-9"></text>
						</view>
					</view>
					<navigator url="/pages/myGoods/address/index" class="app-red m-t-20 m-l-20">去选择地址</navigator>
				</view>
				<view class="address-box address-box">
				  <input v-model="addr_name" placeholder="输入姓名" placeholder-class="place"/>
				</view>
				<view class="address-box">
				  <input type="number" v-model="phone" placeholder="输入手机号" placeholder-class="place"/>
				</view>
				<view class="address-box">
					<view class="right-cont" @tap="bindRegionChange">
						<text v-if="region" class="f-26">{{region_val}}</text>
						<text v-else class="f-26 col-9">选择省、市、区</text>
					</view>
				</view>
				<view class="address-box dis-flex flex-y-center">
				  <textarea v-model="detail" placeholder="输入详细地址" placeholder-class="place"/>
				</view>
			</view>
		</popup-tips>
		<simple-address :pickerValueDefault="cityPickerValueDefault" ref="simpleAddress"></simple-address>
		<guidePage ref="guidePage"></guidePage>
		
	</view>
</template>

<script>
	let app = getApp().globalData;
	import util from '@/utils/util.js';
	import popupTips from '@/components/popup-tips/index';
	import AddressParse from '@/pages/address/zh-address-parse/zh-address-parse.min.js';
	import search from '@/components/uni-search/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			popupTips,
			search,
			guidePage
		},
		data() {
			return {
				index: 1,//提示框
				title: '售后',
				list: {},
				searchValue: '',
				page: 1,
				loadding: false,
				pullUpOn: true,
				// Model
				refund_id: '',
				mtitle:'',//提示标题
				addr_name: '',
				phone: '',
				region: '',
				region_val: '',
				cityPickerValueDefault: [0,0,0],
				detail: '',
				addrText:'',//粘贴文本
				// address: {address_id: 22,city_id: 221,detail: "下一站",is_commonly: 0,is_delete: 0,name: "哈哈",phone: "15638191226",province_id: 220,region_id: 224,user_id: 36,region:{city: "太原市",province: "山西省",region: "杏花岭区"}},//地址
				// end
			}
		},
		onShow() {
			// this.list = [];
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
			//审核
			review(item){
				let that = this;
				uni.showModal({
					title: '提示',
					content: item.type.value==20?'是否同意用户退款？': '是否同意用户退货退款？',
					confirmColor: '#FF7541',
					confirmText: '同意',
					cancelText: '拒绝',
					cancelColor: '#666',
					success(res) {
						let url = '';
						if (res.confirm) {
							url = 'shop.order.refund/agree';
						} else if (res.cancel) {
							url = 'shop.order.refund/refuse';
						}
						app._post_form(url, {refund_id: item.order_refund_id}, data => {
							that.$refs.toast.showTips({msg: data.msg});
							that.list = [];
							that.page = 1;
							that.pullUpOn = true;
							that.loadding = false;
							that.getList();
						});
					}
				});
			},
			//获取列表
			getList(){
				let that = this;
				let data = {
					page: that.page,
					search: that.searchValue || ''
				}
				app._get('shop.order.refund/getQueryList', data, res => {
					that.loadding = false;
					let _list = that.list;
					let data = res.data.list;
					if(that.page==1){
						let list = {};
						list.data = that.initTime(data.data);
						_list = list;
					}else{
						let list = that.initTime(data.data);
						_list.data = _list.data.concat(list);
					}
					that.list = _list;
				});
			},
			initTime(data){
				data.forEach(item => {
					item.create_newtime = item.create_time.substring(0,11);
				});
				return data;
			},
			// 添加退货地址
			toAddAdress(){
				let that = this;
				if(that.addr_name==''){
					that.$refs.toast.showTips({msg: '退货姓名不能为空'});
					return false;
				}
				if(that.phone==''){
					that.$refs.toast.showTips({msg: '退货电话不能为空'});
					return false;
				}
				if(that.region_val==''){
					that.$refs.toast.showTips({msg: '退货地址不能为空'});
					return false;
				}
				if(that.detail==''){
					that.$refs.toast.showTips({msg: '退货地址不能为空'});
					return false;
				}
				let data = {
					order_refund_id: that.refund_id,
					name: that.addr_name,
					phone: that.phone,
					region: that.region_val,
					detail: that.detail,
				};
				
				app._post_form('shop.order.refund/addRefundAddress', data, res => {
					that.$refs.toast.showTips({msg: res.msg});
					that.list = [];
					that.page = 1;
					that.pullUpOn = true;
					that.loadding = false;
					that.getList();
					that.addr_name = '';
					that.phone = '';
					that.detail = '';
				});
			},
			//添加
			toAddbtn(){
				uni.navigateTo({
					url: './add'
				})
			},
			// 详情
			toDetail (item){
				let url = item.is_master.value==1? 'detail1?refund_id='+ item.order_refund_id : 'detail?refund_id='+ item.order_refund_id;
				uni.navigateTo({
					url: url
				})
			},
			//绑定原订单
			toBindOrder(refund_id){
				uni.navigateTo({
					url: './bindOrder?refund_id='+refund_id
				})
			},
			//解析
			analysis(e){
				if(this.addrText){
					const parseResult = AddressParse(this.addrText, 0)
					this.addr_name = parseResult.name;
					this.phone = parseResult.phone;
					this.detail = parseResult.detail;
					
					let region = [parseResult.province, parseResult.city, parseResult.area];
					this.region = region;
					let val = region.join(',');
					this.region_val = val;
				}
			},
			//修改地区
			bindRegionChange: function (e) {
				if(this.addrText){
					let index = this.$refs.simpleAddress.queryIndex(this.region, 'label');
					this.cityPickerValueDefault = index.index;
				}
				
				this.$refs.simpleAddress.open((val) => {
					var val = val.split("-");
					
					this.region = val;
					val = val.join(',');
					this.region_val = val;
				})
			},
			//打开Model
			toModel(refund_id){
				let that = this;
				that.refund_id = refund_id;
				that.mtitle = '退货地址';
				that.$refs.popupTips.open(() => {
					this.toAddAdress()
				});
			},
			//更新地址
			iplChange(data){
				this.addr_name = data.name;
				this.phone = data.phone;
				this.detail = data.detail;
				// this.address = data;
				let region = [data.region.province, data.region.city, data.region.region];
				this.region = region;
				let val = region.join(',');
				this.region_val = val;
				
				let index = this.$refs.simpleAddress.queryIndex(this.region, 'label');
				this.cityPickerValueDefault = index.index;
			},
			//清空粘贴
			clear(){
				this.addrText = '';
			},
			// 搜索提交
			search (e) {
				this.searchValue = e;
				this.page = 1;
				this.pullUpOn = true;
				this.loadding = false;
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
									this.pullUpOn = true;
									this.loadding = false;
									this.getList();
								}
				    }
				});
			},
		}
	}
</script>

<style lang="scss">
	@import '../index';
	@import 'index';
</style>
