<template>
	<view>
		<!-- 确认购买弹窗 -->
		<popup :show="ifshow" type="bottom" @clickmask="close">
			<view class="popup-main" v-if="ifshow" catchtouchmove='true'>
				<view class="popupBox">
					<view class="titleBox dis-flex flex-x-between">
						<view class="title">
							已选菜品
						</view>
						<view class="clear" @tap="onDelete">
							<text class="iconfont2 icon-recyclebin f-26"></text>清空菜品
						</view>
					</view>
					<scroll-view scroll-y class="listBox">
						<view style="padding: 0 32rpx">
							<view class="list" v-for="(item, index) in list" :key="index">
								<view class="g-box m-b-30 dis-flex flex-x-between">
									<view class="g-box-pic">
										<image lazy-load mode="aspectFill" :src="item.goods.goods_image"
											class="g-image" />
									</view>
									<view class="g-box-info flex-box m-l-20">
										<view class="g-title onelist-hidden f-30 col-3 f-w">{{item.goods.goods_name}}
										</view>
										<view class="goods-attr onelist-hidden col-7 f-24"
											v-if="item.goods_sku && item.goods_sku.goods_attr">
											{{item.goods_sku.goods_attr}}
										</view>
										<view class="f-26 col-6 m-t-4" style="line-height: 36rpx;">
											销量{{item.goods.goods_sales||0}}</view>
										<view class="app-red f-32 f-w min_price"><text
												class="f-26">¥</text>{{item.goods.min_price||0}}</view>
										<view class="prolist-addBox dis-flex">
											<tui-numberbox :value="item.total_num" :disabledInput="true" :width="56"
												:min="0" :height="44" backgroundColor="#fff"
												@change="onInputGoodsNum($event,item)"></tui-numberbox>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	const app = getApp().globalData;
	import popup from "@/components/pop-manager/index";
	export default {
		components: {
			popup
		},
		props: {
			list: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				ifshow: false
			};
		},
		methods: {
			_open(data, btnType) {
				this.ifshow = true
			},
			//关闭弹窗
			close() {
				this.ifshow = false;
				this.$emit('footOptShadowShow');
			},
			onInputGoodsNum(e, goods) {
				this.$emit('getGoodsNum', {
					e,
					goods
				})
			},
			getCheckedIds() {
				let arrIds = [];
				this.list.forEach(item => {
					arrIds.push(`${item.wxapp_goods_id}_${item.spec_sku_id}`);
				});
				return arrIds;
			},
			onDelete() {
				let _this = this,
					cartIds = _this.getCheckedIds();

				if (!cartIds.length) {
					app.showError('您还没有选择菜品');
					return false;
				}

				wx.showModal({
					title: "提示",
					content: "您确定要清空菜品吗?",

					success(e) {
						e.confirm && app._post_form('cart/delete', {
							goods_sku_id: cartIds
						}, result => {
							_this.$emit('getCartList')
						});
					}

				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
