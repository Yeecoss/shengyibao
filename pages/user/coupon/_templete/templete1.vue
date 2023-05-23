<template>
	<view class="coupon-list" :class="[homeStyle+'-list']" v-if="list.length">
		<view class="coupon-item bgf radius16" v-for="(item, index) in list" :key="index">
			<!-- 店铺信息 -->
			<view class="wxapp-wrap dis-flex flex-y-center flex-x-between m-b-30">
				<view class="wxapp-logo"><image :src="item.logo" mode="aspectFill"></image></view>
				<view class="wxapp-name onelist-hidden flex-box m-l-20 m-r-30 f-30">{{item.name}}</view>
				<view class="f-24 t-c wxapp-btn" v-if="item.wxapp_id!=wxapp_id" @tap.stop="toHome(item.wxapp_id)">
					进店看看
				</view>
			</view>
			
			<!-- 默认模板 -->
			<template v-if="homeStyle=='div'">
				<view class="item-wrapper col-9 dis-flex flex-y-center m-b-20 common-shadow" v-for="(item2,k) in item.coupons" :key="k" :class="!item2.state.value&&!item2.is_receive?'gray-item':''">
					<view class="tip dis-flex flex-dir-column flex-x-center col-f">
						<view v-if="item2.coupon_type.value == 10">
							<text class="f-30">￥</text>
							<text class="money">{{ item2.reduce_price }}</text>
						</view>
						<text class="money" v-if="item2.coupon_type.value == 20">{{ item2.discount }}折</text>
						<text class="pay-line">满{{ item2.min_price }}元可用</text>
					</view>
					<view class="middle flex-box oh p-l-30 p-r-30">
						<view class="coupon-type col-3 f-28">{{ item2.coupon_type.text }}</view>
						<view class="time flex-box f-24 m-t-20 break-all">
							<text v-if="item2.expire_type == 10">*领取{{ item2.expire_day }}天内有效</text>
							<text v-if="item2.expire_type == 20">{{ item2.start_time.text }}~{{ item2.end_time.text }}</text>
						</view>
					</view>
					<view class="btn-wrap">
						<view class="state f-28 t-c">
							{{ dataType=='not_use'? '已领取': dataType=='is_use'? '已使用': dataType=='is_expire'? '已过期':''}}
						</view>
					</view>
				</view>
			</template>
			<!-- 卖手圈 -->
			<template v-if="homeStyle=='saler'">
				<view class="item-wrapper col-9 dis-flex flex-wrap flex-y-center m-b-20 common-shadow" v-for="(item2,k) in item.coupons" :key="k" :class="!item2.state.value&&!item2.is_receive?'gray-item':''">
					<view class="tip dis-flex flex-y-center col-f">
						<view v-if="item2.coupon_type.value == 10">
							<!-- <text class="f-30 money-text">￥</text> -->
							<text class="money">{{ item2.reduce_price }}</text>
						</view>
						<view v-if="item2.coupon_type.value == 20">
							<text class="money">{{ item2.discount }}</text>
							<text class="money-text">折</text>
						</view>
						<text class="pay-line">满{{ item2.min_price }}元可用</text>
					</view>
					<view class="btn-wrap">
						<view class="state f-28 t-c">
							{{ dataType=='not_use'? '已领取': dataType=='is_use'? '已使用': dataType=='is_expire'? '已过期':''}}
						</view>
						<!-- <view class="receive-btn f-28 app-red" v-if="item2.state.value" @tap.stop="receive(item2.coupon_id)">
							<text>{{styleClass=='minishop'?'点击领取':'立即领取'}}</text>
						</view>
						<view class="state f-28 t-c" :class="!item2.state.value?'col-9':''" v-else>
							{{ item2.state.text }}
						</view> -->
					</view>
					<view class="middle dis-flex flex-y-center flex-x-between col-6 oh">
						<view class="coupon-type f-24">{{ item2.coupon_type.text }}</view>
						<view class="time f-24 break-all">
							<text v-if="item2.expire_type == 10">*领取{{ item2.expire_day }}天内有效</text>
							<text v-if="item2.expire_type == 20">{{ item2.start_time.text }}~{{ item2.end_time.text }}</text>
						</view>
					</view>
				</view>
			</template>
			<!-- 小商店 -->
			<template v-if="homeStyle=='minishop'">
				<view class="item-wrapper col-9 dis-flex flex-y-center m-b-20 common-shadow" v-for="(item2,k) in item.coupons" :key="k" :class="!item2.state.value&&!item2.is_receive?'gray-item':''">
					<view class="left-wraper dis-flex flex-y-center">
						<view class="tip">
							<view class="dis-flex flex-y-top" v-if="item2.coupon_type.value == 10">
								<text class="money">{{ item2.reduce_price }}</text>
								<text class="f-24 money-text">￥</text>
							</view>
							<view class="dis-flex flex-y-top" v-if="item2.coupon_type.value == 20">
								<text class="money">{{ item2.discount }}</text>
								<text class="money-text">折</text>
							</view>
						</view>
						<view class="middle flex-box theme4_gray f-24 oh">
							<view class="time break-all">
								<text class="coupon-type">{{ item2.coupon_type.text }}/</text>
								<text v-if="item2.expire_type == 10">领取{{ item2.expire_day }}天内有效</text>
								<text v-if="item2.expire_type == 20">{{ item2.start_time.text }}~{{ item2.end_time.text }}</text>
							</view>
							<text class="pay-line">满{{ item2.min_price }}元可用</text>
						</view>
					</view>
					<view class="btn-wrap">
						<view class="state f-28 t-c">
							{{ dataType=='not_use'? '已领取': dataType=='is_use'? '已使用': dataType=='is_expire'? '已过期':''}}
						</view>
						<!-- <view class="receive-btn f-24 app-red" v-if="item2.state.value" @tap.stop="receive(item2.coupon_id)">
							<text>{{styleClass=='minishop'?'点击领取':'立即领取'}}</text>
						</view>
						<view class="state f-24 t-c" :class="!item2.state.value?'theme4_gray':''" v-else>
							{{ item2.state.text }}
						</view> -->
					</view>
				</view>
			</template>
			<!-- 运动模板 -->
			<template v-if="homeStyle=='sportshop'">
				<view class="item-wrapper theme4_gray dis-flex flex-y-center m-b-20 common-shadow" v-for="(item2,k) in item.coupons" :key="k" :class="!item2.state.value&&!item2.is_receive?'gray-item':''">
					<view class="tip dis-flex flex-dir-column flex-x-center">
						<view v-if="item2.coupon_type.value == 10">
							<text class="f-32 money-text">￥</text>
							<text class="money">{{ item2.reduce_price }}</text>
						</view>
						<view v-if="item2.coupon_type.value == 20">
							<text class="money">{{ item2.discount }}</text>
							<text class="f-32 money-text">折</text>
						</view>
					</view>
					<view class="middle flex-box oh p-r-30">
						<view class="time flex-box f-28 break-all">
							<text v-if="item2.expire_type == 10">领取{{ item2.expire_day }}天内有效</text>
							<text v-if="item2.expire_type == 20">{{ item2.start_time.text }}~{{ item2.end_time.text }}</text>
						</view>
						<view class="coupon-type f-28 m-t-10 dis-flex">
							<text class="p-l-10 p-r-10 col-f coupon_type_txt">{{ item2.coupon_type.text }}</text>
							<text class="pay-line f-24">满{{ item2.min_price }}元可用</text>
						</view>
					</view>
					<view class="btn-wrap">
						<view class="state f-28 t-c">
							{{ dataType=='not_use'? '已领取': dataType=='is_use'? '已使用': dataType=='is_expire'? '已过期':''}}
						</view>
						<!-- <view class="receive-btn f-24 app-red" v-if="item2.state.value" @tap.stop="receive(item2.coupon_id)">
							<text>{{styleClass=='minishop'?'点击领取':'立即领取'}}</text>
						</view>
						<view class="state f-24 t-c" :class="!item2.state.value?'col-9':''" v-else>
							{{ item2.state.text }}
						</view> -->
					</view>
				</view>
			</template>
			
		</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default{
		props: {
			
		},
		data(){
			return{
				// 选项卡标示
				dataType: 'not_use',
				wxapp_id: '',
				homeStyle: 'div',
				list: [],// 优惠券列表
			}
		},
		methods:{
			_show(data){
				this.list = data.list;
				this.homeStyle = data.homeStyle;
				this.wxapp_id = data.wxapp_id;
			},
			// 进店看看
			toHome(wid){
				if (wid) {
				  app.wxapp_id = wid;
				  wx.setStorageSync("wxapp_id", wid);
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/pages/coupon/_templete/templete1/index';
	/* 列表 */
	.coupon-list {
	  padding: 20rpx 30rpx;
	  box-sizing: border-box;
	}
	.item-wrapper:last-child{margin-bottom: 0;}
	.coupon-item{
		padding: 30rpx 20rpx;
	}
	.sportshop-list{
		.item-wrapper .tip{
			width: 190rpx;
		}
		.btn-wrap .receive-btn,.btn-wrap .state{
			width: 92rpx;
			padding: 0 22rpx 0 28rpx;
		}
	}
	// 店铺信息
	.wxapp-wrap{
		.wxapp-logo{
			width: 64rpx;
			height: 64rpx;
			background: #D8D8D8;
			border-radius: 50%;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				display: block;
			}
		}
		.wxapp-btn{
			width: 128rpx;
			line-height: 40rpx;
			color: $red;
			border-radius: 24rpx;
			border: 1rpx solid $red;
		}
	}
</style>
