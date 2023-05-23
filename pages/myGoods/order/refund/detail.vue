<template>
	<view class="bgf5">
		<!-- 自定义标题栏 -->
		<navigationBar title="售后详情" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<!-- 快递公司 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">快递单号</view>
					<view class="control dis-flex flex-y-center flex-x-between">
						<text class="f-30">{{info.express_no}}</text></view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label f-30">退回快递</view>
					<view class="control dis-flex flex-y-center flex-x-between">
						<text class="f-30">{{info.express_name||'无'}}</text>
					</view>
				</view>
				<view class="refund_end dis-flex flex-y-center flex-x-center" v-if="info.status&&info.status.value>0">
					<view class="dis-flex flex-y-center flex-x-center">已完结</view>
				</view>
			</view>
			<!-- 退回商品 -->
			<view class="listBox bgf" v-show="info.relation_type==2">
				<view class="list">
					<view class="label dis-flex flex-y-center flex-x-between" style="width: 100%;">
						<text>商品备注</text>
					</view>
					<view class="control m-t-20" v-for="(item,index) in refund_goods" :key="index">
						<view class="remarks f-28">
							{{item.goods_custom_remark || item.goods_name||'无'}}
						</view>
						<view class="remark_level dis-flex flex-y-center flex-x-between f-28 m-top30">
							<view class="remark_item dis-flex flex-y-center">
								<view class="m-r-40 num">X{{item.goods_num}}</view>
								<template v-if="item.goods_quality">
									<view :class="item.goods_quality.value==1?'on2 m-r-20':'m-r-20'">良</view>
									<view :class="item.goods_quality.value==2?'on':''">次</view>
								</template>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="listBox bgf" v-show="info.relation_type==1">
				<view class="list dis-flex">
					<view class="label">关联商品</view>
				</view>
				<!-- 关联商品 -->
				<view class="wrap30 related-pros" v-if="refund_goods!=''">
					<template v-for="(item, index) in refund_goods">
						<view class="related-item dis-flex" :key="index">
							<view class="related-pic"><image lazy-load :src="item.goods_image" mode="aspectFill"></image></view>
							<view class="related-info">
								<view class="f-24 onelist-hidden">{{item.goods_custom_remark || item.goods_name}}</view>
								<view class="f-24 col-9 m-top10 goods-attr">规格:
									{{item.goods_sku_name}}*<text class="app-red">{{item.goods_num}}</text>
								</view>
								<view class="remark_level dis-flex flex-x-end flex-y-center f-28">
									<view class="remark_item dis-flex flex-y-center">
										<view :class="item.goods_quality.value==1?'on2 m-r-20':'m-r-20'">良</view>
										<view :class="item.goods_quality.value==0?'on':''">次</view>
									</view>
								</view>
							</view>
						</view>
					</template>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">图片</view>
					<view class="control dis-flex flex-y-center flex-x-end">
						<template v-if="info.image">
							<view class="f-24 app-red m-l-20" @tap.stop="onPreviewSkuImage">查看大图</view>
							<view class="refund_pic m-l-20">
								<image :src="info.image.file_path" mode="aspectFill"></image>
							</view>
						</template>
						<text class="f-28 col-9" v-else>无</text>
					</view>
				</view>
			</view>
			<!-- 售后类型 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">售后类型</view>
					<view class="control text-right">
					    <view class="uni-input onelist-hidden">
								<text>{{info.type.text}}</text>
					    </view>
					</view>
					<!-- <view class="listLine"></view> -->
				</view>
				<view class="list dis-flex">
					<view class="label">寄件人姓名</view>
					<view class="control text-right">
						<text class="f-28">{{info.user_name ||'无'}}</text>
					</view>
					<!-- <view class="listLine"></view> -->
				</view>
				<view class="list dis-flex">
					<view class="label">寄件人手机</view>
					<view class="control text-right">
						<text class="f-28">{{info.user_phone ||'无'}}</text>
					</view>
					<!-- <view class="listLine"></view> -->
				</view>
				<view class="list dis-flex">
					<view class="label">寄件人留言</view>
					<view class="control text-right onelist-hidden">
						<text class="f-28">{{info.user_remark || '无'}}</text>
					</view>
					<!-- <view class="listLine"></view> -->
				</view>
				<view class="list dis-flex">
					<view class="control onelist-hidden">
						<text class="f-30 col-3">商家备注：</text>
						<text class="f-30 col-9">{{info.merchant_remark || '无'}}</text>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label">提交时间</view>
					<view class="control text-right">
						<text class="f-30">{{info.create_time}}</text>
					</view>
				</view>
			</view>
			<!-- 底部按钮 -->
			<view class="operation-wrap" v-if="info.status.value==0">
				<view class="operation bgf pad_lr30 dis-flex flex-y-center flex-x-end">
					<!-- <view class="oper-item f-28 oper-more" @tap.stop="toEdit"><text class="iconfont2 icon-more-mini"></text></view> -->
					<view class="oper-item f-28" @tap.stop="endOrder(50)">作废</view>
					<view class="oper-item f-28" @tap.stop="endOrder(10)">已退款</view>
					<view class="oper-item f-28" @tap.stop="endOrder(20)">已换货</view>
				</view>
			</view>
		</view>
		<!-- 底部操作菜单 -->
		<tui-actionsheet :show="showSheet" :itemList="itemList" :radius="false" color="#999" @click="clickNext" @cancel="cancel"></tui-actionsheet>
	</view>
</template>

<script>
	let app = getApp().globalData;
	export default {
		components: {
		},
		data (){
			return {
				showSheet: false,//是否显示操作菜单
				itemList: [{text: '绑定原订单',color: '#333'},{text: '作废',color: '#333'},],
				
				refund_id: '',
				address:{},
				info: {},//详情
				refund_goods: [],//商品
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
			//预览Sku规格图片
			onPreviewSkuImage() {
			  wx.previewImage({
			    current: this.info.image.file_path,
			    urls: [this.info.image.file_path]
			  });
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/pages/myGoods/coupon/detail.scss';
	@import 'add';
	.remarks{
		min-height: 112rpx;
		height: initial;
	}
	// 操作按钮
	.operation-wrap, .operation{
		height: 100rpx;
		width: 100%;
	}
	.operation{
		position: fixed;
		bottom: 0;
		left: 0;
	}
	.oper-item{
		width: 200rpx;
		height: 64rpx;
		line-height: 64rpx;
		text-align: center;
		border-radius: 40rpx;
		color: #666;
		margin-left: 40rpx;
		border: 1rpx solid #DEDEDE;
		overflow: hidden;
		&:nth-child(3n+1){margin-left: 0;}
	}
	.oper-red0{
		color: $red;
		border-color: $red;
	}
	.oper-red{
		color: #fff;
		background-color: $red;
		border: 0;
	}
	.oper-more{border: none;}
	// 结束
	.container .listBox{
		position: relative;
	}
	.refund_end{
		position: absolute;
		right: 30rpx;
		top: 20rpx;
	  width: 140rpx;
	  height: 140rpx;
	  padding: 10rpx;
	  font-size: 22rpx;
	  font-weight:600;
	  color: #DEDEDE;
	  border-radius: 50%;
	  transform: rotate(-45deg);
	  border: 6rpx solid #DEDEDE;
	  background: #fff;
	  box-sizing: border-box;
	}
	.refund_end view{
		width: 100%;
		height: 100%;
		border: 1rpx solid #DEDEDE;
		background: #fff;
		border-radius: 50%;
		box-sizing: border-box;
	}
</style>
