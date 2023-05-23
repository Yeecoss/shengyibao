<template>
<view v-if="goodsLikeList.length">
	<view class="gray-bg20"></view>
  <view class="pad_lr30 p-b-20">
    <view class="top-nav b-f">
      <view class="top-nav-bar col-0 f-30">猜你喜欢</view>
    </view>
    <view class="likes-wrap dis-flex flex-wrap">
    	<view class="likes-item" v-for="(item,index) in goodsLikeList" :key="index" @tap="toDetail(item.wxapp_goods_id)">
    		<view class="likes-pic"><image :src="item.goods.goods_image" mode="aspectFill"></image></view>
				<view class="mgoods_detail">
					<view class="mgoods_name twolist-hidden f-28 col-3">{{item.goods.goods_name||''}}</view>
					<view class="mgoods_price f-28 m-t-10 col-3 onelist-hidden">¥{{ item.goods.min_price }}</view>
				</view>
    	</view>
    </view>
  </view>
</view>
</template>

<script>

export default { 
	data() {
		return {
		}
	},
	props: {
    goodsLikeList: {
      type: Array,
      default: () => []
    }
	},
	methods:{
		//详情
		toDetail(id){
			uni.navigateTo({
				url: '/pages/goods/index?goods_id=' + id
			})
		},
  }
}
</script>
<style lang="scss">
	@import "./index.scss";
</style>