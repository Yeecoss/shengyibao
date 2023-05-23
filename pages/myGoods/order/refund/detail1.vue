<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="退货详情" extClass="nav" id="top"></navigationBar>
		<view class="main">
			<!-- 订单进度 -->
			<view class="order-state">
				<template v-if="info.is_master && info.status">
					<view class="col-f f-40 pad_lr30" v-if="info.is_master.value==1 && info.status.value==0">{{info.is_agree.text}}({{info.type.text}}）</view>
				<template v-else>
					<view class="col-f f-40 pad_lr30">{{info.status.text}}(退款）</view>
				</template>
				</template>
			</view>
			<!-- 地址 -->
			<view class="address_wrap pad_lr30 bgf m-t-20" v-if="address">
				<view class="address_title f-30 col-3">退货地址</view>
				<view class="address dis-flex flex-y-center flex-x-between">
					<view class="address-type f-26 col-9"><text class="iconfont2 icon-address"></text></view>
					<view class="address-info">
						<view class="f-28 col-3">{{address.name}}  {{address.phone}}</view>
						<view class="f-28 col-6 m-top10">{{address.region?address.region.province+address.region.city+address.region.region:''}}{{address.detail}}</view>
					</view>
				</view>
			</view>
		<!-- 快递 -->
		<view class="container" v-if="info.express_no">
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">快递名称</view>
					<view class="control">
						<text class="f-30">{{info.express_name}}</text>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label">快递单号</view>
					<view class="control">
						<text class="f-30">{{info.express_no}}</text>
					</view>
				</view>
			</view>
		</view>
			<!-- 商品 -->
			<view class="list-item bgf pad_lr30" v-for="(item1, index1) in refund_goods" :key="index1" @tap="toDetail(item1.wxapp_goods_id)">
				<view class="pro dis-flex flex-x-between">
					<view class="pro_img">
						<image lazy-load :src="item1.goods_image" mode="aspectFill"></image>
					</view>
					<view class="pro_info">
						<view class="onelist-hidden col-3 f-28 pro_name">{{item1.goods_name}}</view>
						<view class="col-3 f-28 m-top4">¥{{item1.goods_price}}</view>
						<view class="col-6 f-28 norm onelist-hidden">{{item1.goods_sku_name}}</view>
					</view>
				</view>
			</view>
			<!-- 客户留言 -->
			<view class="container">
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">申请原因</view>
						<view class="control text-right">
							<text class="f-30">{{info.apply_desc}}</text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">退款金额</view>
						<view class="control text-right">
							<text class="f-30">¥{{info.refund_money}}</text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">申请件数</view>
						<view class="control text-right">
							<text class="f-30">{{info.goods_total_num}}</text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">订单号</view>
						<view class="control text-right">
							<text class="f-30">{{info.order_no}}</text>
						</view>
					</view>
					<view class="list dis-flex">
						<view class="label">提交时间</view>
						<view class="control text-right">
							<text class="f-30">{{info.create_time}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="control">
							<text class="f-30">订单留言：</text>
							<text class="f-30 col-6">{{info.user_remark}}</text>
						</view>
					</view>
				</view>
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label">商家备注：</view>
						<view class="control dis-flex flex-y-center flex-x-end" @tap.stop="openItem('merchant_remark')">
							<text class="f-30 col-6 onelist-hidden flex-box">{{info.merchant_remark}}</text>
							<text class="iconfont2 icon-gengduobeifen2"></text>
						</view>
					</view>
				</view>
			</view>
			<!-- 底部按钮 -->
			<template v-if="info.status">
				<view class="operation-wrap" v-if="info.status.value==0">
					<view class="operation bgf pad_lr30 dis-flex flex-y-center flex-x-end">
						<view class="oper-item f-28" @tap.stop="endOrder(50)">作废</view>
						<view class="oper-item f-28" @tap.stop="endOrder(10)">已退款</view>
						<view class="oper-item f-28" @tap.stop="endOrder(20)">已换货</view>
					</view>
				</view>
			</template>
		</view>
		<popup-input :title="ptitle" inputType="largeText" ref="popupInput"></popup-input>
	</view>
</template>

<script>
	let app = getApp().globalData;
	import popupInput from '@/components/popup-input/index';
	
	export default {
		components: {
			popupInput,
		},
		data() {
			return {
				refund_id: '',
				address:{},
				info: {},//详情
				refund_goods: [],//商品
				ptitle: '',//弹窗输入标题
			}
		},
		onLoad(options) {
			this.refund_id = options.refund_id || '';
			this.getInfo();
		},
		methods: {
			//完结售后订单
			endOrder(status){
				let data = {
					status: status,
					refund_id: this.refund_id
				}
				app._post_form('shop.order.refund/finished',data, res => {
					this.$api.msg(res.msg);
					this.getInfo()
				});
			},
			//售后详情
			getInfo(){
				app._get('shop.order.refund/detail',{refund_id:this.refund_id},res => {
					this.address = res.data.address;
					this.info = res.data;
					this.refund_goods = res.data.refund_goods;
				});
			},
			//商家备注
			// 输入
			openItem(fieldName) {
				let that = this;
				that.ptitle = '商家备注';
				that.$refs.popupInput._open(that.info[fieldName], (val) => {
					that.info[fieldName] = val;
					let data = {
						order_refund_id: that.refund_id,
						merchant_remark: that.info.merchant_remark,
					};
					app._post_form('shop.order.refund/changeMerchantRemark',data, res => {
						that.$api.msg(res.msg);
						that.getInfo()
					});
				});
			},
			// 跳转商品详情
			toDetail (id) {
				uni.navigateTo({
					url: '/pages/goods/index?goods_id=' + id
				});
			},
		}
	}
</script>

<style lang="scss">
	@import "../../coupon/detail";
	@import '../detail/index';
	@import 'detail1';
</style>
