<template>
<!-- 买单 -->
<view class="diy-check">
	<image class="bg" src="/static/images/checkBg.png" mode="aspectFill"></image>
	<view class="checkBox dis-flex flex-x-between flex-y-center">
		<view class="leftBox">
			<view class="title">
				<text class="titleText">买单</text>
				<text>半年售1200</text>
			</view>
			<view class="price">
				9.5折（每天{{wxapp.biz_start}}~{{wxapp.biz_end}}）
			</view>
		</view>
		<view class="checkBut" @tap="toBuy">
			买单
		</view>
	</view>
</view>
</template>

<script>
const App = getApp().globalData;

export default {
  data() {
    return {
	};
  },

  components: {},
  props: {
	wxapp: {
		type: Object,
		default: () => {
			return {}
		}
	},
	cartList: {
		type: Array,
		default: () => {
			return []
		}
	},
	coupon_id: {
		type: [Number, String],
		default: 0
	},
  },
  mounted() {  
  },
  methods: {
	getCheckedIds() {
		let arrIds = [];
		this.cartList.forEach(item => {
			arrIds.push(`${item.wxapp_goods_id}_${item.spec_sku_id}`);
		});
		return arrIds;
	},
	/**
	 * 买单
	 */
	toBuy() {
		let cartIds = this.getCheckedIds();
		if (!cartIds.length) {
			this.$api.msg('您还没有选择商品');
			return false;
		}
		uni.navigateTo({
			url: '/pages/flow/checkout?order_type=cart&cart_ids=' + cartIds + '&wxapp_id=' + App.wxapp_id + '&checkType=' + 1 + '&coupon_id=' + this.coupon_id
		});
	},
  }
};
</script>
<style lang="scss">
@import "./index.scss";
</style>