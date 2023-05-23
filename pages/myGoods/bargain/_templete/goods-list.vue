<!-- 砍价列表 -->
<template>
	<view>
		<view class="list-wrap bgf m-t-20" v-for="(item,index) in listData" :key="index">
			<view class="list-con dis-flex">
				<view class="list-img oh m-r-20 bgf5">
					<image :src="item.goods_image||defaultImg" mode="aspectFill"></image>
				</view>
				<view class="list-txt flex-box dis-flex flex-dir-column flex-x-between">
					<view class="dis-flex flex-y-center flex-x-between">
						<view class="goods-name onelist-hidden f-28 flex-box oh">{{item.goods_name}}</view>
						<view class="operate-btn dis-flex flex-y-center flex-x-center m-l-20" @tap.stop="openSheet(item)">
							<text class="iconfont2 icon-more-mini f-30"></text>
						</view>
					</view>
					<template v-if="currentTab==0">
						<view class="dis-flex flex-y-center flex-wrap stateBox">
						  <view class="onelist-hidden" style="max-width:200rpx">砍价低价:{{item.floor_price}}</view>
						  <view class="line"></view>
						  <view class="onelist-hidden" style="max-width:200rpx">帮砍人数:{{item.peoples}}</view>
						  <view class="line"></view>
						  <view class="dis-flex flex-y-center souceContentBox">
						    <view class="souceLabel">活动状态:</view>
						    <view class="souceContent app-red">{{item.status?'启用':'禁用'}}</view>
						  </view>
						</view>
						<view class="dis-flex flex-y-center flex-wrap stateBox">
						  <view class="onelist-hidden">实际销量:{{item.actual_sales}}</view>
						  <view class="line"></view>
						  <view class="onelist-hidden">创建时间:{{item.create_time}}</view>
						</view>
					</template>
					<template v-else>
						<view class="dis-flex flex-y-center flex-wrap stateBox">
							<view class="dis-flex flex-y-center buyer">
							  <view class="buyer-img m-r-10">
									<image :src="item.avatarUrl||defaultImg" mode="aspectFill"></image>
								</view>
								<view class="onelist-hidden" style="max-width:100rpx">{{item.nickName||''}}</view>
							</view>
						  <view class="line"></view>
						  <view class="onelist-hidden" style="max-width:200rpx">砍价底价:{{item.floor_price}}</view>
						  <view class="line"></view>
						  <view class="onelist-hidden" style="max-width:200rpx">已砍金额:{{item.cut_money}}</view>
						</view>
						<view class="dis-flex flex-y-center flex-wrap stateBox">
						  <view class="onelist-hidden" style="max-width:200rpx">是否购买:{{item.is_buy?'已购买':'未购买'}}</view>
						  <view class="line"></view>
						  <view class="dis-flex flex-y-center souceContentBox">
						    <view class="souceLabel">砍价状态:</view>
						    <view class="souceContent app-red">{{item.status?'砍价中':'已结束'}}</view>
						  </view>
						</view>
					</template>
				</view>
			</view>
			<view class="activity-time f-24 col-6 bgf7 m-t-20">
				{{currentTab==0?'活动时间:'+item.start_time+'～'+item.end_time: '截止时间:'+item.end_time}}
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		name:'barginList',
		props:{
		},
		data(){
			return{
				defaultImg:'/static/images/defaultImg.png',
				listData: [],
				currentTab: 0,
			}
		},
		methods:{
			// 显示
			_show(data){
				let list = JSON.parse(JSON.stringify(data.list)) || [];
				this.listData = list;
				this.currentTab = data.currentTab;
			},
			// 点击操作按钮
			openSheet(item){
				this.$emit('openSheet',item)
			},
		}
	}
</script>

<style lang="scss">
	// 重置
	image{
		display: block;
		width: 100%;
		height: 100%;
	}
	view,scroll-view{
		box-sizing: border-box;
	}
	.list-wrap{
		padding: 20rpx 30rpx;
		.list-img{
			width: 144rpx;
			height: 144rpx;
			border-radius: 8rpx;
		}
		.activity-time{
			padding: 16rpx 12rpx;
		}
		.operate-btn{
			width: 46rpx;
		}
		.stateBox{
				color: #666;
				font-size: 24rpx;
				margin-top: 10rpx;
				.line{
						height: 24rpx;
						width: 1rpx;
						background: #D8D8D8;
						margin: 0 10rpx;
				}
				.updataIcon{
						font-size: 24rpx;
						margin-left: 10rpx;
						color: #FF7541;
				}
		}
		.buyer-img{
			width: 44rpx;
			height: 44rpx;
			border-radius: 50%;
			overflow: hidden;
		}
	}
</style>
