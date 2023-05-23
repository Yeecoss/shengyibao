<template>
	<view class="new pad_lr30">
	  <view class="main_goods" v-for="(item, index) in list.data" :key="index">
	    <!-- 商品图片 -->
	    <picture-group :images="item.goods.image"></picture-group>
	    <view class="main_goods_right">
	      <!-- 商品标题 -->
	      <view class="main_goods_title_box m-top10">
	        <view>
	          <text class="main_goods_title twolist-hidden">{{ item.goods.goods_name }}</text>
	        </view>
	        <text class="more f-24 col-m" @tap.stop="onTargetGoods(item.wxapp_goods_id)">更多<text class="iconfont2 icon-gengduobeifen2 f-24"></text></text>
	      </view>
	      <!-- 商品信息 -->
	      <view class="main_goods_desc">
	        <view class="desc_footer dis-flex flex-y-center">
	          <text class="price_x app-red">¥{{ item.goods.min_price }}</text>
	          <text class="price_y col-9" v-if="item.goods.goods_sku.line_price>0&& item.goods.sku && item.goods.sku.length == 1">¥{{ item.goods.goods_sku.line_price }}</text>
	        </view>
	        <!-- <view class="">
	          <text class="desc_introduction onelist-hidden">{{ item.selling_point }}</text>
	        </view> -->
	        <view class="sku f-24">
	          <view v-if="item.goods.goods_multi_spec && item.goods.goods_multi_spec.spec_attr">
	            <view class="sku_item dis-flex flex-y-center" v-for="(item, index2) in item.goods.goods_multi_spec.spec_attr" :key="index2">
	              <view class="sku_title col-9">{{item.group_name}}</view>
	              <view class="onelist-hidden flex-box">
									<block v-for="(vo,ii) in item.spec_items" :key="ii">
										<template>{{vo.spec_value}}<template v-if="ii<(item.spec_items.length-1)">/</template></template>
									</block>
								</view>
	            </view>
	          </view>
	        </view>
	      </view>
	    </view>
	    <view class="optbox">
	      <view class="oper-item f-24 col-6" @tap.stop="upload(item.goods.image)"><text class="iconfont2 icon-download f-30"></text>下载</view>
	     <!-- <view class="oper-item f-24 col-6" v-if="item.open_dealer" @tap.stop="toUpData(item)"><text class="iconfont2 icon-synchro f-30"></text>同步</view>
	      <view class="oper-item f-24 col-6" @tap.stop="toCopyData(item)"><text class="iconfont2 icon-copy1 f-30"></text>复制</view> -->
				<view class="oper-item f-24 col-6" @tap.stop="toShare(item)"><text class="iconfont2 icon-share f-30"></text>分享</view>
	      <button class="settlement" style="padding:0" @tap.stop="openDialog(item)">立即购买</button>
	    </view>
	  </view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import pictureGroup from '@/components/goods/picture-group/index';
	export default {
		components:{
			pictureGroup
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
