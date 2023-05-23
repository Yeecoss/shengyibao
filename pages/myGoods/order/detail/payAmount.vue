<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="实付金额" extClass="nav" id="top"></navigationBar>
		<view class="container">
			<view class="listBox bgf" v-for="(item, index) in goods" :key="index">
				<!-- <view class="list"> -->
					<!-- 商品详情 -->
					<view class="flow-shopList dis-flex flex-wrap">
						<view class="flow-list-left m-r-20">
							<image lazy-load mode="aspectFill" :src="item.file_path"></image>
						</view>
						<view class="flow-list-right flex-box">
							<!-- 商品名称 -->
							<text class="f-28 col-3 onelist-hidden">{{item.goods_name}}</text>
							<!-- <view class="goods-price f-28 col-6">¥{{item.goods_price}}</view> -->
							<!-- 商品sku信息 -->
							<view class="goods_attr f-28 col-6 onelist-hidden m-t-10">规格:{{item.goods_attr||'无'}}</view>
						</view>
					</view>
				<!-- </view> -->
				<view class="list dis-flex">
					<view class="label f-28">原价</view>
					<view class="control text-right">
						<text class="f-28">¥{{item.goods_price}}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label f-28">渠道优惠</view>
					<view class="control text-right">
						<text class="f-28">¥{{item.wholesale_amount}}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label f-28">购买数量</view>
					<view class="control text-right">
						<text class="f-28">{{item.total_num}}</text>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-28">订单原价</view>
					<view class="control text-right">
						<text class="f-28">¥{{childDetail.total_price}}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label f-28">优惠总价</view>
					<view class="control text-right">
						<text class="f-28">¥{{childDetail.total_wholesale_reduce_amount}}</text>
					</view>
				</view>
				<view class="list dis-flex" v-if="childDetail.express_price>0">
					<view class="label">配送费用</view>
					<view class="control text-right">
						<text class="f-30">+¥{{childDetail.express_price}}</text>
					</view>
				</view>
				<view class="list dis-flex">
					<view class="label f-28">实付金额</view>
					<view class="control text-right">
						<text class="f-28 app-red">¥{{childDetail.pay_price||0}}</text>
					</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		data(){
			return{
				// 订单详情
				order_no:'',
				childOrder_no:'',
				detail: {},
				childDetail: {},
				goods: [],
			}
		},
		onLoad(options) {
			this.order_no = options.order_no;
			this.childOrder_no = options.childOrder_no;
			this.getData();
		},
		methods:{
			// 详情
			getData() {
				app._get('shop.order/getOrderDetail', {
					order_no: this.order_no,
					page_type: 'subdetail'
				}, res => {
					this.detail = res.data.order || {};
					this.detail.suborder.forEach(element => {
						if (element.order_no == this.childOrder_no) {
							this.childDetail = element;
							this.goods = element.goods;
						}
					});
				});
			},
		}
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import 'payAmount';
</style>
