<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="盘点单" extClass="nav" id="top"></navigationBar>
		<view class="main container">
			<!-- 快递公司 -->
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">仓库</view>
					<view class="control dis-flex flex-y-center flex-x-between">
						<view class="f-28" :class="formData.warehouse?'':'col-9'">{{formData.warehouse!=''?formData.warehouse.name:'默认仓库'}}</view>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label f-30">盘点人</view>
					<view class="control dis-flex flex-y-center flex-x-between">
						<input class="f-28" :class="formData.store_user?'':'col-9'" type="text" v-model="formData.store_user.real_name" disabled placeholder="请输入盘点人"/>
					</view>
					<view class="listLine"></view>
				</view>
				<view class="list dis-flex">
					<view class="label f-30">盘点日期</view>
					<view class="control t-r">
						<view class="f-28">{{formData.create_time?formData.create_time: '自动生成'}}</view>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="control flex1">
						<text class="col-3 f-28">备注：{{formData.remark}}</text>
					</view>
				</view>
			</view>
			<view class="listBox bgf">
				<view class="list dis-flex">
					<view class="label f-30">盘点商品</view>
					<!-- <view class="control dis-flex flex-x-end">
						<view class="btn t-c pandian">{{formData.pro_relate!=''?'继续盘点':'去盘点'}}</view>
					</view> -->
				</view>
			</view>
			<template v-if="formData.pro_relate!=''">
				<view class="listBox bgf">
					<view class="list dis-flex">
						<view class="label f-30">盘点明细</view>
						<view class="control t-r">
							<view class="f-28">现数汇总:{{formData.finish_stock_num||0}}</view>
						</view>
						<view class="listLine"></view>
					</view>
					<view class="pro-list wrap30">
						<template v-for="(item,index) in formData.pro_relate">
							<view class="pro-item f-26 col-3" :key="index">
								<view class="pro-top dis-flex flex-y-center">
									<view class="pro-img"><image lazy-load :src="item.goods_image" mode="aspectFill"></image></view>
									<view class="pro-name m-l-10 flex-box onelist-hidden">{{item.goods_name}}</view>
									<view class="m-l-30">小计:{{item.finish_goods_num}}</view>
								</view>
								<template v-if="item.sku">
									<view class="attr-list f-24 col-3 m-top30" v-for="(vo,i) in item.sku" :key="i">
										<view class="fl">{{vo.goods_attr}}</view>
										<view class="fr t-r">
											<text class="col-9">原数量:</text>{{vo.origin_stock_num}}
											<text class="col-9 m-l-20">现数量:</text>{{vo.finish_stock_num}}
											<text class="col-9 m-l-20">增减:</text>
											<text class="money-val" :class="vo.change_num>0?'app-red':''">{{vo.change_num>0?'+'+vo.change_num:vo.change_num}}</text>
										</view>
									</view>
								</template>
								<view class="attr-list f-24 col-3 m-top30" v-else>
									<view class="fl">无规格</view>
									<view class="fr t-r">
										<text class="col-9">原数量:</text>{{item.origin_stock_num}}
										<text class="col-9 m-l-20">现数量:</text>{{item.finish_stock_num}}
											<text class="col-9 m-l-20">增减:</text>
											<text class="money-val" :class="item.change_num>0?'app-red':''">{{item.change_num>0?'+'+item.change_num:item.change_num}}</text>
									</view>
								</view>
							</view>
						</template>
					</view>
				</view>
			</template>
		</view>
		<!-- 底部按钮 -->
		<view class="operation-wrap">
			<view class="operation bgf pad_lr30 dis-flex flex-y-center flex-x-end">
				<view class="oper-item oper-red0 f-28" @tap.stop="delData">删除</view>
			</view>
		</view>
		<popup-tips ref="popupTip" :title="mtitle" :content="mcontent"></popup-tips>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popupTips from '@/components/popup-tips/index';
	export default {
		components: {
			popupTips
		},
		data(){
			return{
				mtitle:'',//提示标题
				mcontent:'',//提示内容
				check_id: '',
				status: 1,
				wxapp_goods:[],//关联商品传值
				formData: {
					warehouse: '',//仓库
					store_user: '',//盘点人
					create_time: '',//盘点日期
					pro_relate: '',//关联商品
					finish_stock_num:'',//现数汇总
					remark: '',
				},
				field: {
					pro_relate: {
						fieldName: 'pro_relate',
						type: 'link',
						linkUrl: '../selectProduct/list',
					},
					warehouse: {
						fieldName: 'warehouse',
						type: 'link',
						linkUrl: '/pages/retailShop/shopAbout/salesBilling/wareHouse/index',
					},
					store_user: {
						fieldName: 'store_user',
						type: 'link',
						linkUrl: '/pages/retailShop/shopAbout/salesBilling/salesPerson/index',
					},
				}
			}
		},
		onLoad(options) {
			this.check_id = options.id || '';
			this.getInfo()
		},
		methods:{
			//获取详情
			getInfo(){
				app._get('shop.goods.stock_check/detail',{check_id:this.check_id}, res => {
					let info = res.data.stockCheck;
					this.formData = {
						warehouse : info.store_warehouse || '',
						store_user : info.store_user || '',
						create_time : info.create_time,
						pro_relate: info.stock_item||'',
						finish_stock_num: info.finish_stock_num,
						remark: info.remark || '',
					};
					this.status = info.status.value;
				});
			},
			delData(){
				let that = this;
				that.mtitle = '提示';
				that.mcontent = '是否确定删除？';
				that.$refs.popupTip.open(() => {
					app._post_form('shop.goods.stock_check/delete', {check_id: that.check_id}, res => {
						that.$api.msg(res.msg,1500,true)
						setTimeout(()=>{uni.navigateBack()},1500)
					})
				})
			},
		},
	}
</script>

<style lang="scss">
	@import '@/pages/myGoods/coupon/detail.scss';
	@import 'add';
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
</style>
