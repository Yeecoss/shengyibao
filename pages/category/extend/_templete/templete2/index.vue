<template>
	<view class="new pad_lr30">
	  <view class="main_goods dis-flex flex-x-between" v-for="(item, index) in list.data" :key="index" @tap.stop="onTargetGoods(item.wxapp_goods_id)">
	    <!-- 商品图片 -->
			<view class="goods_pic radius16 oh">
				<image :src="item.goods.goods_image" mode="aspectFill"></image>
			</view>
	    <view class="main_goods_right flex-box oh p-l-20">
	      <!-- 商品标题 -->
	      <view class="main_goods_title_box">
	        <text class="main_goods_title twolist-hidden">{{ item.goods.goods_name }}</text>
	      </view>
	      <!-- 商品信息 -->
	      <view class="main_goods_desc">
	        <view class="desc_footer dis-flex flex-y-center">
	          <text class="price_x app-red">¥{{ item.goods.min_price }}</text>
	          <text class="price_y col-9" v-if="item.goods.goods_sku.line_price>0&& item.goods.sku && item.goods.sku.length == 1">¥{{ item.goods.goods_sku.line_price }}</text>
	        </view>
					<!-- 操作 -->
					<view class="optbox1 oh">
						<view class="oper-item f-24 col-6 fl" @tap.stop="upload(item.goods.image)"><text class="iconfont2 icon-download f-30"></text>下载</view>
						<view class="oper-item f-24 col-6 fl" @tap.stop="toShare(item)"><text class="iconfont2 icon-share f-30"></text>分享</view>
						<button class="settlement fr" style="padding:0" @tap.stop="openDialog(item)">立即购买</button>
					</view>
	      </view>
	    </view>
	  </view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	export default {
		components:{
		},
		data() {
			return {
				// 列表
				// list: [],
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
			// 跳转商品详情页
			onTargetGoods(id) {
			  uni.navigateTo({
			    url: '/pages/goods/index?goods_id=' + id
			  });
			},
			upload(image){
				this.$emit('upload',image)
			},
			//点击分享
			toShare(item){
				this.$emit('toShare',item)
			},
			//立即购买
			openDialog(item){
				this.$emit('toBuy',item)
			},
		}
	}
</script>

<style lang="scss">
	@import 'index';
</style>
