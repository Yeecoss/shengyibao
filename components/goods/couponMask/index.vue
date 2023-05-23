<template>
	<view>
		<!-- 确认购买弹窗 -->
		<popup :show="ifshow" type="bottom" @clickmask="close">
			<view class="popup-main" v-if="ifshow" catchtouchmove='true'>
				<view class="popupBox">
					<view class="titleBox dis-flex flex-x-between">
						<view class="title">
							优惠明细
							<view class="tip">
								实际结算金额以提交订单页为准
							</view>
						</view>
						<view class="clear" @tap="close">
							<text class="iconfont2 icon-Wrong f-26"></text>
						</view>
					</view>
					<view class="listBox">
						<view class="list dis-flex flex-x-between">
							<view class="listName col-3 f-30">
								商品合计
							</view>
							<view class="price col-3">
								<text class="f-26">￥</text>{{order_price}}
							</view>
						</view>
					</view>
					<view class="listBox">
						<view class="list dis-flex flex-x-between">
							<view class="listName col-3 f-30">
								共优惠
							</view>
							<view class="price f-30 app-color">
								-￥{{coupon_money}}
							</view>
						</view>
						<radio-group @change="radioChange">
							<label class="list dis-flex flex-x-between col-6 f-26" v-for="(item, index) in coupon_list" :key="index">
								<view class="listName">
									<radio style="transform:scale(0.7)" :value="item.user_coupon_id" @ :checked="coupon_id == item.user_coupon_id" />
									{{item.name}}
								</view>
								<view class="price">
									-￥{{item.reduced_price}}
								</view>
							</label>
						</radio-group>
					</view>
					<view class="listBox">
						<view class="list dis-flex flex-x-between">
							<view class="listName col-3 f-30">
								优惠后合计
							</view>
							<view class="price col-3 f-30">
								<text class="f-26">￥</text>{{cartTotalPrice}}
							</view>
						</view>
					</view>
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
			coupon_list: {
				type: Array,
				default: () => {
					return []
				},
			},
			cartTotalPrice: {
				type: String || Number,
				default: ''
			},
			order_price: {
				type: String || Number,
				default: ''
			},
			coupon_id: {
				type: String || Number,
				default: ''
			},
			coupon_money: {
				type: String || Number,
				default: ''
			},
		},
		computed: {
			allNum() {
				let num = 0;
				
				return num;
			}
		},
		data() {
			return {
				ifshow: false
			};
		},
		methods: {
			_open() {
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
			radioChange(e) {
				console.log(e);
				this.$emit('upCoupon', e.detail.value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import './index.scss';
</style>
