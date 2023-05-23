<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="订单详情" isHelpme helpmeColor="#fff" extClass="nav" id="top" background="linear-gradient(to right,#FF7541,#F55B5B)" color="#fff"></navigationBar>
		
		<view class="main">
			<!-- 订单进度 -->
			<view class="order-state">
				<template v-if="detail.order_status">
					<view class="col-f f-44 pad_lr30">{{detail.order_status.text}}</view>
					<view class="col-f state-text f-28 pad_lr30">
						{{detail.confirm_pay_button?'请提醒顾客转账支付，并在收款后及时确认收款':detail.order_status.value == 10 ? '请及时处理订单' : ''}}
					</view>
					<!-- <view class="col-f f-44 pad_lr30">待收款</view>
					<view class="col-f state-text f-28 pad_lr30">请提醒顾客转账支付，并在收款后及时确认收款</view> -->
					<!-- <view class="steps dis-flex flex-y-center flex-x-between">
						<template v-for="(step,sindex) in items">
							<view class="steps-item f-28" :class="sindex<=activeSteps?'on':''" :key="sindex">
								<view class="steps-circle"><view></view></view>{{step.title}}
							</view>
						</template>
					</view> -->
				</template>
			</view>
			
			<!-- 买家 -->
			<view class="buyer_wrap bgf pad_lr30">
				<view class="buyer dis-flex flex-y-center">
						<template v-if="detail.user">
						<view class="buyer_img"><image :src="detail.user.avatarUrl" mode="aspectFill"></image></view>
						<text class="m-l-10 f-28">{{detail.user.nickName}}</text>
						<view class="m-l-10 f-28 color_yellow" @tap.stop="clipboard(detail.user.nickName)"><text class="iconfont2 col-3 icon-copy2"></text></view>
					</template>
				</view>
				<!-- 地址 -->
				<view class="address dis-flex flex-y-center flex-x-between" v-if="detail.address">
					<view class="address-type f-26 col-9"><text class="iconfont2 icon-address"></text></view>
					<view class="address-info">
						<template v-if="detail.address">
							<view class="f-28 col-3 dis-flex flex-y-center flex-x-between">{{detail.address.name}}  {{detail.address.phone}} 
								<view>
									<text class="m-l-20 f-28 color_yellow" @tap.stop="editAddress">修改</text>
									<text class="m-l-20 col-3 iconfont2 icon-copy2" @tap.stop="copyAddress"></text>
								</view>
							</view>
							<view class="f-28 col-6 m-top10" v-if="detail.address.region">{{detail.address.region.province}} {{detail.address.region.city}} {{detail.address.region.region}} {{detail.address.detail}}</view>
						</template>
					</view>
				</view>
			</view>
			<!-- 商品 -->
			<view class="list-item bgf pad_lr30" v-for="(items, indexs) in detail.suborder" :key="indexs" @tap="toDetail(items)">
				<view class="pro-bottom dis-flex flex-y-center flex-x-between">
					<view class="f-30 col-3">订单状态：<text class="color_red">{{items.order_status.text}}</text></view>
					<!-- <view class="flex-box seller_name f-28 col-3 onelist-hidden m-l-30 m-r-40" v-if="items.order_type==2 &&items.notice_pay_button">（{{items.dealer_wxapp.name||''}})</view> -->
					<view class="flex-box seller_name f-28 col-3 onelist-hidden m-l-30 m-r-40" v-if="items.order_type==2">（上家：{{items.dealer_wxapp.name||''}})</view><!-- b -->
					<view class="flex-box seller_name f-28 col-3 onelist-hidden m-l-30 m-r-40" v-if="(items.order_type==1)&&(items.dealer_seller_wxapp_name)">（来源：{{items.dealer_seller_wxapp_name||''}})</view><!-- a -->
					<view class="btn-wrap dis-flex flex-y-center">
						<view v-if="items.order_type==2 &&items.notice_pay_button" class="oper-item f-24 oper-red">去付款</view>
						<view v-if="items.deliver_button" class="oper-item f-24 oper-red oper-orange">去发货</view>
						<view v-if="items.order_status.value > 14 && items.order_status.value != 31 && items.express_type != 3" class="oper-item f-24 oper-red0">查看物流</view>
					</view>
				</view>
				<view class="pro dis-flex flex-x-between" v-for="(item1, index1) in items.goods" :key="index1">
					<view class="pro_img">
						<image lazy-load :src="item1.file_path" mode="aspectFill"></image>
					</view>
					<view class="pro_info">
						<view class="twolist-hidden col-3 f-28 pro_name">{{item1.goods_name}}</view>
						<view class="col-6 f-26 norm">规格：{{item1.goods_attr||'无'}}</view>
					</view>
					<view class="pro-r flex-box">
						<!-- <view class="col-3 f-26">¥{{item1.seller_wxapp_id==item1.dealer_wxapp_id?item1.origin_goods_price:item1.goods_price}}</view> -->
						<view class="col-3 f-26">¥{{item1.goods_price}}</view>
						<view class="col-3 f-26">X{{item1.total_num}}</view>
						<!-- <view class="col-6 f-26 norm">商品来源：{{wxapp_goods_types[item1.wxapp_goods_type]}}</view> -->
						<!-- <view class="color_red f-26 pro_state">{{items.order_status.text}}</view> -->
					</view>
				</view>
			</view>
			<!-- 客户留言 -->
			<view class="container">
				<view class="listBox bgf" v-if="detail.address">
					<view class="list dis-flex">
						<view class="control">
							<text class="f-30">客户留言：{{detail.buyer_remark}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf" v-if="detail.address">
					<view class="list dis-flex">
						<view class="label">商家备注：</view>
						<view class="control dis-flex flex-y-center flex-x-end" @tap.stop="openItem()">
							<text class="col-9 onelist-hidden flex-box">{{detail.remarks}}</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">订单总价</view>
						<view class="control text-right">
							<text class="f-30">¥{{detail.total_price}}</text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">配送费用</view>
						<view class="control text-right">
							<text class="f-30">+¥{{detail.express_price}}</text>
						</view>
					</view>
					<view class="list dis-flex" v-if="detail.coupon_money!=0">
						<view class="label">优惠券</view>
						<view class="control text-right">
							<text class="f-30">-¥{{detail.coupon_money}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">实收金额</view>
						<view class="control text-right">
							<text class="f-30 color_red">¥{{detail.pay_price}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">订单号</view>
						<view class="control text-right copy">
							<text class="f-30">{{detail.order_no}}</text>
							<text class="m-l-20 col-3 iconfont2 icon-copy2 f-32" @tap.stop="clipboard(detail.order_no)"></text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">下单时间</view>
						<view class="control text-right">
							<text class="f-30">{{detail.create_time}}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部按钮 -->
			<view class="operation-wrap">
				<view class="operation bgf pad_lr30 dis-flex flex-y-center flex-x-end">
					<template v-if="detail.order_status&&(detail.order_status.value==20||detail.order_status.value==30)">
						<view class="oper-item f-28" @tap.stop="deleteOrder">删除订单</view>
					</template>
					<view class="oper-item f-28" @tap.stop="openItem">添加备注</view>
					<view v-if="detail.close_order_button" class="oper-item f-28" @tap.stop="close">取消订单</view>
					<view v-if="detail.confirm_pay_button" class="oper-item f-28 oper-red" @tap.stop="toModel1">确认收款</view>
					<!-- <view class="oper-item f-28 oper-red disabled">发货</view> -->
				</view>
			</view>
		</view>
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
		<!-- 提示Model -->
		<popup-tips ref="popupTips" type="custom" :title="mtitle" :content="mcontent" @tipsCallback="toShouQian" confirmText="确认">
			<view class="f-32 col-3 tb-lr-center">{{mtitle}}</view>
			<view class="mcontent f-30 col-3">
				<view class="f-30 col-3">{{mcontent}}</view>
				<view class="f-30 col-9 dis-flex flex-y-center flex-x-end">
					<view class="duihao" :class="!isModel? 'duihao_red':''" @tap.stop="toCheck">
						<text v-show="!isModel" class="iconfont2 icon-duihao f-28 f-w app-red"></text>
					</view>
					不再提示
				</view>
			</view>
		</popup-tips>
		<popup-input ref="popupInput"></popup-input>
		<popup-tips ref="popupCloseTips" :title="ttitle" :content="tcontent"></popup-tips>
		<guidePage ref="guidePage"></guidePage>
	</view>
</template>

<script>
	let app = getApp().globalData;
	const thorui = require("@/components/common/tui-clipboard/tui-clipboard.js")
	import popupTips from '@/components/popup-tips/index';
	import popupInput from '@/components/popup-input/index';
	import guidePage from '@/components/guide-page';
	export default {
		components: {
			popupTips,
			popupInput,
			guidePage
		},
		data() {
			return {
				detail: {},
				isModel: true,//是否显示收款提示
				mtitle:'确认已收款',//提示标题
				mcontent:'确认已接收顾客资金，确认后状态同步通知顾客！',//提示内容
				ttitle:'',//提示标题
				tcontent:'',//提示内容
				sheTab: 1,
				szMoney:'',
				//进度条
				items: [{
					title: "收款",
				}, {
					title: "付款",
				}, {
					title: "发货",
				}, {
					title: "收货",
				}, {
					title: "完成",
				}],
				activeSteps: 0,//进度
				address: {},//地址
				order_no: '',
				wxapp:{},//会员信息
				wxapp_goods_types: {
				    0: '未知',
				    1: '复制',
				    2: '渠道',
				    3: '自建',
				},
			}
		},
		onLoad(options) {
			this.order_no = options.order_no || '';
			//获取是否显示Model
			// uni.removeStorageSync('isModel');//接完接口删掉
			this.isModel = uni.getStorageSync('isModel')===''? true : uni.getStorageSync('isModel');
			this.getWxappData();
		},
		onShow() {
			this.getData()
		},
		methods: {
			getData() {
				app._get('shop.order/getOrderDetail', {
					order_no: this.order_no,
					page_type: 'detail'
				}, res => {
					this.detail = res.data.order || {}
				}, () => {
					uni.reLaunch({
						url: '/pages/index/index'
					})
				});
			},
			//取消
			close() {
				this.ttitle = '取消订单';
				this.tcontent = '是否确认取消此订单？';
				this.$refs.popupCloseTips.open(() => {
					app._post_form('shop.order/closeOrder', {
						order_no: this.detail.order_no
					}, res => {
						this.$api.msg(res.msg)
						this.getData()
					});
				})
			},
			//删除订单
			deleteOrder(){
				this.ttitle = '删除订单';
				this.tcontent = '是否确认删除此订单？';
				this.$refs.popupCloseTips.open(() => {
					app._post_form('shop.order/delete', {
						order_no: this.detail.order_no
					}, res => {
						this.$api.msg(res.msg)
						uni.navigateBack()
					});
				})
			},
			//确认收款
			toShouQian(){
				let data = {
					order_no: this.detail.order_no,
					pay_type: this.sheTab
				};
				if(this.sheTab==2){
					data.user_id = this.detail.user.user_id;
					data.money = this.szMoney;
					data.dealer_wxapp_id = this.detail.suborder[0].seller_wxapp_id
				}
				app._post_form('shop.order/comfirmPay', data, res => {
					this.$api.msg(res.msg)
					this.getData()
				});
			},
			//打开收款/赊账弹窗
			toModel1(){
				let dealer_wxapp_id = this.detail.suborder[0].dealer_wxapp_id || '',
						seller_wxapp_id = this.detail.suborder[0].seller_wxapp_id || '';
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
			//修改地址
			editAddress(){
				uni.navigateTo({
					url: '/pages/address/index'
				})
			},
			// 复制地址
			copyAddress() {
				let str = ''
				if (this.detail.address) {
					str = this.detail.address.name + ' ' + this.detail.address.phone
					if (this.detail.address.region) {
						str += ' ' + this.detail.address.region.province + ' ' + this.detail.address.region.city + ' ' + this.detail.address.region.region + ' ' + this.detail.address.detail
					}
				}
				this.clipboard(str)
			},
			// 复制
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
			//详情
			toDetail (item){
				if(this.detail.confirm_pay_button!=1){
					uni.navigateTo({
						url: 'detail?order_no=' +  this.order_no + '&childOrder_no=' + item.order_no
					})
				}else{
					this.$api.msg('请先确认收款')
				}
			},
			//更新地址
			iplChange(data){
				// this.address = data;
				app._post_form('shop.order/editAddress', {
					name: data.name,
					phone: data.phone,
					province_id: data.province_id,
					city_id: data.city_id,
					region_id: data.region_id,
					detail: data.detail,
					order_no: this.order_no
				}, res => {
					this.$api.msg(res.msg)
					this.getData()
				});
			},
			openItem() {
				this.$refs.popupInput._open(this.detail.remarks, (val) => {
					app._post_form('shop.order/storeRemark', {
						order_no: this.order_no,
						remark: val
					}, res => {
						this.$api.msg(res.msg)
						this.getData()
					});
				})
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
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../coupon/detail";
	@import 'index';
</style>
