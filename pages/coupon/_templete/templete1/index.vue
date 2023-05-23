<template>
	<view class="coupon-list" :class="[styleClass,homeStyle+'-list']">
	  <view class="coupon-item" v-for="(item, index) in list" :key="index" :class="!item.state.value&&!item.is_receive?'gray-item':''" @tap="toCoupon">
			<!-- 默认模板 -->
	    <view class="item-wrapper col-9 dis-flex flex-y-center" v-if="homeStyle=='div'">
	      <view class="tip dis-flex flex-dir-column flex-x-center col-f">
	        <view v-if="item.coupon_type.value == 10">
	          <text class="f-30 money-text">￥</text>
	          <text class="money">{{ item.reduce_price }}</text>
	        </view>
	        <text class="money" v-if="item.coupon_type.value == 20">{{ item.discount }}折</text>
	        <text class="pay-line">满{{ item.min_price }}元可用</text>
	      </view>
				<view class="middle flex-box oh p-l-30 p-r-30">
					<view class="coupon-type col-3 f-28">{{ item.coupon_type.text }}</view>
					<view class="time flex-box f-24 m-t-20 break-all">
						<text v-if="item.expire_type == 10">领取{{ item.expire_day }}天内有效</text>
						<text v-if="item.expire_type == 20">{{ item.start_time.text }}~{{ item.end_time.text }}</text>
					</view>
				</view>
				<view class="btn-wrap">
					<view class="receive-btn f-28 app-red" v-if="item.state.value" @tap.stop="receive(item.coupon_id)">
						<text>{{styleClass=='minishop'?'点击领取':'立即领取'}}</text>
					</view>
					<view class="state f-28 t-c" :class="!item.state.value?'col-9':''" v-else>
						{{ item.state.text }}
					</view>
				</view>
	    </view>
			<!-- 卖手圈 -->
			<view class="item-wrapper col-9 dis-flex flex-wrap flex-y-center" v-if="homeStyle=='saler'">
				<view class="tip dis-flex flex-y-center col-f">
					<view v-if="item.coupon_type.value == 10">
						<!-- <text class="f-30 money-text">￥</text> -->
						<text class="money">{{ item.reduce_price }}</text>
					</view>
					<view v-if="item.coupon_type.value == 20">
						<text class="money">{{ item.discount }}</text>
						<text class="money-text">折</text>
					</view>
					<text class="pay-line">满{{ item.min_price }}元可用</text>
				</view>
				<view class="btn-wrap">
					<view class="receive-btn f-28 app-red" v-if="item.state.value" @tap.stop="receive(item.coupon_id)">
						<text>{{styleClass=='minishop'?'点击领取':'立即领取'}}</text>
					</view>
					<view class="state f-28 t-c" :class="!item.state.value?'col-9':''" v-else>
						{{ item.state.text }}
					</view>
				</view>
				<view class="middle dis-flex flex-y-center flex-x-between col-6 oh">
					<view class="coupon-type f-24">{{ item.coupon_type.text }}</view>
					<view class="time f-24 break-all">
						<text v-if="item.expire_type == 10">*领取{{ item.expire_day }}天内有效</text>
						<text v-if="item.expire_type == 20">{{ item.start_time.text }}~{{ item.end_time.text }}</text>
					</view>
				</view>
			</view>
			<!-- 小商店 -->
			<view class="item-wrapper col-9 dis-flex flex-y-center" v-if="homeStyle=='minishop'">
				<view class="left-wraper dis-flex flex-y-center">
					<view class="tip">
						<view class="dis-flex flex-y-top" v-if="item.coupon_type.value == 10">
							<text class="money">{{ item.reduce_price }}</text>
							<text class="f-24 money-text">￥</text>
						</view>
						<view class="dis-flex flex-y-top" v-if="item.coupon_type.value == 20">
							<text class="money">{{ item.discount }}</text>
							<text class="money-text">折</text>
						</view>
					</view>
					<view class="middle flex-box theme4_gray f-24 oh">
						<view class="time break-all">
							<text class="coupon-type">{{ item.coupon_type.text }}/</text>
							<text v-if="item.expire_type == 10">领取{{ item.expire_day }}天内有效</text>
							<text v-if="item.expire_type == 20">{{ item.start_time.text }}~{{ item.end_time.text }}</text>
						</view>
						<text class="pay-line">满{{ item.min_price }}元可用</text>
					</view>
				</view>
				<view class="btn-wrap">
					<view class="receive-btn f-24 app-red" v-if="item.state.value" @tap.stop="receive(item.coupon_id)">
						<text>{{styleClass=='minishop'?'点击领取':'立即领取'}}</text>
					</view>
					<view class="state f-24 t-c" :class="!item.state.value?'theme4_gray':''" v-else>
						{{ item.state.text }}
					</view>
				</view>
			</view>
			<!-- 运动模板 -->
			<view class="item-wrapper theme4_gray dis-flex flex-y-center" :class="!item.state.value&&!item.is_receive?'gray-item':''" v-if="homeStyle=='sportshop'">
			  <view class="tip dis-flex flex-dir-column flex-x-center">
			    <view v-if="item.coupon_type.value == 10">
			      <text class="f-32 money-text">￥</text>
			      <text class="money">{{ item.reduce_price }}</text>
			    </view>
					<view v-if="item.coupon_type.value == 20">
						<text class="money">{{ item.discount }}</text>
						<text class="f-32 money-text">折</text>
					</view>
			  </view>
				<view class="middle flex-box oh p-r-30">
					<view class="time flex-box f-28 break-all">
						<text v-if="item.expire_type == 10">领取{{ item.expire_day }}天内有效</text>
						<text v-if="item.expire_type == 20">{{ item.start_time.text }}~{{ item.end_time.text }}</text>
					</view>
					<view class="coupon-type f-28 m-t-10 dis-flex">
						<text class="p-l-10 p-r-10 col-f coupon_type_txt">{{ item.coupon_type.text }}</text>
						<text class="pay-line f-24">满{{ item.min_price }}元可用</text>
					</view>
				</view>
				<view class="btn-wrap">
					<view class="receive-btn f-24 app-red" v-if="item.state.value" @tap.stop="receive(item.coupon_id)">
						<text>{{styleClass=='minishop'?'点击领取':'立即领取'}}</text>
					</view>
					<view class="state f-24 t-c" :class="!item.state.value?'col-9':''" v-else>
						{{ item.state.text }}
					</view>
				</view>
			</view>
	  </view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		data() {
			return {
				// 优惠券列表
				// list: [],
				notcont: false
			};
		},
		props: {
			list: {
				type: [Object, Array],
				default: () => {
				  return []
				}
			},
			styleClass: String,
			homeStyle:{
				type: String,
				default: 'div'
			}
		},
		methods:{
			receive(coupon_id){
				this.$emit('receive',coupon_id)
			},
			toCoupon(){
				this.$emit('toCoupon')
			}
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
