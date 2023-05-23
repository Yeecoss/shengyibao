<template>
	<view class="coupon-list">
	  <view class="coupon-item" v-for="(item, index) in list" :key="index">
	    <view class="item-wrapper"><!--color__{{ item.state.value ? item.color.text : 'gray' }}-->
	      <view class="coupon-type">{{ item.coupon_type.text }}</view>
	      <view class="tip dis-flex flex-dir-column flex-x-center">
	        <view v-if="item.coupon_type.value == 10">
	          <text class="f-30">￥</text>
	          <text class="money">{{ item.reduce_price }}</text>
	        </view>
	        <text class="money" v-if="item.coupon_type.value == 20">{{ item.discount }}折</text>
	        <text class="pay-line">满{{ item.min_price }}元可用</text>
	      </view>
	      <view class="split-line">
	        <view class="cro_left_top"></view>
	        <view class="cro_right_top"></view>
	        <view class="cro_left_bottom"></view>
	        <view class="cro_right_bottom"></view>
	      </view>
	      <view class="content dis-flex flex-dir-column flex-x-between">
	        <!-- <view class="title">{{ item.name }}</view> -->
	        <view class="bottom">
	          <view class="time flex-box f-20 t-r">
	            <text v-if="item.expire_type == 10">*领取{{ item.expire_day }}天内有效</text>
	            <text v-if="item.expire_type == 20">{{ item.start_time.text }}~{{ item.end_time.text }}</text>
	          </view>
	          <view class="receive f-24 col-f" v-if="item.state.value" @tap.stop="receive(item.coupon_id)">
	            <text>立即领取</text>
	          </view>
	          <view class="receive state flex-cen" v-else>
	            <view class="flex-cen">{{ item.state.text }}</view>
	          </view>
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
		},
		methods:{
			receive(coupon_id){
				this.$emit('receive',coupon_id)
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
