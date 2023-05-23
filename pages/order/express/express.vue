<template>
	<view class="bgf5 min_h_100">
		<!-- 自定义标题栏 -->
		<navigationBar title="查看物流" extClass="nav" id="top"></navigationBar>
		<view class="container p-bottom">
			<!-- 物流公司 -->
			<view class="logisic-top dis-flex flex-y-center b-f wrap30 f-28">
				<div class="goods m-r-20" v-if="goods!=''">
					<image :src="goods.file_path" mode="aspectFill"></image>
					<view class="goods_num col-f f-24 t-c">共{{goods.goods_num}}件</view>
				</div>
				<view class="flex-box logisic-text">
					<view class="dis-flex col-3 m-t-20 m-b-20">
						<text class="col-6">物流状态： </text>{{State_text}}
					</view>
					<view class="dis-flex col-3 m-t-20 m-b-20">
						<text class="col-6">物流公司： </text>{{express.express_company}}
					</view>
					<view class="dis-flex col-3 m-t-20 m-b-20">
						<text class="col-6">物流单号： </text><text user-select="true">{{express.express_no}}</text>
					</view>
				</view>
			</view>
			<!-- 物流动态 -->
			<view class="logis-detail m-top20 b-f bgf" v-if="express_list!=''">
				<!-- <view :class="'logis-item ' + { index == 0? 'first ':'', index==0&&State==3?'isRecive':'' }" v-for="(item, index) in express_list" :key="index"> -->
				<view :class="'logis-item ' + (index==0&&State==3?'isRecive':'')" v-for="(item, index) in express_list" :key="index">
					<view class="dot"><view><text v-if="index==0&&State==3" class="iconfont2 icon-duihao col-f f-24 f-w"></text></view></view>
					<view class="logis-item-content">
						<view class="logis-item-content__describe">
							<text class="f-26">{{ item.AcceptStation }}</text>
						</view>
						<view class="logis-item-content__time">
							<text class="f-22">{{ item.AcceptTime }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="tui-order-tracking" v-if="express_list!=''">
				<tui-time-axis>
					<tui-timeaxis-item backgroundColor="transparent" v-for="(item, index) in express_list" :key="index" :class="index === 0 ? 'first' : ''">
						<template v-slot:node>
							<view class="tui-node">
								<tui-icon name="check" color="#fff" :size="12" :bold="true" v-if="State==3&&index==0"></tui-icon>
							</view>
						</template>
						<template v-slot:content>
							<view class="tui-order-desc tui-light-gray">{{ item.AcceptStation }}</view>
							<view class="tui-order-time tui-light-gray">{{ item.AcceptTime }}</view>
						</template>
					</tui-timeaxis-item>
				</tui-time-axis>
			</view> -->
			<!-- 无数据 -->
			<tui-no-data imgUrl="http://pic.kaidanxia.com/2020-06-22/202006221449022b5c05125.png" :imgWidth="264" :imgHeight="264" v-if="express_list==''">
				<view class="col-9">暂无轨迹信息</view>
			</tui-no-data>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;

	export default {
		data() {
			return {
				sub_order_no: '',
				goods: {},
				express: {},
				State:'',//物流动态状态
				express_list: [],//物流动态
			};
		},
		components: {},
		onLoad(options) {
			this.sub_order_no = options.order_no||'';
			this.express = JSON.parse(decodeURIComponent(options.express))||'';
			this.goods = JSON.parse(decodeURIComponent(options.goods))||'';
			// this.getExpress();
		},
		computed:{
			State_text(){
				if(this.State==1){
					return '已揽收'
				}else if(this.State==2){
					return '在途中'
				}else if(this.State==3){
					return '已签收'
				}else if(this.State==4){
					return '问题件'
				}else{
					return '暂无轨迹信息'
				}
			}
		},
		methods: {
			// 获取物流动态
			getExpress(){
				app._get('shop.order/seeExpress', {
					sub_order_no: this.sub_order_no
				}, res => {
					this.express_list = res.data.Traces.reverse()
					this.State = res.data.State;
				})
			},
		}
	};
</script>
<style lang="scss">
	@import "./express";
	.tui-order-tracking {
		padding: 30rpx 30rpx 30rpx 40rpx;
		background: #fff;
		margin-top: 20rpx;
		box-sizing: border-box;
	}
	.tui-node {
		height: 26rpx;
		width: 26rpx;
		border-radius: 50%;
		background-color: #DEDEDE;
		border: 20rpx solid #fff;
		margin-top: -16rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		flex-shrink: 0;
	}
	.tui-order-title {
		padding-bottom: 12rpx;
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	.tui-order-desc {
		padding-bottom: 12rpx;
		font-size: 24rpx;
		color: #333;
	}
	.tui-order-time {
		font-size: 24rpx;
	}
	.first .tui-node {
		height: 36rpx;
		width: 36rpx;
		background-color: $red;
	}
	.first .tui-order-desc, .first .tui-order-time{
		color: #333;
	}
	.tui-light-gray {
		color: #999;
	}
</style>
