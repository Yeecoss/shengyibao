<template>
	<view>
			<view :class="'goods-list ' + listClass" @change="choose">
				<view class="goods-list-wrap">
					<view class="goods-item" v-for="(dataItem, index) in listData" :key="dataItem.wxapp_goods_id" v-if="(index + 1) % 2 != 0" @tap="toDetail(dataItem.wxapp_goods_id)">
						<!-- 商品图片 -->
						<view class="goods-item_pic check-wrap">
							<image lazy-load :src="dataItem.goods_image" mode="aspectFill"></image>
						</view>
					
						<view class="detail">
							<!-- 商品名称 -->
							<view class="goods-name twolist-hidden">
								<text>{{ dataItem.goods_name || dataItem.goods.goods_name }}</text>
							</view>
							<view class="desc_footer dis-flex flex-y-center flex-x-between">
								<view class="goods_sales col-9">销量{{ dataItem.goods?dataItem.goods.goods_sales : dataItem.goods_sales || 0}}</view>
								<view class="goods_price1"><text>¥</text>{{ dataItem.goods_price ||dataItem.goods.min_price }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="goods-list-wrap">
					<view class="goods-item" v-for="(dataItem, index) in listData" :key="dataItem.wxapp_goods_id" v-if="(index + 1) % 2 == 0" @tap="toDetail(dataItem.wxapp_goods_id)">
						<!-- 商品图片 -->
						<view class="goods-item_pic check-wrap">
							<image lazy-load :src="dataItem.goods_image || dataItem.goods.goods_image" mode="aspectFill"></image>
						</view>
						<view class="detail">
							<!-- 商品名称 -->
							<view class="goods-name twolist-hidden">
								<text>{{ dataItem.goods_name || dataItem.goods.goods_name }}</text>
							</view>
							<view class="desc_footer dis-flex flex-y-center flex-x-between">
								<view class="goods_sales col-9">销量{{ dataItem.goods?dataItem.goods.goods_sales : dataItem.goods_sales || 0 }}</view>
								<view class="goods_price1"><text>¥</text>{{dataItem.goods_price ||dataItem.goods.min_price }}</view>
							</view>
						</view>
					</view>
				</view>
		
			</view>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import updata from '@/components/updata/updata';
	export default {
		components: {
			updata
		},
		props: {
			listClass: {
				type: String,
				default: ''
			},
			// 数据列表
			list: {
				type: Array,
				default() {
					return []
				}
			},
		},
		data() {
			return {
				listData: this.list || [],
			}
		},
		watch: {
		  list: function observer(newVal,oldVal) {
				if (newVal) {
					this.listData = newVal;
				}else{
					this.listData = oldVal;
				}
		  }
		},
		methods: {
			// 去详情
			toDetail(id){
				uni.navigateTo({
					url: '/pages/goods/index?goods_id='+id,
				})
			},
		}
	}
</script>

<style lang="scss">
	@import "index.scss";
</style>