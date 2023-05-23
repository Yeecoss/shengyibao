<template>
<!-- 优惠券组 -->
<view class="diy-coupon">
	<image class="bg" :src="imgBaseUrl + 'couponBg.png'" mode="aspectFill"></image>
	<view class="coupon-wrapper" @tap="toOther">
		<view class="title dis-flex flex-x-between">
			<view class="text">
				会员专属福利
			</view>
			<view class="more">
				查看更多
				<text class="iconfont2 icon-gengduobeifen2"></text>
			</view>
		</view>
		<view class="cont dis-flex">
			<view class="main">
				<view class="price" v-if="dataList[0].coupon_type.value == 10">
					￥
					<text class="text">{{dataList[0] ? dataList[0].reduce_price : '0'}}</text>
				</view>
				<view class="price" v-if="dataList[0].coupon_type.value == 20">
					<text class="text">{{dataList[0] ? dataList[0].discount : '0'}}</text>
					折
				</view>
				<view class="condition">
					满{{dataList[0] ? dataList[0].min_price : '0'}}元使用
				</view>
				<view class="receive" @tap.stop="receiveTap">
					立即领取
				</view>
				<view class="topSpot"></view>
				<view class="bottomSpot"></view>
			</view>
			<view class="info flex-box">
				<view class="info1" v-if="dataList[0].coupon_type.value == 10">
					全场满{{dataList[0] ? dataList[0].min_price : '0'}}减{{dataList[0] ? dataList[0].reduce_price : '0'}}
				</view>
				<view class="info1" v-if="dataList[0].coupon_type.value == 20">
					全场满{{dataList[0] ? dataList[0].min_price : '0'}}打{{dataList[0] ? dataList[0].discount : '0'}}折
				</view>
				<view class="info2" v-if="dataList[0].expire_type == 20" >
					{{dataList[0] ? dataList[0].start_time.text : ''}}_{{dataList[0] ? dataList[0].end_time.text : ''}}
				</view>
				<view class="info2" v-if="dataList[0].expire_type == 10">
					领取后{{dataList[0] ? dataList[0].expire_day : ''}}天内有效
				</view>
				<view class="info3">
					全场商品
				</view>
				<image v-if="dataList[0] && dataList[0].coupon_type.value == 10" class="couponTip" src="/static/images/couponTip.png" mode="aspectFill"></image>
				<image v-if="dataList[0] && dataList[0].coupon_type.value == 20" class="couponTip" src="/static/images/couponTip1.png" mode="aspectFill"></image>
			</view>
		</view>
    </view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
		imgBaseUrl: App.imgBaseUrl,
	};
  },

  components: {},
  props: {
	dataList: {
		type: Array
	}
  },
  methods: {
    /**
     * 领取优惠券
     */
    receiveTap() {

      getApp().globalData._post_form('user.coupon/receive', {
        coupon_id: this.dataList[0].coupon_id
      }, function (result) {
        getApp().globalData.showSuccess(result.msg);
        _this.setData({
          ['dataList[' + 0 + '].state']: {
            value: 0,
            text: '已领取'
          }
        });
      });
    },
	toOther() {
		uni.navigateTo({
			url: '/pages/coupon/coupon'
		})
	}
  }
};
</script>
<style lang="scss">
@import "./coupon.scss";
</style>